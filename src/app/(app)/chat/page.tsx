"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Send, User as UserIcon, Bot } from "lucide-react";
import { db } from "@/lib/firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    arrayUnion,
    serverTimestamp,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { HistoryMenu } from "@/components/HistoryMenu";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import Lottie from "lottie-react"; // <-- 1. IMPORT LOTTIE
import emptyAnimation from "@/assets/animations/empty.json"; // <-- 2. IMPORT ANIMATION

// Define the shape of a message
type Message = {
    role: "user" | "model";
    text: string;
};

export default function ChatPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // --- Your existing functions (scrollToBottom, useEffects, handleSubmit) ---
    // ... (no changes needed to these functions) ...
    const scrollToBottom = () => {
        if (!scrollAreaRef.current) return;
        const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null;
        if (viewport) {
            try {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
            } catch (e) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 0);
        return () => clearTimeout(timer);
    }, [messages]);

    useEffect(() => {
        const chatIdFromUrl = searchParams.get("id");

        if (chatIdFromUrl && chatIdFromUrl !== currentChatId) {
            setIsHistoryLoading(true);
            setMessages([]);
            setCurrentChatId(chatIdFromUrl);

            const fetchChatHistory = async () => {
                if (!user) return;
                try {
                    const docRef = doc(db, `users/${user.uid}/chatHistory`, chatIdFromUrl);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setMessages(docSnap.data().messages);
                    } else {
                        setError("Chat not found.");
                        router.push("/chat");
                    }
                } catch (err) {
                    setError("Failed to load chat.");
                } finally {
                    setIsHistoryLoading(false);
                }
            };
            fetchChatHistory();
        } else if (!chatIdFromUrl) {
            setCurrentChatId(null);
            setMessages([]);
        }
    }, [searchParams, user, router, currentChatId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;

        const userMessage: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setTimeout(() => scrollToBottom(), 50);
        const currentInput = input;
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            const token = await user.getIdToken();
            // Call the smart API
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt: currentInput, chatId: currentChatId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            const data = await res.json();
            const modelMessage: Message = { role: "model", text: data.text };

            // We just update the UI state. The server handled all saving.
            setMessages((prev) => [...prev, modelMessage]);

            if (data.chatId && !currentChatId) {
                setCurrentChatId(data.chatId);
                router.push(`/chat?id=${data.chatId}`, { scroll: false });
            }
        } catch (err: any) {
            setError(err.message);
            setMessages((prev) => prev.filter((msg) => msg.text !== currentInput));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Chat Generator</h1>
                <HistoryMenu type="chat" />
            </div>

            <ScrollArea className="flex-1 pr-4 overflow-hidden" ref={scrollAreaRef}>
                <div className="flex flex-col gap-4 pb-4">

                    {/* --- 3. UPDATED RENDER LOGIC --- */}
                    {isHistoryLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Empty State Animation */}
                            {!isLoading && !error && messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center pt-16 text-center">
                                    <Lottie
                                        animationData={emptyAnimation}
                                        loop={true}
                                        className="w-64 h-64"
                                    />
                                    <p className="text-lg text-muted-foreground">
                                        Start a conversation
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Ask me anything to get started.
                                    </p>
                                </div>
                            )}

                            {/* Messages List */}
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {msg.role === "model" && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        {msg.role === "user" ? (
                                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                        ) : (
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        a: ({ node, ...props }) => (
                                                            <a {...props} target="_blank" rel="noopener noreferrer" />
                                                        ),
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === "user" && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </motion.div>
                            ))}

                            {/* Loading (Typing) Indicator */}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-lg p-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="flex justify-start">
                                    <div className="rounded-lg bg-destructive/20 p-3 text-destructive text-sm">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {/* --- END OF UPDATED LOGIC --- */}
                </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 shrink-0 mb-4">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading || isHistoryLoading}
                />
                <Button type="submit" disabled={isLoading || isHistoryLoading || !input.trim()}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </form>
        </div>
    );
}