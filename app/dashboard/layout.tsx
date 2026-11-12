"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardProvider, useDashboard } from "@/lib/DashboardContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isSidebarCollapsed } = useDashboard();
  const pathname = usePathname();
  const isFullWidthPage = pathname === "/dashboard/appearance";

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <TopNav onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        {isFullWidthPage ? (
          <main className="flex-1 w-full animate-in fade-in duration-200">
            {children}
          </main>
        ) : (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
