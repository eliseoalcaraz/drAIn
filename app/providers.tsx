"use client";

import { AuthProvider } from "@/components/context/AuthProvider";
import { ReportProvider } from "@/components/context/ReportProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <ReportProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ReportProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
