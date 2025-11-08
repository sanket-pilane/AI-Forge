import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateTitle } from "@/lib/gemini-server-utils";
import admin from "firebase-admin";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) throw new Error("GOOGLE_API_KEY is not set");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function dataUrlToGenerativePart(url: string) {
  const match = url.match(/^data:(image\/.+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL.");
  return { inlineData: { mimeType: match[1], data: match[2] } };
}

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

    // 2. Get prompt and image
    const { image, prompt } = await req.json();
    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      );
    }

    // 3. Convert image and call Gemini
    const imagePart = dataUrlToGenerativePart(image);
    const result = await model.generateContent([prompt, imagePart]);
    const analysisResult = result.response.text();

    // 4. Generate title
    let title = await generateTitle(prompt);
    if (!title) {
      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      title = `Image Analysis - ${date}`;
    }

    // 5. Save to Firestore (without the image data)
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const newHistoryRef = adminDb
      .collection(`users/${userId}/imageHistory`)
      .doc();

    await newHistoryRef.set({
      chatId: newHistoryRef.id,
      userId: userId,
      title: title,
      prompt: prompt,
      analysisResult: analysisResult,
      timestamp: timestamp,
      type: "image",
    });

    // 6. Send analysis back
    return NextResponse.json({
      text: analysisResult,
      chatId: newHistoryRef.id,
    });
  } catch (error: any) {
    console.error("Error in image analysis API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
