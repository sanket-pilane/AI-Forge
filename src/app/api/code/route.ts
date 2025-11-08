import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateTitle } from "@/lib/gemini-server-utils"; // Import our title util
import admin from "firebase-admin"; // Import admin for FieldValue

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
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

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
    const generatedCode = result.response.text();

    // 4. Generate title
    let title = await generateTitle(prompt);
    if (!title) {
      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      title = `New Code - ${date}`;
    }

    // 5. Save to Firestore
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const newHistoryRef = adminDb
      .collection(`users/${userId}/codeHistory`)
      .doc();

    await newHistoryRef.set({
      chatId: newHistoryRef.id,
      userId: userId,
      title: title,
      prompt: prompt,
      generatedCode: generatedCode,
      timestamp: timestamp,
      type: "code",
    });

    // 6. Send back code and new ID
    return NextResponse.json({
      code: generatedCode,
      chatId: newHistoryRef.id,
    });
  } catch (error) {
    console.error("Error in code API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
