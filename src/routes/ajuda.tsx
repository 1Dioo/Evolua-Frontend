import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { HelpPage } from "@/pages/Help/HelpPage";

export const Route = createFileRoute("/ajuda")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Ajuda e FAQ — Projeto Social" },
      {
        name: "description",
        content: "Central de ajuda do aluno com perguntas frequentes sobre conta, cursos, atividades e certificados.",
      },
      { property: "og:title", content: "Ajuda e FAQ — Projeto Social" },
      { property: "og:description", content: "Tire suas dúvidas sobre a plataforma do Projeto Social." },
    ],
  }),
  component: HelpPage,
});
