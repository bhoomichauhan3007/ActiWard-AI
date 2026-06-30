import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeIssue(category: string, description: string) {
  const prompt = `
You are an AI civic assistant.

Analyze the following civic issue.

Category: ${category}

Description: ${description}

Return ONLY valid JSON in this format:

{
  "severity":"",
  "department":"",
  "summary":"",
  "confidence":"",
  "recommendedAction":""
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}