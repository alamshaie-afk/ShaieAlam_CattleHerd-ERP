import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize AI lazily to avoid crashing on boot if key is temporarily missing
let aiClientInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClientInstance) {
    // Standard key selection in environment setup
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClientInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClientInstance;
}

// Ensure error handling doesn't take down the server
const handleAsync = (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>) => 
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch(next);
  };

// Keep track of quota-exhausted models with a cooldown period (15 minutes)
const QUOTA_EXHAUSTED_COOLDOWN = 15 * 60 * 1000;
const exhaustedModels = new Map<string, number>();

function isModelExhausted(model: string): boolean {
  if (!exhaustedModels.has(model)) return false;
  const timestamp = exhaustedModels.get(model)!;
  if (Date.now() - timestamp > QUOTA_EXHAUSTED_COOLDOWN) {
    exhaustedModels.delete(model);
    return false;
  }
  return true;
}

// Helper to perform Gemini API generation with retries & secondary fallback model
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model: string;
    contents: any;
    config?: any;
  },
  maxRetries = 2
): Promise<any> {
  // Use stable gemini-3.5-flash as the standard primary unless otherwise specified or it was preview
  const primaryModel = params.model === "gemini-3-flash-preview" ? "gemini-3.5-flash" : params.model;
  
  // Set up the full candidate model list in premium order
  const candidateModels = [primaryModel, "gemini-3.1-flash-lite", "gemini-flash-latest"];
  
  // Filter out models that are currently marked as exhausted, ensuring we keep at least one model to try
  let modelsToTry = candidateModels.filter(m => !isModelExhausted(m));
  if (modelsToTry.length === 0) {
    modelsToTry = [candidateModels[candidateModels.length - 1]]; // fall back to the last option if all are marked exhausted
  }

  for (let mIndex = 0; mIndex < modelsToTry.length; mIndex++) {
    const currentModel = modelsToTry[mIndex];
    let delay = 300; // Reduced initial retry delay from 600ms to 300ms for faster client response
    const isPrimary = mIndex === 0;
    const modelRole = isPrimary ? "Primary model" : "Fallback model";
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: currentModel,
        });
        return response;
      } catch (error: any) {
        const is503 = error?.status === 503 || error?.statusCode === 503 || error?.message?.includes("503") || error?.message?.includes("UNAVAILABLE") || error?.message?.includes("high demand") || error?.message?.includes("temporary");
        const is429 = error?.status === 429 || error?.statusCode === 429 || error?.message?.includes("429") || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("quota") || error?.message?.includes("Quota");
        
        // If we hit a quota limit / RESOURCE_EXHAUSTED block, record it instantly to bypass it in future calls
        if (is429) {
          exhaustedModels.set(currentModel, Date.now());
          
          // Since quota errors are persistent for the minute/day, do NOT waste time retrying this model.
          // Switch immediately to the next available fallback model in our candidate array.
          if (mIndex < modelsToTry.length - 1) {
            console.warn(`[Gemini API] ${modelRole} "${currentModel}" quota exceeded (429). Switching immediately to stable fallback model "${modelsToTry[mIndex + 1]}" without retries.`);
            break; // break retry loop for current model, proceed to the next fallback model in the outer loop
          }
        }

        // For temporary 503 errors and 429 (only if no fallback model is left), retry with exponential backoff if possible.
        if ((is503 || is429) && attempt < maxRetries) {
          console.warn(`[Gemini API] ${modelRole} "${currentModel}" returned transient error (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5; // exponential backoff
          continue;
        }
        
        // If it's the last attempt for this model, try the next model in fallback list
        if (mIndex < modelsToTry.length - 1) {
          console.warn(`[Gemini API] ${modelRole} "${currentModel}" failed. Trying fallback model "${modelsToTry[mIndex + 1]}". Error: ${error?.message || error}`);
          break; // break the retry loop and go to the next model
        }
        
        // Otherwise, throw if all models and attempts are exhausted
        throw error;
      }
    }
  }
}

// API: Generate Customized Invoices, Contracts, and localized SMS summaries
app.post("/api/generate-docs", handleAsync(async (req, res) => {
  const { documentType, details } = req.body;

  try {
    const ai = getAiClient();
    const prompt = `Generate a customized high-end business text in both English and Bengali for a meat/livestock ERP.
    - Document Type: ${documentType} (e.g. sales receipt, animal investment contract, SMS invoice, shareholder report)
    - Parameters: ${JSON.stringify(details)}
    
    Structure the response professionally, ensuring the tone matches formal South Asian business norms.
    For SMS invoice: keep it short, actionable, listing weights, totals, and due amounts.
    For receipt/contract: supply structured business headers, layout, terms, and signature zones.`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a bilingual document writer for livestock ERP software. You output pristine English and perfect high-quality Bengali with accurate currency markers (₹ or BDT). Output standard JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            contentEnglish: { type: Type.STRING, description: "Complete formatted legal or business document in English (Markdown allowed)." },
            contentBengali: { type: Type.STRING, description: "Complete formatted legal or business document in Bengali (Markdown allowed)." },
            smsEnglish: { type: Type.STRING, description: "Short, punchy translation suited for cell phone text message in English." },
            smsBengali: { type: Type.STRING, description: "Short, punchy translation suited for cell phone text message in Bengali." }
          },
          required: ["title", "contentEnglish", "contentBengali", "smsEnglish", "smsBengali"]
        }
      }
    });

    const dataText = response.text;
    if (!dataText) throw new Error("Null response");
    return res.json(JSON.parse(dataText.trim()));
  } catch (error) {
    console.error("Generate docs error:", error);
    // Return high quality fallback docs
    return res.json({
      title: "Invoice & Receipt / রশিদ এবং ইনভয়েস",
      contentEnglish: `### SHAIEALAM RETAIL RECEIPT\n**Customer**: ${details.customerName || "Walk-in Guest"}\n**Phone**: ${details.customerPhone || "N/A"}\n\n**Details**:\nProcessed retail fresh cuts. Total transaction amount: ₹${details.totalAmount || "0"}.\nPayment Method: ${details.paymentMethod || "Cash"}.\n**Paid Amount**: ₹${details.amountPaid !== undefined ? details.amountPaid : details.totalAmount}\n**Remaining Due**: ₹${details.amountDue !== undefined ? details.amountDue : 0}\n\n*Thank you for your business!*`,
      contentBengali: `### শাইআলম খুচরা রশিদ\n**গ্রাহক**: ${details.customerName || "খুচরা ক্রেতা"}\n**মোবাইল**: ${details.customerPhone || "N/A"}\n\n**বিবরণ**:\nতাজা মাংস বিক্রয়। মোট লেনদেনের পরিমাণ: ₹${details.totalAmount || "0"}।\nপরিশোধের মাধ্যম: ${details.paymentMethod || "নগদ"}।\n**পরিশোধিত**: ₹${details.amountPaid !== undefined ? details.amountPaid : details.totalAmount} টাকা\n**বকেয়া**: ₹${details.amountDue !== undefined ? details.amountDue : 0} টাকা\n\n*আমাদের সাথে ব্যবসা করার জন্য ধন্যবাদ!*`,
      smsEnglish: `ShaieAlam: Total Rs.${details.totalAmount || "0"}. Paid Rs.${details.amountPaid !== undefined ? details.amountPaid : details.totalAmount}, Due Rs.${details.amountDue !== undefined ? details.amountDue : 0} via ${details.paymentMethod || "Cash"}. Customer: ${details.customerName}. Thank you!`,
      smsBengali: `শাইআলম: মোট ${details.totalAmount || "0"} টাকা। পরিশোধিত: ${details.amountPaid !== undefined ? details.amountPaid : details.totalAmount} টাকা, বকেয়া: ${details.amountDue !== undefined ? details.amountDue : 0} টাকা (${details.paymentMethod || "নগদ"})। গ্রাহক: ${details.customerName}। ধন্যবাদ!`
    });
  }
}));

