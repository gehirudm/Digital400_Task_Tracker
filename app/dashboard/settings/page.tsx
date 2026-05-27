"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Separator } from "@/components/atoms/separator";
import { Skeleton } from "@/components/atoms/skeleton";
import { useMe, useUpdateUser } from "@/hooks/use-users";

export default function SettingsPage() {
  const { data, loading } = useMe();
  const [updateUser, { loading: saving }] = useUpdateUser();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (data?.me && !initialized) {
    setName(data.me.name ?? "");
    setAvatarUrl(data.me.avatarUrl ?? "");
    setInitialized(true);
  }

  const handleSave = async () => {
    await updateUser({
      variables: {
        input: {
          name: name.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
        <Separator className="my-6" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">
        Manage your account and preferences.
      </p>
      <Separator className="my-6" />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>
              Update your display name and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                type="url"
                value={avatarUrl}
              />
              {avatarUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                    <Image
                      alt="Avatar preview"
                      className="object-cover"
                      fill
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      src={avatarUrl}
                      unoptimized
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
            <Button disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Email</span>
              <p className="text-sm font-medium">{data?.me?.email ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
