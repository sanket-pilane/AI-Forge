"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ImageAnalyzerPage() {
    const [prompt, setPrompt] = useState(
        "Analyze this image and tell me three key objects you see and their likely function."
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // Use our auth hook

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeImage = async () => {
        if (!imagePreview || !user) {
            if (!user) {
                toast.error("Not authenticated", {
                    description: "Please log in again.",
                });
                return;
            }
            toast.warning("No image selected", {
                description: "Please upload an image to analyze.",
            });
            return;
        }

        setIsLoading(true);
        setAnalysisResult("");

        try {
            const token = await user.getIdToken();
            // Call our new API route
            const res = await fetch("/api/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ image: imagePreview, prompt: prompt }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to analyze image");
            }

            const data = await res.json();
            setAnalysisResult(data.text);
        } catch (error: any) {
            toast.error("Image Analysis Failed", {
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Added ScrollArea wrapper to fix page scrolling
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 overflow-hidden w-full px-2.5">
                <div className="p-4 space-y-8 pb-4 w-full">
                    <div>
                        <h1 className="text-3xl font-bold">Image Analyzer</h1>
                        <p className="text-muted-foreground">
                            Upload an image and ask the AI anything about it.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* --- Upload & Prompt Card --- */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload & Prompt</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
                                        Image
                                    </label>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {imagePreview && (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                        <Image
                                            src={imagePreview}
                                            alt="Image preview"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                                        Prompt
                                    </label>
                                    <Textarea
                                        id="prompt"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., What is the main subject of this image?"
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <Button onClick={handleAnalyzeImage} disabled={isLoading || !imageFile}>
                                    <Search className="mr-2 h-4 w-4" />
                                    {isLoading ? "Analyzing..." : "Analyze Image"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* --- Analysis Result Card --- */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Analysis Result</CardTitle>
                                <CardDescription>
                                    The AI's response will appear below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading && (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                )}
                                {analysisResult ? (
                                    // Upgraded to ReactMarkdown for consistent, rich text
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {analysisResult}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    !isLoading && (
                                        <p className="text-sm text-muted-foreground">
                                            Upload an image and click "Analyze" to see the result.
                                        </p>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}   