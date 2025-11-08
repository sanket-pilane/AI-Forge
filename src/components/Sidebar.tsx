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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define our navigation items
const navItems = [
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Code", href: "/code", icon: Code },
    { name: "Image Analyzer", href: "/image", icon: ImageIcon },
    { name: " Prompt Optimizer", href: "/optimizer", icon: Wand2 },
];

interface SidebarProps {
    isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
    const pathname = usePathname();

    return (
        <TooltipProvider>
            <div className="flex h-full flex-col">
                {/* Logo Section */}
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
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

                {/* Main Nav Items */}
                <nav className="flex-1 space-y-2 px-4 py-6">
                    {navItems.map((item) => (
                        <Tooltip key={item.name} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    asChild
                                    variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span
                                            className={cn(
                                                "ml-2 transition-all",
                                                isCollapsed ? "w-0 opacity-0 " : "w-auto opacity-100"
                                            )}
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" sideOffset={5}>
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
                                    "w-full justify-start",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <Link href="/settings">
                                    <Settings className="h-4 w-4" />
                                    <span
                                        className={cn(
                                            "ml-2 transition-all",
                                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                        )}
                                    >
                                        Settings
                                    </span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right" sideOffset={5}>
                                Settings
                            </TooltipContent>
                        )}
                    </Tooltip>
                </nav>
            </div>
        </TooltipProvider>
    );
}