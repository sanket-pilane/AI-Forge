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
} from "firebase/firestore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define the shape of a history item
type HistoryItem = {
    id: string;
    chatId: string;
    title: string;
    type: "chat" | "code" | "image";
    timestamp: Timestamp;
};

// Helper to map filter values to Firestore collection names
const historyCollectionMap = {
    chat: "chatHistory",
    code: "codeHistory",
    image: "imageHistory",
};

export default function HistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // Get initial filter from URL, default to 'chat'
    const initialFilter = searchParams.get("type") || "chat";

    const [filter, setFilter] = useState<'chat' | 'code' | 'image'>(
        ['chat', 'code', 'image'].includes(initialFilter)
            ? (initialFilter as 'chat' | 'code' | 'image')
            : 'chat'
    );

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Effect to fetch data when user or filter changes
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
    }, [user, filter]); // Re-fetch when user or filter changes

    // 2. Handler for changing the filter dropdown
    const handleFilterChange = (newFilter: 'chat' | 'code' | 'image') => {
        setFilter(newFilter);
        // Update the URL parameter without reloading the page
        router.push(`/history?type=${newFilter}`, { scroll: false });
    };

    // 3. Handler for clicking a history card
    const handleCardClick = (item: HistoryItem) => {
        // Redirects to the correct feature page with the ID
        router.push(`/${item.type}?id=${item.chatId}`);
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h1 className="text-3xl font-bold">Full History</h1>
                <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="chat">Chat</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea className="flex-1 pr-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                        No history found for this category.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map((item) => (
                            <Card
                                key={item.id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleCardClick(item)}
                            >
                                <CardHeader>
                                    <CardTitle className="truncate">{item.title}</CardTitle>
                                    <CardDescription>
                                        {item.timestamp?.toDate().toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}