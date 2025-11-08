"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Clipboard, Check, Loader2, Wand2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ModelType = "gemini" | "openai" | "claude" | "generic";

export default function OptimizerPage() {
    const [inputPrompt, setInputPrompt] = useState("");
    const [modelType, setModelType] = useState<ModelType>("gemini");
    const [outputPrompt, setOutputPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { user } = useAuth();

    const handleOptimize = async () => {
        if (!inputPrompt.trim() || !user) {
            toast.warning("Please enter a prompt to optimize.");
            return;
        }

        setIsLoading(true);
        setOutputPrompt("");

        try {
            const token = await user.getIdToken();
            const res = await fetch("/api/optimize-prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt: inputPrompt, modelType: modelType }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to optimize prompt");
            }

            const data = await res.json();
            setOutputPrompt(data.text);
        } catch (error: any) {
            toast.error("Optimization Failed", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputPrompt).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            toast.success("Copied to clipboard!");
        });
    };

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 pr-4 overflow-hidden">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold">Prompt Optimizer</h1>
                        <p className="text-muted-foreground">
                            Enhance your prompts for any AI model.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Simple Prompt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={inputPrompt}
                                onChange={(e) => setInputPrompt(e.target.value)}
                                placeholder="e.g., tell me about dogs"
                                className="min-h-[150px] text-base"
                            />
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Select
                                    value={modelType}
                                    onValueChange={(value) => setModelType(value as ModelType)}
                                >
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gemini">Gemini</SelectItem>
                                        <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                                        <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                                        <SelectItem value="generic">Generic</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleOptimize}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto"
                                >
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    {isLoading ? "Optimizing..." : "Optimize Prompt"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {(isLoading || outputPrompt) && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Enhanced Prompt</CardTitle>
                                {outputPrompt && !isLoading && (
                                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                                        {isCopied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Clipboard className="h-4 w-4" />
                                        )}
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <div className="min-h-[250px] text-base bg-muted/50 p-4 rounded">
                                        {outputPrompt ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {outputPrompt}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">No optimized prompt yet.</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}