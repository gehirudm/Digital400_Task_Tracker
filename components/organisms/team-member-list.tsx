"use client";

import { Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Card, CardHeader, CardTitle } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";
import { useUsers } from "@/hooks/use-users";

export function TeamMemberList() {
  const { data, loading } = useUsers();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <Separator />
        {[1, 2, 3].map((i) => (
          <div className="h-16 w-full animate-pulse rounded bg-muted" key={i} />
        ))}
      </div>
    );
  }

  const users = data?.users ?? [];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold tracking-tight">Team</h1>
      <p className="text-sm text-muted-foreground">
        People you can assign tasks to.
      </p>
      <Separator className="my-6" />
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Users className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">No team members yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your project to invite collaborators.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {(user.name ?? user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {user.name ?? user.email.split("@")[0]}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
