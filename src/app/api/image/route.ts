import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);
// Using the "gemini-1.5-flash" model for vision capabilities
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Converts a data URL (e.g., "data:image/jpeg;base64,...")
 * into a GenerativePart object for the Gemini API.
 */
function dataUrlToGenerativePart(url: string) {
  const match = url.match(/^data:(image\/.+);base64,(.+)$/);
  if (!match) {
    throw new Error(
      "Invalid data URL. Expected format: data:image/...;base64,..."
    );
  }

  const mimeType = match[1]; // e.g., "image/jpeg"
  const data = match[2]; // The base64-encoded data

  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user authentication
    const authorization = req.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    const token = authorization.split("Bearer ")[1];
    await adminAuth.verifyIdToken(token);

    // 2. Get prompt and image data from the request body
    const { image, prompt } = await req.json();
    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      );
    }

    // 3. Convert the data URL to a GenerativePart
    const imagePart = dataUrlToGenerativePart(image);

    // 4. Call the Gemini model with both text and image
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    // 5. Send the analysis back
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error in image analysis API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
