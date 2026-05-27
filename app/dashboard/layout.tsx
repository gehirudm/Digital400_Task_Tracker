"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/organisms/dashboard-header";
import { Sidebar } from "@/components/organisms/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState<{
    name: string | null;
    email: string;
    avatarUrl: string | null;
  } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (sessionUser) {
        setUser({
          name: sessionUser.user_metadata.name ?? null,
          email: sessionUser.email ?? "",
          avatarUrl: sessionUser.user_metadata.avatar_url ?? null,
        });
      } else {
        router.push("/login");
      }
    };
    void loadUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onSignOut={handleSignOut} user={user} />
        <main className="flex-1 overflow-hidden bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
