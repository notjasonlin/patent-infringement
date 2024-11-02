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
    name: "Analyze Patents",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    name: "Saved Searches",
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
    <div className={cn(
      "h-screen bg-background border-r flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-14 items-center border-b shrink-0">
        <div className={cn(
          "flex w-full items-center px-3",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
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
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-2 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "transparent",
                    isCollapsed ? "justify-center px-2" : "px-3"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isCollapsed ? "mx-auto" : "mr-2"
                    )}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t space-y-4 shrink-0",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "flex",
          isCollapsed ? "justify-center" : "px-2"
        )}>
          <ThemeSwitcher />
        </div>
        <form action={signOutAction}>
          <Button
            variant="ghost"
            className={cn(
              "flex items-center",
              isCollapsed ? "w-10 h-10 justify-center p-0 mx-auto" : "w-full gap-2 text-sm"
            )}
          >
            <LogOut size={isCollapsed ? 20 : 16} />
            {!isCollapsed && "Sign Out"}
          </Button>
        </form>
      </div>
    </div>
  );
} 