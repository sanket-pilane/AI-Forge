"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react"; // 1. Import useEffect
import { useAuth } from "@/hooks/useAuth";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

// 2. Define the stats shape
type UsageStats = {
    chatCount: number;
    codeCount: number;
    imageCount: number;
    optimizerCount: number;
};

export default function ProfilePage() {
    const { user } = useAuth();

    // Form state
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        user?.photoURL || null
    );
    const [isLoading, setIsLoading] = useState(false);

    // 3. State for stats
    const [stats, setStats] = useState<UsageStats | null>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    // Effect to sync form state with auth user
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setPhotoPreview(user.photoURL || null);
        }
    }, [user]);

    // 4. New Effect to fetch user stats
    useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                setIsStatsLoading(true);
                try {
                    const token = await user.getIdToken();
                    const res = await fetch("/api/user-stats", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!res.ok) throw new Error("Failed to fetch stats");
                    const data = await res.json();
                    setStats(data);
                } catch (error) {
                    console.error(error);
                    toast.error("Could not load usage stats.");
                } finally {
                    setIsStatsLoading(false);
                }
            };
            fetchStats();
        }
    }, [user]); // Re-fetch if user changes

    // ... (memberSince, userInitials, handlePhotoChange, handleSaveProfile) ...
    const memberSince = user?.metadata.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        })
        : "N/A";

    const userInitials =
        user?.email?.substring(0, 2).toUpperCase() || <User className="h-5 w-5" />;

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const uid = user.uid;
        setIsLoading(true);
        let newPhotoURL = user.photoURL;

        try {
            if (photoFile) {
                const storageRef = ref(storage, `avatars/${uid}`);
                await uploadBytes(storageRef, photoFile);
                newPhotoURL = await getDownloadURL(storageRef);
            }

            await updateProfile(user, {
                displayName: displayName,
                photoURL: newPhotoURL,
            });

            const userDocRef = doc(db, "users", uid);
            await setDoc(
                userDocRef,
                {
                    displayName: displayName,
                    photoURL: newPhotoURL,
                    email: user.email,
                },
                { merge: true }
            );

            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col space-y-8">
            <div>
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-muted-foreground">
                    View and edit your profile details.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* --- Column 1: Edit Form --- */}
                <Card className="md:col-span-2">
                    <form onSubmit={handleSaveProfile}>
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>
                                Update your display name and avatar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar Uploader */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={photoPreview || ""} alt="Avatar" />
                                    <AvatarFallback className="text-3xl">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Label
                                        htmlFor="photo-upload"
                                        className="cursor-pointer text-sm font-medium text-primary"
                                    >
                                        Change Photo
                                    </Label>
                                    <Input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG, or GIF (max 2MB).
                                    </p>
                                </div>
                            </div>

                            {/* Display Name */}
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name"
                                />
                            </div>

                            {/* Email (Disabled) */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="cursor-not-allowed"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="mt-3">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* --- Column 2: User Info & Stats --- */}
                <div className="space-y-8 md:col-span-1">
                    {/* User Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm">
                                <p className="font-medium">Member Since</p>
                                <p className="text-muted-foreground">{memberSince}</p>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">User ID</p>
                                <p className="text-muted-foreground truncate">{user?.uid}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- 5. UPDATED: Usage Stats Card --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Usage Summary</CardTitle>
                            <CardDescription>Your activity across AI Forge.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isStatsLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : stats ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <p className="font-medium">Total Chats</p>
                                        <p className="text-muted-foreground">{stats.chatCount}</p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p className="font-medium">Code Generations</p>
                                        <p className="text-muted-foreground">{stats.codeCount}</p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p className="font-medium">Image Analyses</p>
                                        <p className="text-muted-foreground">{stats.imageCount}</p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p className="font-medium">Prompts Optimized</p>
                                        <p className="text-muted-foreground">{stats.optimizerCount}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Could not load stats.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}