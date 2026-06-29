import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  (import.meta as any).env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function analyzeIssue(
  category: string,
  description: string
) {
 const prompt = `
You are an AI civic assistant.

Analyze the following civic issue.

Category: ${category}

Description: ${description}

Return ONLY valid JSON in this exact format.

{
  "severity":"",
  "department":"",
  "summary":"",
  "confidence":"",
  "recommendedAction":""
}

Rules:

- severity should be Low, Medium or High.
- confidence should be a percentage like "95%".
- department should be the correct municipal department.
- summary should be 2-3 lines.
- recommendedAction should be one short sentence explaining what the municipal authority should do.
`;
const result = await model.generateContent(prompt);

const text = result.response.text();

const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
}