"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    MessageSquare,
    Code,
    Image as ImageIcon,
    Settings,
    Bot,
    Wand2,
    SquarePen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define our navigation items
const navItems = [
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Code Editor", "href": "/code", icon: Code },
    { name: "Image Analyzer", href: "/image", icon: ImageIcon },
    { name: "Prompt Optimizer", href: "/optimizer", icon: Wand2 },
];

interface SidebarProps {
    isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
    const pathname = usePathname();

    // Applied "grey black" background and light text
    const sidebarBg = "bg-gray-950 text-gray-100";

    // Class for full-width link content and vertical alignment
    const linkClasses = "w-full flex items-center";

    return (
        <TooltipProvider>
            <div className={cn("flex h-full flex-col", sidebarBg)}>

                {/* Logo Section */}
                <div className="flex h-16 items-center border-b border-gray-800 px-6">
                    <Link href="/" className={cn("flex items-center font-semibold", isCollapsed ? "justify-center" : "gap-2")}>
                        <Bot className="h-6 w-6" />
                        <span
                            className={cn(
                                "transition-opacity",
                                isCollapsed ? "opacity-0 w-0" : "opacity-100"
                            )}
                        >
                            AI Forge
                        </span>
                    </Link>
                </div>

                {/* New Chat Button */}
                <div className="p-4">
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                variant="outline"
                                className={cn(
                                    "w-full transition-all duration-300 h-10",
                                    // Button alignment
                                    isCollapsed ? "justify-center" : "justify-start"
                                )}
                            >
                                {/* Link ensures content is flex and centers itself within the button */}
                                <Link href="/chat" className={cn(linkClasses, isCollapsed ? "justify-center" : "justify-start")}>
                                    <SquarePen className="h-4 w-4" />
                                    <span
                                        className={cn(
                                            "transition-all duration-300 whitespace-nowrap overflow-hidden",
                                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                        )}
                                    >
                                        New Chat
                                    </span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right" sideOffset={5} className="bg-gray-700 text-white">
                                New Chat
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>


                {/* Main Nav Items */}
                <nav className="flex-1 space-y-2 px-4 py-6">
                    {navItems.map((item) => (
                        <Tooltip key={item.name} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    asChild
                                    variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full transition-all duration-300 h-10",
                                        // Button alignment
                                        isCollapsed ? "justify-center p-0" : "justify-start"
                                    )}
                                >
                                    {/* Link ensures content is flex and centers itself within the button */}
                                    <Link href={item.href} className={cn(linkClasses, isCollapsed ? "justify-center" : "justify-start")}>
                                        <item.icon className="h-4 w-4 ml-2" />
                                        <span
                                            className={cn(
                                                "transition-all duration-300 whitespace-nowrap overflow-hidden",
                                                isCollapsed ? "w-0 opacity-0 " : "w-auto opacity-100 ml-2"
                                            )}
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" sideOffset={5} className="bg-gray-700 text-white">
                                    {item.name}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    ))}
                </nav>

                {/* Settings Link (Bottom) */}
                <nav className="mt-auto space-y-2 px-4 pb-6">
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                variant={pathname.startsWith("/settings") ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full transition-all duration-300 h-10",
                                    // Button alignment
                                    isCollapsed ? "justify-center" : "justify-start"
                                )}
                            >
                                {/* Link ensures content is flex and centers itself within the button */}
                                <Link href="/settings" className={cn(linkClasses, isCollapsed ? "justify-center" : "justify-start")}>
                                    <Settings className="h-4 w-4" />
                                    <span
                                        className={cn(
                                            "transition-all duration-300 whitespace-nowrap overflow-hidden",
                                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2"
                                        )}
                                    >
                                        Settings
                                    </span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right" sideOffset={5} className="bg-gray-700 text-white">
                                Settings
                            </TooltipContent>
                        )}
                    </Tooltip>
                </nav>
            </div>
        </TooltipProvider>
    );
}