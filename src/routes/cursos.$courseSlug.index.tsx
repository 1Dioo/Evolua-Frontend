import { createFileRoute, redirect } from "@tanstack/react-router";
import { authSession } from "@/lib/auth";
import { CourseDetailsPage } from "@/pages/Courses/CourseDetailsPage";
import { findCourse } from "@/demo/courses";

export const Route = createFileRoute("/cursos/$courseSlug/")({
  beforeLoad: () => { if (!authSession.isAuthenticated()) throw redirect({ to: "/login" }); },
  head: ({ params }) => {
    const course = findCourse(params.courseSlug);
    const title = course ? `${course.title} — Projeto Social` : "Curso — Projeto Social";
    const description = course
      ? `${course.description} Módulos, aulas e progresso do curso.`
      : "Detalhes do curso, módulos e aulas no Projeto Social.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CourseDetailsRoute,
});

function CourseDetailsRoute() {
  const { courseSlug } = Route.useParams();
  return <CourseDetailsPage courseSlug={courseSlug} />;
}
