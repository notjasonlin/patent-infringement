"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";
import {
  LayoutDashboard,
  Search,
  History,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Search Patents",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-muted/10 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b px-3 justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="text-lg font-semibold">
            Checkr
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "transparent",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isCollapsed ? "mr-0" : "mr-2"
                  )}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 mt-auto space-y-2">
        <div className={cn("flex", isCollapsed ? "justify-center" : "px-2")}>
          <ThemeSwitcher />
        </div>
        <form action={signOutAction}>
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-2 text-sm",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut size={16} />
            {!isCollapsed && "Sign Out"}
          </Button>
        </form>
      </div>
    </aside>
  );
} 