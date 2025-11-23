"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Prompt } from "@/lib/prompt";

interface PromptCardProps {
    prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        navigator.clipboard.writeText(prompt.prompt_text);
        toast.success("Prompt copied to clipboard!");
    };

    return (
        <Link href={`/gallery/${prompt.id}`} className="block h-full">
            <Card
                className="group relative overflow-hidden border-0 bg-gray-900/50 transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={prompt.image_url}
                        alt={prompt.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={cn(
                        "absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center opacity-0",
                        isHovered ? "opacity-100" : ""
                    )}>
                        <Button
                            size="lg"
                            className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                            onClick={handleCopy}
                        >
                            <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                        </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-xs text-white backdrop-blur-sm">
                            <Heart className="h-3 w-3 fill-current text-red-500" />
                            <span>{prompt.likes}</span>
                        </div>
                    </div>
                </div>
                <CardFooter className="flex flex-col items-start gap-1 p-3 mt-auto">
                    <div className="flex w-full items-center justify-between">
                        <span className="text-xs font-medium text-primary/80 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                            {prompt.model}
                        </span>
                    </div>
                    <h3 className="line-clamp-1 text-sm font-semibold text-white">
                        {prompt.title}
                    </h3>
                </CardFooter>
            </Card>
        </Link>
    );
}
