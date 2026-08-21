import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";

export const Route = createFileRoute("/")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Início — Projeto Social" },
      {
        name: "description",
        content: "Resumo do aluno: progresso geral, cursos em andamento e atividades recentes.",
      },
      { property: "og:title", content: "Início — Projeto Social" },
      { property: "og:description", content: "Acompanhe seu progresso nos cursos de informática básica." },
    ],
  }),
  component: DashboardPage,
});
