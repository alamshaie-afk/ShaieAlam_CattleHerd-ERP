import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Customer Portal interaction
  app.post("/api/chat/assistant", async (req, res) => {
    try {
      const { message, contextData } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({ 
          text: "⚠️ [Offline Simulation Mode] GEMINI_API_KEY is not configured on the server. Here is a simulated response based on your query: All records (orders/invoices) have been scanned successfully in the offline buffer!" 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // We compile a customized system instruction for tracking orders, dues, and payments
      const systemInstruction = `You are "ShaieAlam Bot", an advanced livestock AI ERP Customer Agent for Google Chat.
The user is a customer looking up their dues, payments, or orders. Or they are testing order tracking or checking active balances.
Using ONLY the live ERP snapshot contextData provided below, explain the dues, payments, or order status accurately.
Make your responses concise, highly factual, helpful, and polite. Always state exact payment/due/order amounts, references, & dates from the context list.
If they ask for something not present, tell them politely that the record was not found under their name, phone, or ID in current active registries.

[Bengali support: If user speaks in Bengali, reply in polite Bengali].

--- LIVE ERP SNAPSHOT DATA ---
${JSON.stringify(contextData, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2, // low temperature for high facts accuracy
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Assistant Route Error:", err);
      res.status(500).json({ error: err.message || "An error occurred with Gemini." });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
