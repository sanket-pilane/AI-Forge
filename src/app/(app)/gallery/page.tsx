"use client";

import { useState, useMemo } from "react";
import { prompts } from "@/lib/prompt";
import { PromptCard } from "@/components/gallery/PromptCard";
import { FilterBar } from "@/components/gallery/FilterBar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function GalleryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    // Extract unique categories and models
    const categories = useMemo(() => Array.from(new Set(prompts.map((p) => p.category))), []);
    const models = useMemo(() => Array.from(new Set(prompts.map((p) => p.model))), []);

    // Filter prompts
    const filteredPrompts = useMemo(() => {
        return prompts.filter((prompt) => {
            const matchesSearch =
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.prompt_text.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory ? prompt.category === selectedCategory : true;
            const matchesModel = selectedModel ? prompt.model === selectedModel : true;

            return matchesSearch && matchesCategory && matchesModel;
        });
    }, [searchQuery, selectedCategory, selectedModel]);

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl space-y-6">

                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Prompt Gallery</h1>
                            <p className="text-muted-foreground mt-1">
                                Discover and copy curated AI prompts for your next project.
                            </p>
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search prompts..."
                                className="pl-9 bg-background/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <FilterBar
                        categories={categories}
                        models={models}
                        selectedCategory={selectedCategory}
                        selectedModel={selectedModel}
                        onSelectCategory={setSelectedCategory}
                        onSelectModel={setSelectedModel}
                    />

                    {/* Grid */}
                    {filteredPrompts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
                            {filteredPrompts.map((prompt) => (
                                <PromptCard
                                    key={prompt.id}
                                    prompt={prompt}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No prompts found</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
