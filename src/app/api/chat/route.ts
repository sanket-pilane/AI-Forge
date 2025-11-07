import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

// Ensure the API key is set in .env.local
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in .env.local");
}

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: NextRequest) {
  try {
    // 1. Get the user's token from the Authorization header
    const authorization = req.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    const token = authorization.split("Bearer ")[1];

    // 2. Verify the token with Firebase Admin
    try {
      await adminAuth.verifyIdToken(token);
      // You could get user details from the decodedToken if needed
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // 3. Get the prompt from the client
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 4. Call the Gemini model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 5. Send the response back to the client
    return NextResponse.json({
      text,
    });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
