"use client";

import { useParams, useRouter } from "next/navigation";
import { prompts } from "@/lib/prompt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Copy, Heart, Share2, Download } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

export default function PromptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const prompt = prompts.find((p) => p.id === id);

    if (!prompt) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold">Prompt not found</h1>
                <Button variant="link" onClick={() => router.back()}>
                    Go back
                </Button>
            </div>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt_text);
        toast.success("Prompt copied to clipboard!");
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Header / Nav */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/gallery">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-lg font-semibold truncate max-w-md">{prompt.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button size="sm" onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="flex flex-col lg:flex-row h-full">

                    {/* Left: Image */}
                    <div className="relative w-full lg:w-3/5 h-[50vh] lg:h-full bg-black/5 flex items-center justify-center p-4 lg:p-8">
                        <div className="relative w-full h-full max-h-[800px] rounded-lg overflow-hidden shadow-2xl">
                            <Image
                                src={prompt.image_url}
                                alt={prompt.title}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>



                    <div className="w-full lg:w-2/5 flex-1 lg:h-full lg:flex-none bg-card border-l border-border/40 flex flex-col min-h-0">

                        <div className="p-6 space-y-8">

                            {/* Meta Info */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="text-sm px-3 py-1">{prompt.model}</Badge>
                                    <Badge variant="outline" className="text-sm px-3 py-1">{prompt.category}</Badge>
                                    <div className="ml-auto flex items-center gap-1 text-muted-foreground text-sm">
                                        <Heart className="h-4 w-4 fill-current text-red-500" />
                                        <span>{prompt.likes}</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold leading-tight">{prompt.title}</h2>
                                    <p className="text-muted-foreground mt-1">By {prompt.author}</p>
                                </div>
                            </div>

                            {/* Master Prompt */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">The Master Prompt</h3>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleCopy}>
                                        <Copy className="mr-2 h-3 w-3" /> Copy
                                    </Button>
                                </div>
                                <div className="relative group">
                                    <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed font-mono border border-border/50">
                                        {prompt.prompt_text}
                                    </div>
                                </div>
                            </div>

                            {/* Negative Prompt */}
                            {prompt.negative_prompt && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Negative Prompt</h3>
                                    <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground font-mono border border-border/30">
                                        {prompt.negative_prompt}
                                    </div>
                                </div>
                            )}

                            {/* Parameters */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Settings</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(prompt.parameters).map(([key, value]) => (
                                        <div key={key} className="flex flex-col p-3 rounded-md bg-muted/30 border border-border/30">
                                            <span className="text-xs text-muted-foreground capitalize mb-1">{key}</span>
                                            <span className="text-sm font-mono font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={prompt.image_url} target="_blank" rel="noopener noreferrer" download>
                                        <Download className="mr-2 h-4 w-4" /> Download Reference Image
                                    </a>
                                </Button>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div >
    );
}
