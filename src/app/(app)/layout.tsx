
"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

// This layout component will guard all child routes
export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        // The onAuthStateChanged listener in AuthContext will handle the redirect
    };

    if (loading) {
        // Show a full-page loader while checking auth state
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        // If no user, redirect to the auth page
        redirect("/auth");
    }

    // If user is logged in, render the app
    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
                <h1 className="text-lg font-semibold">AI Forge</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {user.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
                {children}
            </main>
        </div>
    );
}