'use client';

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
  user
}: {
  children: React.ReactNode;
  user: any;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (!user || !isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 