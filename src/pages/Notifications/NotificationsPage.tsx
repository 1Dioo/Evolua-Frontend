import { useMemo, useState } from "react";
import { Award, Bell, BookOpen, Calendar, Check, CheckCheck, ClipboardCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { IconBadge, Panel, SectionTitle } from "@/components/ui-kit";
import { useNotifications, type NotificationKind } from "@/lib/notifications";


export const kindIcon: Record<NotificationKind, typeof Bell> = {
  Cursos: BookOpen,
  Atividades: ClipboardCheck,
  Eventos: Calendar,
  Certificados: Award,
  Sistema: Bell,
};

const filters = ["Todas", "Não lidas", "Cursos", "Atividades", "Eventos", "Certificados"] as const;

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, remove } = useNotifications();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");

  const list = useMemo(() => {
    if (filter === "Todas") return notifications;
    if (filter === "Não lidas") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.kind === filter);
  }, [filter, notifications]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">Notificações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Veja atualizações importantes sobre seus cursos e atividades.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            markAllAsRead();
            toast.success("Todas as notificações foram marcadas como lidas.");
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary-light"
        >
          <CheckCheck className="size-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Marcar todas como lidas</span>
        </button>
      </div>

      <section>
        <SectionTitle
          title="Central de avisos"
          subtitle={unreadCount > 0 ? `${unreadCount} não lida(s)` : "Tudo em dia"}
        />
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === item
                  ? "border-primary/40 bg-primary/12 text-primary-light"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <Panel className="py-12 text-center">
            <Bell className="mx-auto size-6 text-muted-foreground" strokeWidth={1.75} />
            <p className="mt-3 text-sm font-medium">Nenhuma notificação por aqui</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Quando houver novidades nos seus cursos, elas aparecem nesta lista.
            </p>
          </Panel>
        ) : (
          <Panel className="divide-y divide-border p-0">
            {list.map((notification) => (
              <div
                key={notification.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              >
                <IconBadge
                  icon={kindIcon[notification.kind]}
                  tone={notification.read ? "muted" : "primary"}
                />
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium">{notification.title}</p>
                    {!notification.read ? (
                      <span className="size-2 shrink-0 rounded-full bg-primary-light" aria-label="Não lida" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{notification.description}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {notification.time} • {notification.kind}
                  </p>
                </div>
                <div className="col-span-2 flex gap-2 sm:col-span-1">
                  {!notification.read ? (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      aria-label="Marcar como lida"
                      className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary-light"
                    >
                      <Check className="size-4" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      remove(notification.id);
                      toast.success("Notificação excluída.");
                    }}
                    aria-label="Excluir notificação"
                    className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </Panel>
        )}
      </section>
    </div>
  );
}
