"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Code, Image } from "lucide-react";

// Define our navigation items
const navItems = [
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Code", href: "/code", icon: Code },
    { name: "Image", href: "/image", icon: Image },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
                <Button
                    key={item.name}
                    asChild // Allows the Button to wrap the Link
                    variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                >
                    <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                    </Link>
                </Button>
            ))}
        </nav>
    );
}