"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Sheet, SheetContent } from "@/components/atoms/sheet";
import { DashboardHeader } from "@/components/organisms/dashboard-header";
import { Sidebar } from "@/components/organisms/sidebar";
import { SearchProvider, useSearch } from "@/lib/search-context";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState<{
    name: string | null;
    email: string;
    avatarUrl: string | null;
  } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { query, setQuery } = useSearch();

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
      <Sidebar className="hidden md:flex" />
      <Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
        <SheetContent className="w-56 p-0" side="left">
          <Sidebar
            className="border-0"
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          onMenuToggle={() => setMobileOpen(true)}
          onSearchChange={setQuery}
          onSignOut={handleSignOut}
          searchQuery={query}
          user={user}
        />
        <main className="flex-1 overflow-hidden bg-muted/30">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SearchProvider>
      <DashboardContent>{children}</DashboardContent>
    </SearchProvider>
  );
}
