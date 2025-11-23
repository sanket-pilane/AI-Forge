"use client";

import { Button } from "@/components/ui/button";
import { Copy, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Prompt } from "@/lib/prompt";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PromptCardProps {
    prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(prompt.prompt_text);
        toast.success("Prompt copied!");
    };

    return (
        <div className="break-inside-avoid mb-6"> {/* Increased margin-bottom for spacing */}
            <Link href={`/gallery/${prompt.id}`} className="block group relative">
                <div className={cn(
                    "relative overflow-hidden rounded-2xl bg-muted/20 transition-all duration-300 group-hover:shadow-xl dark:bg-muted/10",
                )}>
                    {/* Image Container */}
                    <div className="relative w-full overflow-hidden">
                        <Image
                            src={prompt.image_url}
                            alt={prompt.title}
                            width={600}
                            height={0}
                            className="w-full h-auto object-cover rounded-t-2xl"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Dark Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                        {/* --- NEW: Category Badge at Top Left --- */}
                        <div className="absolute top-3 left-3 z-10">
                            <Badge variant="secondary" className="bg-black/60 hover:bg-black/70 text-white backdrop-blur-md border-0 text-xs font-medium px-2.5 py-0.5">
                                {prompt.category}
                            </Badge>
                        </div>

                        {/* Top Right: Copy Button (Visible on Hover) */}
                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-2 group-hover:translate-y-0">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-black shadow-sm"
                                onClick={handleCopy}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end translate-y-2 group-hover:translate-y-0">
                            {/* Title */}
                            <h3 className="text-white font-semibold text-base line-clamp-2 mb-3">
                                {prompt.title}
                            </h3>

                            {/* User & Likes Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6 border border-white/20">
                                        <AvatarFallback className="text-[9px] bg-white/10 text-white">
                                            {prompt.author[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-white/90 font-medium truncate max-w-[100px]">
                                        {prompt.author}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/90 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                                    <Heart className="h-3.5 w-3.5 fill-current" />
                                    <span className="text-xs font-bold">{prompt.likes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}