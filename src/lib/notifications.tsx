import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type NotificationKind = "Cursos" | "Atividades" | "Eventos" | "Certificados" | "Sistema";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

type Ctx = {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (items: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  remove: (id: string) => void;
};

const NotificationsContext = createContext<Ctx | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const markAsRead = (id: string) =>
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));

  const markAllAsRead = () =>
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));

  const remove = (id: string) =>
    setNotifications((items) => items.filter((item) => item.id !== id));

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      setNotifications,
      markAsRead,
      markAllAsRead,
      remove,
    }),
    [notifications],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error("useNotifications deve ser usado dentro de NotificationsProvider.");
  return value;
}
