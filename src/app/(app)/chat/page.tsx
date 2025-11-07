"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Send, User as UserIcon, Bot } from "lucide-react";
import { auth } from "@/lib/firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

// Define the shape of a message
type Message = {
    role: "user" | "model";
    text: string;
};

export default function ChatPage() {
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- FIX 1: Correctly reference the ScrollArea root ---
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // --- FIX 1: Updated scroll function ---
    const scrollToBottom = () => {
        if (!scrollAreaRef.current) return;

        // Radix ScrollArea exposes a Viewport element. Use the data attribute to locate it
        const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null;
        if (viewport) {
            // Smooth scroll for better UX
            try {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
            } catch (e) {
                // Fallback for environments that don't support options
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        // We wrap this in a 0ms timeout to wait for the DOM to update
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 0);

        // Cleanup the timer
        return () => clearTimeout(timer);
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;

        const userMessage: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        // Give the DOM a tick to render the new message, then scroll the messages viewport
        setTimeout(() => scrollToBottom(), 50);
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
                body: JSON.stringify({ prompt: input }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            const data = await res.json();
            const modelMessage: Message = { role: "model", text: data.text };
            setMessages((prev) => [...prev, modelMessage]);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Ensure this page fills the available height so the ScrollArea can take remaining space
        <div className="flex h-full flex-col">
            <h1 className="text-2xl font-semibold mb-4">Chat Generator</h1>
            {/* ScrollArea consumes remaining space so the form stays pinned to the bottom */}
            <ScrollArea className="flex-1 pr-4 overflow-hidden" ref={scrollAreaRef}>
                <div className="flex flex-col gap-4 pb-4">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            // Add animation props
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
                                    // --- FIX 2: Wrap ReactMarkdown in a div with prose classes ---
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