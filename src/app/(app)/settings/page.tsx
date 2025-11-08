"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="flex h-full flex-col">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>
                        Manage your application preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="dark-mode" className="text-base">
                                Dark Mode
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Toggle dark and light theme.
                            </p>
                        </div>
                        <Switch id="dark-mode" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="notifications" className="text-base">
                                Email Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive updates about your account.
                            </p>
                        </div>
                        <Switch id="notifications" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}