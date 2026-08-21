import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { NotificationsPage } from "@/pages/Notifications/NotificationsPage";

export const Route = createFileRoute("/notificacoes")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Notificações — Projeto Social" },
      {
        name: "description",
        content: "Atualizações sobre cursos, atividades, eventos e certificados do aluno.",
      },
      { property: "og:title", content: "Notificações — Projeto Social" },
      { property: "og:description", content: "Veja atualizações importantes sobre seus cursos e atividades." },
    ],
  }),
  component: NotificationsPage,
});
