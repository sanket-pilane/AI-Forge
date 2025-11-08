"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Send, User as UserIcon, Bot } from "lucide-react";
import { db } from "@/lib/firebase"; // <-- FIX 1: Import db, not auth
import { // <-- FIX 2: Add all missing firestore imports
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

    // Your robust scrollToBottom function
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

    // Your useEffect for scrolling
    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 0);
        return () => clearTimeout(timer);
    }, [messages]);

    // useEffect to load chat history from URL
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
            // Clear for new chat
            setCurrentChatId(null);
            setMessages([]);
        }
    }, [searchParams, user, router, currentChatId]);

    // handleSubmit with client-side Firestore logic
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
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt: currentInput }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            const data = await res.json();
            const modelMessage: Message = { role: "model", text: data.text };

            // Firestore Logic
            if (!currentChatId) {
                const newChatRef = doc(collection(db, `users/${user.uid}/chatHistory`));
                const title = currentInput.length > 40 ? currentInput.substring(0, 40) + "..." : currentInput;

                await setDoc(newChatRef, {
                    chatId: newChatRef.id,
                    userId: user.uid,
                    title: title,
                    timestamp: serverTimestamp(),
                    type: "chat",
                    messages: [userMessage, modelMessage],
                });

                setCurrentChatId(newChatRef.id);
                router.push(`/chat?id=${newChatRef.id}`, { scroll: false });
            } else {
                const chatRef = doc(db, `users/${user.uid}/chatHistory`, currentChatId);
                await updateDoc(chatRef, {
                    messages: arrayUnion(userMessage, modelMessage),
                    timestamp: serverTimestamp(),
                });
            }

            setMessages((prev) => [...prev, modelMessage]);

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
                    {isHistoryLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        messages.map((msg, index) => (
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
                                                {/* <-- FIX 3: Removed stray "Next.js" text */}
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
                        ))
                    )}

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

                    {error && (
                        <div className="flex justify-start">
                            <div className="rounded-lg bg-destructive/20 p-3 text-destructive text-sm">
                                <p>{error}</p>
                            </div>
                        </div>
                    )}
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