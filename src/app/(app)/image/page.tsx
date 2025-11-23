"use client";

import { useState, type ChangeEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { HistoryMenu } from "@/components/HistoryMenu";
import { db } from "@/lib/firebase";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { TypingIndicator } from "@/components/ui/typing-indicator";

export default function ImageAnalyzerPage() {
    const [prompt, setPrompt] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Effect to load history
    useEffect(() => {
        const historyId = searchParams.get("id");
        if (historyId) {
            setIsHistoryLoading(true);
            const fetchHistory = async () => {
                if (!user) return;
                try {
                    const docRef = doc(db, `users/${user.uid}/imageHistory`, historyId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setPrompt(data.prompt);
                        setAnalysisResult(data.analysisResult);
                        setImagePreview(null); // History items don't have images
                        setImageFile(null);
                    } else {
                        toast.error("History not found.");
                        router.push("/image");
                    }
                } catch (err) {
                    toast.error("Failed to load history.");
                } finally {
                    setIsHistoryLoading(false);
                }
            };
            fetchHistory();
        } else {

            setPrompt("Analyze this image and tell me three key objects...");
            setAnalysisResult("");

        }
    }, [searchParams, user, router]);


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setAnalysisResult("");


            if (searchParams.get("id")) {
                router.push("/image", { scroll: false });
            }
        }
    };

    const handleAnalyzeImage = async () => {
        if (!imagePreview || !user) {
            // ... (auth/image checks) ...
            return;
        }

        setIsLoading(true);
        setAnalysisResult("");

        try {
            const token = await user.getIdToken();
            const res = await fetch("/api/image", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ image: imagePreview, prompt: prompt }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to analyze image");
            }

            const data = await res.json();
            setAnalysisResult(data.text);

            // Save history WITHOUT the image data
            const newChatRef = doc(collection(db, `users/${user.uid}/imageHistory`));
            const title = prompt.length > 40 ? prompt.substring(0, 40) + "..." : "Image Analysis";

            await setDoc(newChatRef, {
                chatId: newChatRef.id,
                userId: user.uid,
                title: title,
                prompt: prompt,
                analysisResult: data.text,
                timestamp: serverTimestamp(),
                type: "image",
            });

            router.push(`/image?id=${newChatRef.id}`, { scroll: false });

        } catch (error: any) {
            toast.error("Image Analysis Failed", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 overflow-hidden w-full px-2.5">
                <div className=" space-y-8 pb-4 w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Image Analyzer</h1>
                            <p className="text-muted-foreground">
                                Upload an image and ask the AI anything about it.
                            </p>
                        </div>
                        <HistoryMenu type="image" />
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
                                        disabled={isHistoryLoading}
                                    />
                                    {imagePreview && (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md border mt-4">
                                            <Image
                                                src={imagePreview}
                                                alt="Image preview"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="prompt" className="block text-sm font-medium mb-2 mt-4">
                                        Prompt
                                    </label>
                                    <Textarea
                                        id="prompt"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="min-h-[100px]"
                                        disabled={isHistoryLoading}
                                    />
                                </div>
                                <Button onClick={handleAnalyzeImage} disabled={isLoading || isHistoryLoading || !imagePreview}>
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
                                {(isLoading || isHistoryLoading) && (
                                    <div className="flex justify-center py-10">
                                        <TypingIndicator />
                                    </div>
                                )}
                                {/* Show result if it exists and we aren't loading */}
                                {analysisResult && !isLoading && !isHistoryLoading && (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {analysisResult}
                                        </ReactMarkdown>
                                    </div>
                                )}
                                {/* Also show the loaded history result */}
                                {analysisResult && isHistoryLoading && (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {analysisResult}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}