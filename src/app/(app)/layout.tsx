"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { Loader2, Bot, Menu } from "lucide-react";
import { User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();

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
        // Main grid: Sidebar (desktop) + Main Content (header + page)
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr]">

            {/* --- Sidebar (Desktop) --- */}
            <aside className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col py-6">
                    <div className="flex items-center px-6 pb-4">
                        <Bot className="h-6 w-6" />
                        <h1 className="ml-2 text-lg font-semibold">AI Forge</h1>
                    </div>
                    <Sidebar />
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex flex-col">

                {/* --- Header --- */}
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:justify-end">

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
                        <SheetContent side="left" className="p-0 pt-6">
                            <div className="flex items-center px-6 pb-4">
                                <Bot className="h-6 w-6" />
                                <h1 className="ml-2 text-lg font-semibold">AI Forge</h1>
                            </div>
                            <Sidebar />
                        </SheetContent>
                    </Sheet>

                    {/* User Menu (right-aligned) */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                            {user.email}
                        </span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </header>

                {/* --- Page Content --- */}
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}