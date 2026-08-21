import { Link } from "@tanstack/react-router";
import { Bell, Check, Menu, Moon, Search, Sun } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserMenu } from "./UserMenu";
import { useTheme } from "@/lib/theme";
import { useNotifications } from "@/lib/notifications";
import { useSidebarState } from "@/hooks/useSidebarState";

export function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { openMobile } = useSidebarState();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const recent = notifications.slice(0, 4);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={openMobile}
            aria-label="Abrir menu"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground lg:hidden"
          >
            <Menu className="size-[18px]" />
          </button>
          <Link
            to="/cursos"
            className="hidden min-w-0 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 sm:flex sm:w-full sm:max-w-xs"
          >
            <Search className="size-4 shrink-0" />
            <span className="truncate">Buscar cursos e atividades</span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-light"
          >
            {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Notificações"
                className="relative grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-light"
              >
                <Bell className="size-[18px]" />
                {unreadCount > 0 ? (
                  <span className="absolute right-2 top-2 grid min-w-[16px] place-items-center rounded-full bg-primary px-1 text-[9px] font-bold leading-4 text-primary-foreground ring-2 ring-background">
                    {unreadCount}
                  </span>
                ) : null}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[320px] p-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-4 py-3">
                <p className="min-w-0 truncate text-sm font-semibold">Notificações</p>
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="shrink-0 text-xs font-medium text-primary-light hover:underline"
                >
                  Marcar todas
                </button>
              </div>
              <div className="max-h-72 divide-y divide-border overflow-y-auto">
                {recent.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Nenhuma notificação.
                  </p>
                ) : (
                  recent.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <span
                        className={`mt-1 size-2 shrink-0 rounded-full ${
                          notification.read ? "bg-border" : "bg-primary-light"
                        }`}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{notification.title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {notification.description}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          {notification.time}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-border p-3">
                <Link
                  to="/notificacoes"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
                >
                  <Check className="size-3.5" /> Ver todas
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
