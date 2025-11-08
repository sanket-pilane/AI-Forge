"use client";

import { useState } from "react"; // Import useState
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { Loader2, Menu } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { UserMenu } from "@/components/UserMenu"; // Import UserMenu
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    // State for sidebar collapse
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        redirect("/auth");
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
            {/* --- Sidebar (Desktop) --- */}
            <aside
                className={cn(
                    "hidden border-r bg-muted/40 md:block transition-all duration-300",
                    isCollapsed ? "w-20" : "w-64" // Dynamic width
                )}
            >
                <Sidebar isCollapsed={isCollapsed} />
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex flex-col h-screen overflow-hidden">
                {/* --- Header --- */}
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4">
                    <div className="flex items-center gap-2">
                        {/* Desktop Toggle Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="hidden md:flex" // Only on desktop
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>

                        {/* Mobile Menu Button */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 md:hidden" // Only on mobile
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0">
                                {/* Mobile sidebar is always "expanded" */}
                                <Sidebar isCollapsed={false} />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* User Menu (right-aligned) */}
                    <UserMenu user={user} handleLogout={handleLogout} />
                </header>

                {/* --- Page Content --- */}
                <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}