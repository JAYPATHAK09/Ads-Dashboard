
import { GoogleGenAI } from "@google/genai";
import { SKUData } from "../types";

export const analyzeBusinessData = async (data: SKUData[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const dataString = JSON.stringify(data, null, 2);

  const prompt = `
    You are a Senior Business Analyst AI for a premium men's grooming eCommerce brand.
    Analyze the following weekly SKU-level dataset and generate a concise business summary.
    IMPORTANT: Format all currency values in Indian Rupees (₹).

    DATASET:
    ${dataString}

    STRICT OUTPUT FORMAT:
    1. Weekly Performance Overview:
       - Total revenue in ₹.
       - Top 3 SKUs by sales revenue.
       - Lowest performing SKU.

    2. Ad Efficiency Analysis:
       - Portfolio ROAS, CTR, CPC.
       - Mention SKUs with poor performance.

    3. Inventory Alerts:
       - SKUs with low stock (< 30%).

    4. Recommendations:
       - 2-3 specific optimization steps.

    5. Forecast:
       - Revenue trend and next week's predicted winner.

    Tone: Analytical, data-backed, extremely concise.
    End with: "This week’s overall health: [Excellent / Stable / Caution]"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
