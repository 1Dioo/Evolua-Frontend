import { Link, useRouterState } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import { DesktopSidebar, MobileSidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { bottomNavPaths, navItems } from "./nav-items";
import { SidebarStateProvider, useSidebarState } from "@/hooks/useSidebarState";
import { cn } from "@/lib/utils";

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = bottomNavPaths
    .map((path) => navItems.find((item) => item.to === path))
    .filter((item): item is (typeof navItems)[number] => Boolean(item));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-primary-light" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-xl transition-colors",
                  active && "bg-primary/12",
                )}
              >
                <item.icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span className="max-w-full truncate px-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function LayoutShell({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebarState();

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <MobileSidebar />

      <div
        className="lg:pl-[var(--current-sidebar)] lg:transition-[padding-left] lg:duration-300 lg:ease-in-out"
        style={
          {
            "--current-sidebar": collapsed ? "var(--sidebar-width-icon)" : "var(--sidebar-width)",
          } as CSSProperties
        }
      >
        <Topbar />
        <main className="mx-auto max-w-[1240px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}


export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarStateProvider>
      <LayoutShell>{children}</LayoutShell>
    </SidebarStateProvider>
  );
}
