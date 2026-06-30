import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY,
});

console.log("ENV:", (import.meta as any).env);
console.log("KEY:", (import.meta as any).env?.VITE_GEMINI_API_KEY);

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

console.log("FULL RESPONSE:", response);

const text = String(response.text);
console.log("Response:", response);
console.log("Text:", text);

console.log("TEXT:", text);

const cleaned = String(text)
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("CLEANED:", cleaned);


return JSON.parse(cleaned);
}