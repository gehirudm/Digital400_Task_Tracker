"use client";

import { Bell, Menu, Search } from "lucide-react";

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
  onMenuToggle: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function DashboardHeader({
  user,
  onSignOut,
  onMenuToggle,
  searchQuery,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <Button
        className="h-8 w-8 md:hidden"
        onClick={onMenuToggle}
        size="icon"
        variant="ghost"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          type="search"
          value={searchQuery}
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button className="h-8 w-8" size="icon" variant="ghost">
          <Bell className="h-4 w-4" />
        </Button>
        <UserMenu onSignOut={onSignOut} user={user} />
      </div>
    </header>
  );
}
