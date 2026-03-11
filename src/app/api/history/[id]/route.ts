import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const historyCollectionMap: Record<string, string> = {
    chat: "chatHistory",
    code: "codeHistory",
    image: "imageHistory",
};

async function authenticateUser(req: NextRequest) {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return null;
    }
    const token = authorization.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await authenticateUser(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "chat";

        const collectionName = historyCollectionMap[type];
        if (!collectionName) {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        const docRef = adminDb
            .collection("users")
            .doc(userId)
            .collection(collectionName)
            .doc(id);

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const data = docSnap.data();
        return NextResponse.json({
            id: docSnap.id,
            ...data,
            timestamp: data?.timestamp?.toDate?.()?.toISOString() || null,
        });
    } catch (error) {
        console.error("Error fetching history item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await authenticateUser(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "chat";
        const { title } = await req.json();

        const collectionName = historyCollectionMap[type];
        if (!collectionName) {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        if (!title || !title.trim()) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const docRef = adminDb
            .collection("users")
            .doc(userId)
            .collection(collectionName)
            .doc(id);

        await docRef.update({ title: title.trim() });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating history item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await authenticateUser(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "chat";

        const collectionName = historyCollectionMap[type];
        if (!collectionName) {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        const docRef = adminDb
            .collection("users")
            .doc(userId)
            .collection(collectionName)
            .doc(id);

        await docRef.delete();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting history item:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
