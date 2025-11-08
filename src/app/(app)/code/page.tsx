"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { useSearchParams, useRouter } from "next/navigation"; // Import hooks
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Code, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryMenu } from "@/components/HistoryMenu"; // Import HistoryMenu
import { db } from "@/lib/firebase"; // Import db
import { // Import firestore functions
    doc,
    getDoc,
    setDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

export default function CodePage() {
    const [prompt, setPrompt] = useState(""); // Default empty
    const [generatedCode, setGeneratedCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const SyntaxHighlighterAny: any = SyntaxHighlighter;
    // Effect to load history from URL
    useEffect(() => {
        const historyId = searchParams.get("id");
        if (historyId) {
            setIsHistoryLoading(true);
            const fetchHistory = async () => {
                if (!user) return;
                try {
                    const docRef = doc(db, `users/${user.uid}/codeHistory`, historyId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setPrompt(data.prompt);
                        setGeneratedCode(data.generatedCode);
                    } else {
                        toast.error("History not found.");
                        router.push("/code");
                    }
                } catch (err) {
                    toast.error("Failed to load history.");
                } finally {
                    setIsHistoryLoading(false);
                }
            };
            fetchHistory();
        } else {
            // Clear for new generation
            setPrompt("Generate a React functional component for a login form.");
            setGeneratedCode("");
        }
    }, [searchParams, user, router]);

    const handleGenerateCode = async () => {
        if (!prompt.trim() || !user) {
            toast.warning("Prompt is empty.");
            return;
        }

        setIsLoading(true);
        setGeneratedCode(""); // Clear old code

        try {
            const token = await user.getIdToken();
            const res = await fetch("/api/code", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to generate code");
            }

            const data = await res.json();
            setGeneratedCode(data.code);

            // --- Save NEW history item ---
            const newChatRef = doc(collection(db, `users/${user.uid}/codeHistory`));
            const title = prompt.length > 40 ? prompt.substring(0, 40) + "..." : prompt;

            await setDoc(newChatRef, {
                chatId: newChatRef.id,
                userId: user.uid,
                title: title,
                prompt: prompt,
                generatedCode: data.code,
                timestamp: serverTimestamp(),
                type: "code",
            });

            // Redirect to the new history URL
            router.push(`/code?id=${newChatRef.id}`, { scroll: false });

        } catch (error: any) {
            toast.error("Code Generation Failed", { description: error.message });
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
            toast.success("Copied to clipboard!");
        });
    };

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 overflow-hidden w-full px-2.5">
                <div className="py-4 px-2.5 flex flex-col gap-8 pb-4 max-w-auto w-full mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Code Generator</h1>
                            <p className="text-muted-foreground">
                                Generate code snippets from natural language.
                            </p>
                        </div>
                        <HistoryMenu type="code" />
                    </div>

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
                                disabled={isHistoryLoading}
                            />
                            <Button onClick={handleGenerateCode} disabled={isLoading || isHistoryLoading}>
                                <Code className="mr-2 h-4 w-4" />
                                {isLoading ? "Generating..." : "Generate Code"}
                            </Button>
                        </CardContent>
                    </Card>

                    {(isLoading || isHistoryLoading) && (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {generatedCode && !isLoading && !isHistoryLoading && (
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