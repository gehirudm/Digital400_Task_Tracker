"use client";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { UserMenu } from "@/components/molecules/user-menu";

interface DashboardHeaderProps {
  user: {
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
  onSignOut: () => void;
}

export function DashboardHeader({ user, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search tasks..." type="search" />
      </div>
      <div className="flex items-center gap-2">
        <Button className="h-8 w-8" size="icon" variant="ghost">
          <Bell className="h-4 w-4" />
        </Button>
        <UserMenu onSignOut={onSignOut} user={user} />
      </div>
    </header>
  );
}
