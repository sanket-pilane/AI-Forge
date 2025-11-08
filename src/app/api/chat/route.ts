import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { generateTitle } from "@/lib/gemini-server-utils";
import admin from "firebase-admin";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) throw new Error("GOOGLE_API_KEY is not set");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authorization.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { prompt, chatId } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const userMessage = { role: "user", text: prompt };
    const result = await model.generateContent(prompt);
    const modelMessage = { role: "model", text: result.response.text() };

    let currentChatId = chatId;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    if (!currentChatId) {
      const newChatRef = adminDb
        .collection("users")
        .doc(userId)
        .collection("chatHistory")
        .doc();
      currentChatId = newChatRef.id;

      // 4a. Generate "cool" title
      let title = await generateTitle(prompt);
      if (!title) {
        // Fallback title
        const date = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        title = `New Chat - ${date}`;
      }

      await newChatRef.set({
        chatId: currentChatId,
        userId: userId,
        title: title, // Use generated title
        timestamp: timestamp,
        type: "chat",
        messages: [userMessage, modelMessage],
      });
    } else {
      // --- Update existing chat ---
      const chatRef = adminDb
        .collection("users")
        .doc(userId)
        .collection("chatHistory")
        .doc(currentChatId);

      await chatRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(
          userMessage,
          modelMessage
        ),
        timestamp: timestamp,
      });
    }

    // 5. Send response
    return NextResponse.json({
      text: modelMessage.text,
      chatId: currentChatId, // Send the ID back
    });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
