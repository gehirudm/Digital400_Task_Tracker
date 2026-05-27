"use client";

import { Home, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const dashboardPath = "/dashboard";

const navItems = [
  { href: dashboardPath, label: "Dashboard", icon: LayoutDashboard },
  { href: `${dashboardPath}/projects`, label: "Projects", icon: Home },
  { href: `${dashboardPath}/team`, label: "Team", icon: Users },
  { href: `${dashboardPath}/settings`, label: "Settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-56 shrink-0 flex-col border-r bg-background",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-sm font-semibold">TaskFlow</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === dashboardPath
              ? pathname === dashboardPath
              : pathname.startsWith(item.href);

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
