"use client";

import Image from "next/image";

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

interface SettingsProfileFormProps {
  name: string;
  avatarUrl: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onAvatarUrlChange: (value: string) => void;
  onSave: () => void;
}

export function SettingsProfileForm({
  name,
  avatarUrl,
  saving,
  onNameChange,
  onAvatarUrlChange,
  onSave,
}: Readonly<SettingsProfileFormProps>) {
  return (
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
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            value={name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            onChange={(e) => onAvatarUrlChange(e.target.value)}
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
        <Button disabled={saving} onClick={onSave}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
