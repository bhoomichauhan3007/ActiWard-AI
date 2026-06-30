import { GoogleGenAI } from "@google/genai";

function getAI() {
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY;

  console.log("ENV:", (import.meta as any).env);
  console.log("KEY:", key);

  if (!key) {
    throw new Error("VITE_GEMINI_API_KEY is missing");
  }

  return new GoogleGenAI({
    apiKey: key,
  });
}

export async function analyzeIssue(category: string, description: string) {
  const ai = getAI();

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

  const text = String(response.text);

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}