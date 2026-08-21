import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { LessonPage } from "@/pages/Lesson/LessonPage";

export const Route = createFileRoute("/cursos/$courseSlug/aula/$lessonId")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: () => ({
    meta: [
      { title: "Aula — Projeto Social" },
      {
        name: "description",
        content: "Assista à videoaula, acesse materiais complementares e faça a atividade.",
      },
      { property: "og:title", content: "Aula — Projeto Social" },
      {
        property: "og:description",
        content: "Videoaula, conteúdo, materiais complementares e atividade prática.",
      },
    ],
  }),
  component: LessonRoute,
});

function LessonRoute() {
  const { courseSlug, lessonId } = Route.useParams();
  return <LessonPage courseSlug={courseSlug} lessonId={lessonId} />;
}
