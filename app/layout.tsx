import { ThemeProvider } from "next-themes";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import DashboardLayout from "@/components/dashboard-layout";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Checkr - Patent Analysis",
  description: "AI-powered patent infringement checker",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DashboardLayout user={user}>
            {children}
          </DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
