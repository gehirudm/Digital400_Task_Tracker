"use client";

import { useState } from "react";

import { Separator } from "@/components/atoms/separator";
import { Skeleton } from "@/components/atoms/skeleton";
import { SettingsAccountCard } from "@/components/organisms/settings-account-card";
import { SettingsProfileForm } from "@/components/organisms/settings-profile-form";
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
        <SettingsProfileForm
          avatarUrl={avatarUrl}
          name={name}
          onAvatarUrlChange={setAvatarUrl}
          onNameChange={setName}
          onSave={handleSave}
          saving={saving}
        />
        <SettingsAccountCard email={data?.me?.email ?? ""} />
      </div>
    </div>
  );
}
