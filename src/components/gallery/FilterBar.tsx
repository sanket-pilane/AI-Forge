"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

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
    const mainTabs = ["Featured", "Hot", "New", "Top"];

    return (
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 w-full">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Left: Quick Sort Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {mainTabs.map((tab) => (
                            <button
                                key={tab}
                                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted/50"
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Right: Dropdown Filters */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-muted-foreground">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline-block mr-2">Filters:</span>
                        </div>

                        {/* Category Dropdown */}
                        <Select
                            value={selectedCategory || "all"}
                            onValueChange={(val) => onSelectCategory(val === "all" ? null : val)}
                        >
                            <SelectTrigger className="w-[160px] h-9 bg-muted/40 border-border/60">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Model Dropdown */}
                        <Select
                            value={selectedModel || "all"}
                            onValueChange={(val) => onSelectModel(val === "all" ? null : val)}
                        >
                            <SelectTrigger className="w-[160px] h-9 bg-muted/40 border-border/60">
                                <SelectValue placeholder="Model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Models</SelectItem>
                                {models.map((model) => (
                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}