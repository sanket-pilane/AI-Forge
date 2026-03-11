import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const historyCollectionMap: Record<string, string> = {
    chat: "chatHistory",
    code: "codeHistory",
    image: "imageHistory",
};

export async function GET(req: NextRequest) {
    try {
        const authorization = req.headers.get("Authorization");
        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authorization.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "chat";
        const limitParam = parseInt(searchParams.get("limit") || "50", 10);

        const collectionName = historyCollectionMap[type];
        if (!collectionName) {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        const snapshot = await adminDb
            .collection("users")
            .doc(userId)
            .collection(collectionName)
            .orderBy("timestamp", "desc")
            .limit(limitParam)
            .get();

        const items = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                chatId: data.chatId,
                title: data.title,
                type: data.type,
                timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
            };
        });

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Error in history API route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
