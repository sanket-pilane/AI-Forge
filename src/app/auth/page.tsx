"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { auth } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { Icons } from "@/components/icons"; // Assuming you have an icons file
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/"); // Redirect to home on success
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailPasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/"); // Redirect to home on success
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/"); // Redirect to home on success
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                    <Card>
                        <form onSubmit={handleEmailPasswordLogin}>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Welcome back! Please login to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Login
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <Icons.google className="mr-2 h-4 w-4" />
                                    Login with Google
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup">
                    <Card>
                        <form onSubmit={handleEmailPasswordSignUp}>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription>
                                    Create an account to get started with AI Forge.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={6}
                                        required
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign Up
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <Icons.google className="mr-2 h-4 w-4" />
                                    Sign up with Google
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}