import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) throw new Error("GOOGLE_API_KEY is not set");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function getSystemInstruction(modelType: string): string {
  // --- THIS IS THE CORRECTED LOGIC ---
  switch (modelType) {
    case "openai":
      return `
        You are an expert prompt engineer specializing in OpenAI's GPT-4.
        The user will provide a simple prompt or goal. Your task is to build a new,
        enhanced prompt that achieves this goal, following GPT-4 best practices.
        - Start with a "SYSTEM" role definition.
        - Clearly define the "USER" instruction.
        - Add specific constraints and a desired output format.
        - Return ONLY the new, complete, enhanced prompt.
      `;
    case "claude":
      return `
        You are an expert prompt engineer specializing in Anthropic's Claude 3.
        The user will provide a simple prompt or goal. Your task is to build a new,
        enhanced prompt that achieves this goal, using Claude's preferred XML tag format.
        - Use tags like <instructions>, <context>, and <user_request>.
        - Place the user's core request at the end.
        - Return ONLY the new, complete, enhanced prompt formatted with XML tags.
      `;
    case "gemini":
      return `
        You are an expert prompt engineer specializing in Google's Gemini models.
        The user will provide a simple prompt or goal. Your task is to build a new,
        enhanced prompt that achieves this goal, following Gemini's best practices.
        - Be clear, concise, and specific.
        - Define a clear persona, task, context, and any constraints.
        - Provide examples of the desired output format if helpful.
        - Return ONLY the new, complete, enhanced prompt.
      `;
    case "generic":
    default:
      return `
        You are a world-class prompt engineer.
        The user will provide a simple prompt or goal. Your task is to build a new,
        enhanced prompt that achieves this goal, following general best practices.
        - Assign a clear role and persona.
        - Provide specific context and constraints.
        - Give step-by-step instructions.
        - Define a clear output format.
        - Return ONLY the new, complete, enhanced prompt.
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

    // 3. Generate the "meta-prompt"
    const systemInstruction = getSystemInstruction(modelType);
    const finalPrompt = `${systemInstruction}\n\nSIMPLE PROMPT: "${prompt}"`; // Changed label

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
