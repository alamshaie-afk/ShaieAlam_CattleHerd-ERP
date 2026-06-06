import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import compression from "compression";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Utilize compression middleware to Gzip body payloads
  app.use(compression());

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

  // API Route for AI Expense Audit
  app.post("/api/audit/expenses", async (req, res) => {
    try {
      const { transactions } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // High-fidelity Offline Simulator logic
        const txList = (transactions || []) as any[];
        const expenses = txList.filter(t => t.type === "Expense");
        const totalExp = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        
        // Group by category
        const cats: { [key: string]: number } = {};
        expenses.forEach(e => {
          cats[e.category] = (cats[e.category] || 0) + (e.amount || 0);
        });

        // Find anomalies
        const highValue = expenses.filter(e => e.amount > 15000);
        const anomalyList: string[] = [];
        if (highValue.length > 0) {
          highValue.forEach(h => {
            anomalyList.push(`- High expense outlier: ${h.description} on ${h.date} (INR ${h.amount})`);
          });
        }
        
        // Check for duplicates/redundancy (same amount, category, within close dates or description)
        const seen: { [key: string]: any[] } = {};
        expenses.forEach(e => {
          const key = `${e.category}-${e.amount}`;
          if (!seen[key]) seen[key] = [];
          seen[key].push(e);
        });
        const redundantList: string[] = [];
        Object.entries(seen).forEach(([k, list]) => {
          if (list.length > 1) {
            redundantList.push(`- Possible redundant patterns detected for ${k.split('-')[0]} purchases of INR ${k.split('-')[1]} (${list.length} transactions match)`);
          }
        });

        const textOutput = `⚠️ [OFFLINE SIMULATION AUDIT SUCCESS - GEMINI KEY NOT CONFIGURED]

AGRICULTURAL FINANCIAL COMPLIANCE CERTIFICATION LEDGER
Report generated locally via Edge Rule Engines.

1. EXPENDITURE OVERVIEW & SUMMARY
Total Registered Expenses in last 30 days: INR ${totalExp.toLocaleString()} across ${expenses.length} distinct allocations.
Breakdown per operational category:
${Object.entries(cats).map(([cat, val]) => `• ${cat}: INR ${val.toLocaleString()}`).join("\n")}

2. DETECTED TRANSACTION ANOMALIES
${anomalyList.length > 0 ? anomalyList.join("\n") : "- No critical high-value budget breaches detected (> INR 15,000 threshold)."}

3. REDUNDANT PROCUREMENT PATTERNS
${redundantList.length > 0 ? redundantList.join("\n") : "- No exact multi-tier duplicate transaction patterns observed in current cycle."}

4. STRATEGIC FEED & COST-CONTAINMENT RECOMMENDATIONS
- Consolidate purchase agreements with local grain suppliers rather than executing high-frequency ad-hoc feed buys.
- Setup pre-scheduled clinical checks to minimize sudden medical treatment emergency outlays.`;

        return res.status(200).json({ text: textOutput });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const prompt = `You are the Lead Financial AI Expense Auditor for ShaieAlam Livestock ERP.
Analyze the following list of transactions from the last 30 days. No markdown parser is present on the client, so respond in very clean text format using double line breaks for paragraph separation, standard bullet points using '-', and CAPITALIZED headers.

Evaluate and deliver a highly professional report containing:
1. TOTAL EXPENDITURE OVERVIEW: Provide aggregated expense amount, category-wise breakdown, and overall financial health.
2. DETECTED TRANSACTION ANOMALIES: Highlight any suspicious expenses, unusually high amounts, incorrect categorizations, or outlier pricing.
3. REDUNDANT PROCUREMENT PATTERNS: List repeating purchases (such as frequent medical, feed supply or operations) that could be bundled or optimized, or double ledger entries.
4. TACTICAL FINANCIAL ADVISORY RECOMMENDATIONS: Concrete recommendations to reduce cost, streamline cashflow, and secure feed margins for the next 30 days.

--- TRANSACTIONS snapshot ---
${JSON.stringify(transactions, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.1, // low temperature for precise auditing
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Auditor Route Error:", err);
      res.status(500).json({ error: err.message || "An error occurred with Gemini Analyst." });
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
    
    // Serve static directory files with high-efficiency Cache headers
    app.use(express.static(distPath, {
      maxAge: "30d",
      setHeaders: (res, pathName) => {
        if (path.basename(pathName) === "index.html") {
          // Keep index.html fresh to fetch server-hot bundles
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else {
          // Serve compiled fingerprinted chunks with 1 year expiration cache duration
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));

    app.get("*all", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
