"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="flex h-full flex-col">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                        Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email || ""} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                            id="name"
                            placeholder="Your display name"
                            defaultValue={user?.displayName || ""}
                        />
                    </div>
                    <Button>Update Profile</Button>
                </CardContent>
            </Card>
        </div>
    );
}