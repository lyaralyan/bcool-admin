"use client";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3rem",
        } as React.CSSProperties
      }>
      <AppSidebar />
      <SidebarInset>
        {/* <SiteHeader /> */}
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
