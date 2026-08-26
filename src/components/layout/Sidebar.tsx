import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, LogOut, Moon, Sun, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Brand } from "./Brand";
import { navItems } from "./nav-items";
import { useTheme } from "@/lib/theme";
import { useNotifications } from "@/lib/notifications";
import { useSidebarState } from "@/hooks/useSidebarState";
import { cn } from "@/lib/utils";

function SidebarBody({
    collapsed,
    onNavigate,
}: {
    collapsed: boolean;
    onNavigate?: () => void;
}) {
    const pathname = useRouterState({
        select: (s) => s.location.pathname,
    });

    const { theme, toggleTheme } = useTheme();
    const { unreadCount } = useNotifications();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();

            toast.success("Sessão encerrada.");

            await navigate({
                to: "/login",
                replace: true,
            });
        } catch (error) {
            console.error("Erro ao sair da conta:", error);

            toast.error("Não foi possível encerrar a sessão.");
        }
    };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto overflow-x-hidden py-5">
      <div className={cn(collapsed ? "px-2" : "px-3")}>
        <Brand collapsed={collapsed} />
      </div>

      <nav className={cn("flex-1 space-y-1", collapsed ? "px-2" : "px-3")}>
        {collapsed ? null : (
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const active = pathname === item.to;
          const showBadge = item.to === "/notificacoes" && unreadCount > 0;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-0",
                active
                  ? "bg-primary/12 text-primary-light"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active ? (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-primary-light" />
              ) : null}
              <span className="relative shrink-0">
                <item.icon className="size-[18px]" strokeWidth={1.75} />
                {collapsed && showBadge ? (
                  <span className="absolute -right-1.5 -top-1.5 size-2 rounded-full bg-primary ring-2 ring-sidebar" />
                ) : null}
              </span>
              {collapsed ? null : (
                <>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {showBadge ? (
                    <span className="grid min-w-[18px] shrink-0 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {unreadCount}
                    </span>
                  ) : null}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn("space-y-1 border-t border-sidebar-border pt-4", collapsed ? "px-2" : "px-3")}>
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Tema claro" : "Tema escuro"}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {theme === "dark" ? (
            <Sun className="size-[18px] shrink-0" strokeWidth={1.75} />
          ) : (
            <Moon className="size-[18px] shrink-0" strokeWidth={1.75} />
          )}n
          {collapsed ? null : <span>{theme === "dark" ? "Tema claro" : "Tema escuro"}</span>}
        </button>
        <button
            type="button"
            onClick={handleLogout}
            title="Sair da conta"
            className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                collapsed && "justify-center px-0",
            )}
        >
            <LogOut
                className="size-[18px] shrink-0"
                strokeWidth={1.75}
            />

            {collapsed ? null : (
                <span>Sair da conta</span>
            )}
        </button>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  const { collapsed, toggleCollapsed } = useSidebarState();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out lg:block"
      style={{ width: collapsed ? "var(--sidebar-width-icon)" : "var(--sidebar-width)" }}
    >
      <SidebarBody collapsed={collapsed} />
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        title={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        className="absolute -right-3.5 top-7 grid size-7 place-items-center rounded-full border border-border bg-surface text-muted-foreground shadow-card transition-all duration-200 hover:border-primary/50 hover:text-primary-light"
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </aside>
  );
}

export function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebarState();

  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "" : "pointer-events-none")}>
      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-[272px] max-w-[85vw] border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={closeMobile}
          aria-label="Fechar menu"
          className="absolute right-3 top-4 z-10 grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-[18px]" />
        </button>
        <SidebarBody collapsed={false} onNavigate={closeMobile} />
      </div>
    </div>
  );
}
