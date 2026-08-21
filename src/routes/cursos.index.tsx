import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { CoursesPage } from "@/pages/Courses/CoursesPage";

export const Route = createFileRoute("/cursos/")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Meus Cursos — Projeto Social" },
      {
        name: "description",
        content: "Cursos de informática do aluno com pesquisa, filtros por categoria, status e progresso.",
      },
      { property: "og:title", content: "Meus Cursos — Projeto Social" },
      {
        property: "og:description",
        content: "Informática básica, hardware, software, Excel, segurança digital e internet.",
      },
    ],
  }),
  component: CoursesPage,
});
