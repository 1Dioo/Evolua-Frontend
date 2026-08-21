import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { ActivitiesPage } from "@/pages/Activities/ActivitiesPage";

export const Route = createFileRoute("/atividades")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Minhas Atividades — Projeto Social" },
      {
        name: "description",
        content: "Atividades, questionários e quizzes do aluno com filtros por status e pontuação.",
      },
      { property: "og:title", content: "Minhas Atividades — Projeto Social" },
      { property: "og:description", content: "Acompanhe atividades pendentes, em andamento e concluídas." },
    ],
  }),
  component: ActivitiesPage,
});
