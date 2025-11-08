import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
// Use the Admin SDK's Firestore instance (adminDb) directly for server-side counts

export async function GET(req: NextRequest) {
  try {
    // 1. Verify user
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authorization.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 2. Create references to the collections using the Admin SDK
    const chatRef = adminDb.collection(`users/${userId}/chatHistory`);
    const codeRef = adminDb.collection(`users/${userId}/codeHistory`);
    const imageRef = adminDb.collection(`users/${userId}/imageHistory`);
    const optimizerRef = adminDb.collection(`users/${userId}/optimizerHistory`);

    // 3. Run parallel queries to fetch snapshots and count documents
    const [chatSnap, codeSnap, imageSnap, optimizerSnap] = await Promise.all([
      chatRef.get(),
      codeRef.get(),
      imageRef.get(),
      optimizerRef.get(),
    ]);

    // 4. Extract counts (QuerySnapshot.size gives the count)
    const stats = {
      chatCount: chatSnap.size || 0,
      codeCount: codeSnap.size || 0,
      imageCount: imageSnap.size || 0,
      optimizerCount: optimizerSnap ? optimizerSnap.size || 0 : 0,
    };

    // 5. Return the stats
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
