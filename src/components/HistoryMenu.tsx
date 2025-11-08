"use client";

import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HistoryItem = {
    chatId: string;
    title: string;
};

interface HistoryMenuProps {
    type: "chat" | "code" | "image";
}

export function HistoryMenu({ type }: HistoryMenuProps) {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        setIsLoading(true);
        const historyCollectionMap = {
            chat: "chatHistory",
            code: "codeHistory",
            image: "imageHistory",
        };
        const collectionName = historyCollectionMap[type];

        const q = query(
            collection(db, `users/${user.uid}/${collectionName}`),
            orderBy("timestamp", "desc"),
            limit(4)
        );

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const items: HistoryItem[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({ chatId: doc.id, title: doc.data().title });
                });
                setHistory(items);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching history:", error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe(); // Cleanup snapshot listener
    }, [user, type]);

    const handleLoadChat = (id: string) => {
        // Navigate to the correct page with the chat ID
        router.push(`/${type}?id=${id}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">View History</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Recent History</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                    <DropdownMenuItem disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </DropdownMenuItem>
                ) : history.length > 0 ? (
                    history.map((item) => (
                        <DropdownMenuItem
                            key={item.chatId}
                            onSelect={() => handleLoadChat(item.chatId)}
                            className="cursor-pointer"
                        >
                            {/* This span handles the truncation */}
                            <span className="block truncate">{item.title}</span>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No history found.</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    {/* Updated link to pre-filter the history page */}
                    <Link href={`/history?type=${type}`}>View All History</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}