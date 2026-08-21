import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { EventsPage } from "@/pages/Events/EventsPage";

export const Route = createFileRoute("/eventos")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Eventos — Projeto Social" },
      {
        name: "description",
        content: "Calendário de oficinas presenciais e online do Projeto Social, com próximos e anteriores.",
      },
      { property: "og:title", content: "Eventos — Projeto Social" },
      { property: "og:description", content: "Agenda de oficinas de informática, Excel e segurança digital." },
    ],
  }),
  component: EventsPage,
});
