"use client";

import { useState } from "react";
import { HistoryMenu } from "@/components/HistoryMenu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, Code, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner"; // <-- 1. Import toast directly from sonner
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Replace your old import with this:
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodePage() {
    const [prompt, setPrompt] = useState(
        "Generate a React functional component for a login form."
    );
    const [generatedCode, setGeneratedCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { user } = useAuth();


    const SyntaxHighlighterAny: any = SyntaxHighlighter;

    const handleGenerateCode = async () => {
        if (!prompt.trim() || !user) {
            if (!user) {
                // 3. Use the new toast.error function
                toast.error("Not authenticated", {
                    description: "Please log in again.",
                });
                return;
            }
            // 3. Use the new toast.warning function
            toast.warning("Prompt is empty", {
                description: "Please enter a prompt to generate code.",
            });
            return;
        }

        setIsLoading(true);
        setGeneratedCode("");

        try {
            const token = await user.getIdToken();
            const res = await fetch("/api/code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to generate code");
            }

            const data = await res.json();
            setGeneratedCode(data.code);
        } catch (error: any) {
            // 3. Use the new toast.error function
            toast.error("Code Generation Failed", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        const codeToCopy = generatedCode
            .replace(/```[a-z]*\n/g, "")
            .replace(/```/g, "");

        navigator.clipboard.writeText(codeToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            // 3. Use the new toast.success function
            toast.success("Copied to clipboard!");
        });
    };

    return (
        // Ensure page fills available height so ScrollArea can manage inner scrolling
        <div className="flex h-full flex-col">
            <div>
                <h1 className="text-3xl font-bold">Code Generator</h1>
                <p className="text-muted-foreground">
                    Generate code snippets from natural language.
                </p>
            </div>

            {/* Scroll only the cards/response area */}
            <ScrollArea className="flex-1 overflow-hidden w-full px-2.5">
                <div className="py-4 px-2.5 flex flex-col gap-8 pb-4 max-w-4xl w-full mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Prompt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Create a Python function to fetch data from an API"
                                className="min-h-[100px] text-base"
                            />
                            <Button onClick={handleGenerateCode} disabled={isLoading}>
                                <Code className="mr-2 h-4 w-4" />
                                {isLoading ? "Generating..." : "Generate Code"}
                            </Button>
                        </CardContent>
                    </Card>

                    {isLoading && (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {generatedCode && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Generated Code</CardTitle>
                                <Button variant="ghost" size="icon" onClick={handleCopy}>
                                    {isCopied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Clipboard className="h-4 w-4" />
                                    )}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md bg-muted/50 text-sm">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || "");
                                                return match ? (
                                                    <SyntaxHighlighterAny
                                                        style={coldarkDark as any}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        wrapLongLines={true}
                                                        customStyle={{
                                                            margin: 0,
                                                            padding: "1rem",
                                                            backgroundColor: "transparent"
                                                        }}
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighterAny>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {generatedCode}
                                    </ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}