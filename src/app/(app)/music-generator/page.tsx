// src/app/(app)/music-generator/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react"; // Import Music icon
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MusicGeneratorPage() {
    const [prompt, setPrompt] = useState("");
    const { user } = useAuth();

    const handleGenerate = () => {
        if (!prompt.trim() || !user) {
            toast.warning("Please enter a prompt.");
            return;
        }

        // --- THIS IS THE DEMO CHANGE ---
        // Instead of an API call, just show a toast notification.
        toast.info("This feature will be coming soon!");
        // --- END OF DEMO CHANGE ---
    };

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 overflow-hidden w-full px-2.5">
                <div className="py-4 px-2.5 flex flex-col gap-8 pb-4 max-w-auto w-full mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Music Generator</h1>
                            <p className="text-muted-foreground">
                                Create original music from a text prompt.
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Prompt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A chill lofi beat for studying"
                                className="min-h-[100px] text-base"
                            />
                            <Button onClick={handleGenerate}>
                                <Music className="mr-2 h-4 w-4" />
                                Generate Music
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}