"use client";

import { DashboardHeader } from "@/components/organisms/dashboard-header";
import { Sidebar } from "@/components/organisms/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          onSignOut={handleSignOut}
          user={{
            name: null,
            email: "user@example.com",
            avatarUrl: null,
          }}
        />
        <main className="flex-1 overflow-hidden bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