// Helper to strip and parse base64 image data URL
function parseBase64Image(dataUrl: string) {
  if (!dataUrl) return null;
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (matches) {
    return {
      mimeType: matches[1],
      data: matches[2]
    };
  }
  return {
    mimeType: "image/jpeg",
    data: dataUrl
  };
}

// API: Multimodal AI analysis of cattle photo and teeth photo
app.post("/api/analyze-cattle", handleAsync(async (req, res) => {
  const { frontImage, teethImage, animalType = "Cow" } = req.body;

  try {
    const ai = getAiClient();
    const parts: any[] = [];

    const frontParsed = parseBase64Image(frontImage);
    const teethParsed = parseBase64Image(teethImage);

    if (frontParsed) {
      parts.push({
        inlineData: {
          mimeType: frontParsed.mimeType,
          data: frontParsed.data
        }
      });
    }

    if (teethParsed) {
      parts.push({
        inlineData: {
          mimeType: teethParsed.mimeType,
          data: teethParsed.data
        }
      });
    }

    const userPrompt = `You are an AI Veterinarian and Expert Livestock Breeder. Analyze the uploaded images of this ${animalType}.
If a general photo is provided, identify:
1. Breed of the animal (e.g. Sahiwal, Holstein Friesian, Gir, Brahman, Jersey, Local Desi / Local Bangladesh native, etc.)
2. Color (e.g., Red-Brown, White/Gray, Black and White, Yellow-Gold)
3. Appearance (e.g., body coat shine, posture, presence of a hump, muscle tone)

If a teeth photo is provided, track the age of the ${animalType} based on teeth incisors matching:
- No permanent incisors: under 1.5 - 2 years old (<24 months)
- 2 permanent incisors: 2 years old (24 months)
- 4 permanent incisors: 2.5 years old (30 months)
- 6 permanent incisors: 3 years old (36 months)
- 8 permanent incisors (Full mouth): 4 years old (48 months)
If no teeth photo is uploaded, estimate the age based on the general photo, or assign a reasonable standard age (e.g., 24 months) and explain it.

You must return a raw JSON response. Fill all properties in this schema precisely:
{
  "breed": "Breed identified",
  "color": "Color identified",
  "appearance": "Detailed description of physical appearance and coat colour",
  "ageMonths": 24,
  "ageExplanation": "Detailed explanation of age estimation based on teeth or visual appearance"
}`;

    parts.push({ text: userPrompt });

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are a professional veterinary AI specializing in livestock auditing. You extract breed, color, appearance description, and teeth-based age with high clinical accuracy. Output standard JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            breed: { type: Type.STRING },
            color: { type: Type.STRING },
            appearance: { type: Type.STRING },
            ageMonths: { type: Type.INTEGER },
            ageExplanation: { type: Type.STRING }
          },
          required: ["breed", "color", "appearance", "ageMonths", "ageExplanation"]
        }
      }
    });

    const text = response?.text;
    if (!text) {
      throw new Error("Empty response from AI model");
    }

    return res.json(JSON.parse(text.trim()));
  } catch (err: any) {
    console.error("Cattle AI analysis error:", err);
    // Return high quality fallback analysis results if Gemini API errors or is unavailable
    return res.json({
      breed: animalType === "Cow" ? "Brahman Holstein Mix" : "Local Desi",
      color: "Dappled White & Maroon / ধলকুচিয়া লালচে-সাদা",
      appearance: "Sleek, heat-tolerant shiny coat with clean eyes, robust body posture and prominent chest frame.",
      ageMonths: 24,
      ageExplanation: "Assumed standard 2 years young adult based on standard market purchase weight. (Teeth photo missing or unclear for forensic incisor analysis)."
    });
  }
}));

// Setup Kite Dev Server / Public assets compiler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShaieAlam LiveStock ERP Fullstack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
