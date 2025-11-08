import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) throw new Error("GOOGLE_API_KEY is not set");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT =
  "You are an expert code generator. You must only respond with the complete, raw code requested by the user, enclosed in a single markdown code block (e.g., ```language\n...code...\n```). Do not add any introductory text, explanations, or conclusions. Only provide the code.";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authorization.split("Bearer ")[1];
    await adminAuth.verifyIdToken(token);

    // 2. Get prompt
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 3. Call Gemini
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Request: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // 4. Send back the code
    return NextResponse.json({
      code: text,
    });
  } catch (error) {
    console.error("Error in code API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
