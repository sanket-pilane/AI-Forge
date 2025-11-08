import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) throw new Error("GOOGLE_API_KEY is not set");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function getSystemInstruction(modelType: string): string {
  switch (modelType) {
    case "openai":
      return `
        You are an expert prompt engineer specializing in OpenAI's GPT-4.
        Rewrite the following user prompt to be highly effective.
        - Clearly define the "system" role, the "user" role, and any constraints.
        - Use few-shot examples if appropriate.
        - Specify the desired output format (e.g., JSON, Markdown).
        - Return ONLY the enhanced prompt and nothing else.
      `;
    case "claude":
      return `
        You are an expert prompt engineer specializing in Anthropic's Claude 3.
        Rewrite the following user prompt to be highly effective.
        - Structure the prompt using Claude's preferred XML tags (e.g., <instructions>, <context>, <examples>).
        - Clearly define the persona and task.
        - Place the user's core request at the end of the prompt.
        - Return ONLY the enhanced prompt and nothing else.
      `;
    case "gemini":
      return `
        You are an expert prompt engineer specializing in Google's Gemini models.
        Rewrite the following user prompt to be highly effective.
        - Be clear, concise, and specific.
        - Define a clear persona, task, context, and any constraints.
        - Provide examples of the desired output format.
        - Use strong action verbs.
        - Return ONLY the enhanced prompt and nothing else.
      `;
    case "generic":
    default:
      return `
        You are a world-class prompt engineer.
        Rewrite the following user prompt to follow general best practices.
        - Assign a clear role and persona.
        - Provide specific context and constraints.
        - Give step-by-step instructions.
        - Define a clear output format.
        - Return ONLY the enhanced prompt and nothing else.
      `;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authorization.split("Bearer ")[1];
    await adminAuth.verifyIdToken(token);

    // 2. Get prompt and modelType
    const { prompt, modelType } = await req.json();
    if (!prompt || !modelType) {
      return NextResponse.json(
        { error: "Prompt and modelType are required" },
        { status: 400 }
      );
    }

    const systemInstruction = getSystemInstruction(modelType);
    const finalPrompt = `${systemInstruction}\n\nUSER PROMPT: "${prompt}"`;

    // 4. Call Gemini
    const result = await model.generateContent(finalPrompt);
    const optimizedPrompt = result.response.text();

    // 5. Send back the new prompt
    return NextResponse.json({ text: optimizedPrompt });
  } catch (error) {
    console.error("Error in optimize-prompt API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
