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
      <div className="fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 