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

        const fetchHistory = async () => {
            try {
                const token = await user.getIdToken();
                const res = await fetch(`/api/history?type=${type}&limit=4`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(
                        data.items.map((item: any) => ({
                            chatId: item.chatId || item.id,
                            title: item.title,
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [user, type]);

    const handleLoadChat = (id: string) => {
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
                            <span className="block truncate">{item.title}</span>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No history found.</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/history?type=${type}`}>View All History</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}