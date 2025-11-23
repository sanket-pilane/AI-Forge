"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    categories: string[];
    models: string[];
    selectedCategory: string | null;
    selectedModel: string | null;
    onSelectCategory: (category: string | null) => void;
    onSelectModel: (model: string | null) => void;
}

export function FilterBar({
    categories,
    models,
    selectedCategory,
    selectedModel,
    onSelectCategory,
    onSelectModel,
}: FilterBarProps) {
    return (
        <div className="space-y-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border/40">
            <div className="flex flex-col gap-2">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-2 p-1">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => onSelectCategory(null)}
                            className="rounded-full"
                        >
                            All Categories
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => onSelectCategory(category === selectedCategory ? null : category)}
                                className="rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-2 p-1">
                        <Button
                            variant={selectedModel === null ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => onSelectModel(null)}
                            className="text-xs h-7"
                        >
                            All Models
                        </Button>
                        {models.map((model) => (
                            <Button
                                key={model}
                                variant={selectedModel === model ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => onSelectModel(model === selectedModel ? null : model)}
                                className="text-xs h-7"
                            >
                                {model}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
}
