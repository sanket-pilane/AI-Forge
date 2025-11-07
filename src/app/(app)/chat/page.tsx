"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Send, User as UserIcon, Bot } from "lucide-react";
import { auth } from "@/lib/firebase";
import ReactMarkdown from "react-markdown"; // <-- IMPORT MARKDOWN
import remarkGfm from "remark-gfm"; // <-- IMPORT GFM PLUGIN

// Define the shape of a message
type Message = {
    role: "user" | "model";
    text: string;
};

export default function ChatPage() {
    const { user } = useAuth(); // Get the authenticated user
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ref for the scroll area viewport
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom function
    const scrollToBottom = () => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;

        const userMessage: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            // 1. Get the Firebase Auth token
            const token = await user.getIdToken();

            // 2. Call our backend API
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send the token
                },
                body: JSON.stringify({ prompt: input }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            const data = await res.json();

            // 3. Add AI response to state
            const modelMessage: Message = { role: "model", text: data.text };
            setMessages((prev) => [...prev, modelMessage]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col"> {/* <-- 1. LAYOUT FIX HERE */}
            <h1 className="text-2xl font-semibold mb-4">Chat Generator</h1>

            {/* Chat Messages Area */}
            <ScrollArea className="flex-1 pr-4" viewportRef={scrollViewportRef}>
                <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {/* Avatar for Model */}
                            {msg.role === "model" && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                    }`}
                            >
                                {/* --- 2. MARKDOWN RENDERING --- */}
                                {msg.role === "user" ? (
                                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                ) : (
                                    <ReactMarkdown
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // Custom renderer for links to open in a new tab
                                            a: ({ node, ...props }) => (
                                                <a {...props} target="_blank" rel="noopener noreferrer" />
                                            ),
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                )}
                                {/* --- END MARKDOWN RENDERING --- */}
                            </div>

                            {/* Avatar for User */}
                            {msg.role === "user" && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}

                    {/* Loading Spinner */}
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
                </div>
            </ScrollArea>

            {/* Chat Input Form */}
            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
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