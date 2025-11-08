"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    getDocs,
    Timestamp,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import Lottie from "lottie-react";
import deleteAnim from "@/assets/animations/empty.json"; // 👈 place your Lottie file here

type HistoryItem = {
    id: string;
    chatId: string;
    title: string;
    type: "chat" | "code" | "image";
    timestamp: Timestamp;
};

const historyCollectionMap = {
    chat: "chatHistory",
    code: "codeHistory",
    image: "imageHistory",
};

export default function HistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const initialFilter = searchParams.get("type") || "chat";

    const [filter, setFilter] = useState<"chat" | "code" | "image">(
        ["chat", "code", "image"].includes(initialFilter)
            ? (initialFilter as "chat" | "code" | "image")
            : "chat"
    );

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [deleteDialog, setDeleteDialog] = useState<HistoryItem | null>(null); // 👈 for delete confirmation

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const collectionName = historyCollectionMap[filter];
                const q = query(
                    collection(db, `users/${user.uid}/${collectionName}`),
                    orderBy("timestamp", "desc")
                );

                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as HistoryItem[];

                setHistory(items);
            } catch (error) {
                console.error("Error fetching history:", error);
                toast.error("Failed to load history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, filter]);

    const handleFilterChange = (newFilter: "chat" | "code" | "image") => {
        setFilter(newFilter);
        router.push(`/history?type=${newFilter}`, { scroll: false });
    };

    const handleCardClick = (item: HistoryItem) => {
        router.push(`/${item.type}?id=${item.chatId}`);
    };

    const handleEditClick = (item: HistoryItem) => {
        setEditingId(item.id);
        setNewTitle(item.title);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewTitle("");
    };

    const handleSaveTitle = async (item: HistoryItem) => {
        if (!user || !newTitle.trim()) {
            toast.warning("Title cannot be empty.");
            return;
        }

        const collectionName = historyCollectionMap[filter];
        const docRef = doc(db, `users/${user.uid}/${collectionName}`, item.id);

        try {
            await updateDoc(docRef, { title: newTitle });
            setHistory(
                history.map((h) => (h.id === item.id ? { ...h, title: newTitle } : h))
            );
            toast.success("Title updated!");
        } catch {
            toast.error("Failed to update title.");
        } finally {
            handleCancelEdit();
        }
    };

    const confirmDelete = (item: HistoryItem) => {
        setDeleteDialog(item); // 👈 open dialog
    };

    const handleDeleteConfirmed = async () => {
        if (!user || !deleteDialog) return;

        const collectionName = historyCollectionMap[filter];
        const docRef = doc(db, `users/${user.uid}/${collectionName}`, deleteDialog.id);

        try {
            await deleteDoc(docRef);
            setHistory(history.filter((h) => h.id !== deleteDialog.id));
            toast.success("History deleted.");
        } catch {
            toast.error("Failed to delete history.");
        } finally {
            setDeleteDialog(null);
        }
    };

    return (
        <div className="flex h-full flex-col p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-white">Full History</h1>
                <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-zinc-900 border-zinc-700 text-white">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                        <SelectItem value="chat">Chat</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Lottie animationData={deleteAnim} loop className="w-40 h-40" />
                        <h2 className="mt-4 text-lg font-medium text-white">No history yet</h2>
                        <p className="mt-2 text-sm text-zinc-400 text-center max-w-md">
                            You don't have any saved history yet. Start a chat, generate code, or analyze an image and your history will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900/50 shadow-sm">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/60 transition-colors"
                            >
                                {editingId === item.id ? (
                                    <div className="flex w-full items-center justify-between gap-3">
                                        <Input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleCancelEdit}
                                                className="text-zinc-400 hover:text-white"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                onClick={() => handleSaveTitle(item)}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className="flex flex-col sm:flex-row sm:items-center gap-1 cursor-pointer"
                                            onClick={() => handleCardClick(item)}
                                        >
                                            <p className="font-medium text-white truncate max-w-[200px] sm:max-w-[300px]">
                                                {item.title}
                                            </p>

                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-500 sm:ml-4">
                                                {item.timestamp?.toDate().toLocaleDateString()}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(item)}
                                                className="text-zinc-400 hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => confirmDelete(item)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* 🗑️ Delete Confirmation Dialog */}
            {deleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-[90%] max-w-sm shadow-lg">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <Lottie
                                animationData={deleteAnim}
                                loop={true}
                                className="w-32 h-32"
                            />
                            <h2 className="text-lg font-semibold text-white">
                                Delete this history?
                            </h2>
                            <p className="text-sm text-zinc-400">
                                This action cannot be undone. The history will be permanently deleted.
                            </p>
                            <div className="flex justify-center gap-3 pt-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => setDeleteDialog(null)}
                                    className="text-zinc-300 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDeleteConfirmed}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
