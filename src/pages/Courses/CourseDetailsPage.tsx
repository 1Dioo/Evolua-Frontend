import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  Circle,
  BookOpen,
} from "lucide-react";
import { IconBadge, Panel, ProgressBar, ProgressRing } from "@/components/ui-kit";
import { courseLessons, findCourse } from "@/demo/courses";
import { resolveIcon } from "@/utils/icons";
import type { Lesson, LessonStatus } from "@/types";

const statusMeta: Record<LessonStatus, { label: string; className: string }> = {
  concluida: { label: "Concluída", className: "bg-success/12 text-success" },
  "em-andamento": { label: "Em andamento", className: "bg-primary/12 text-primary-light" },
  bloqueada: { label: "Bloqueada", className: "bg-muted text-muted-foreground" },
};

function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "concluida") return <CheckCircle2 className="size-[18px] text-success" />;
  if (status === "em-andamento") return <Circle className="size-[18px] text-primary-light" />;
  return <Lock className="size-[18px] text-muted-foreground" />;
}

export function CourseDetailsPage({ courseSlug }: { courseSlug: string }) {
  const course = findCourse(courseSlug);

  if (!course) {
    return (
      <Panel className="py-12 text-center">
        <p className="text-sm font-medium">Curso não encontrado</p>
        <Link to="/cursos" className="mt-3 inline-block text-sm text-primary-light hover:underline">
          Voltar para Meus Cursos
        </Link>
      </Panel>
    );
  }

  const lessons = courseLessons(course);
  const nextLesson: Lesson | undefined =
    lessons.find((lesson) => lesson.status === "em-andamento") ??
    lessons.find((lesson) => lesson.status !== "concluida") ??
    lessons[0];
  const Icon = resolveIcon(course.iconName);
  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <div className="space-y-8">
      <Link
        to="/cursos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Meus Cursos
      </Link>

      <Panel className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
            <IconBadge icon={Icon} tone="primary" className="size-12" />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-3xl">{course.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">{course.category}</span>
            <span className="rounded-full border border-border px-3 py-1">{course.hours}</span>
            <span className="rounded-full border border-border px-3 py-1">
              {course.modules?.length ?? 0} módulos
            </span>
            <span className="rounded-full border border-border px-3 py-1">
              {course.totalLessons} aulas • {totalMinutes} min
            </span>
          </div>

          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {course.completedLessons} de {course.totalLessons} aulas concluídas
              </span>
              <span className="font-semibold text-primary-light">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>

          {nextLesson ? (
            <Link
              to="/cursos/$courseSlug/aula/$lessonId"
              params={{ courseSlug: course.slug, lessonId: String(nextLesson.id) }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
            >
              <PlayCircle className="size-4" strokeWidth={2} />
              Continuar aula
            </Link>
          ) : null}
        </div>

        <div className="justify-self-center lg:justify-self-end">
          <ProgressRing value={course.progress} />
        </div>
      </Panel>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Conteúdo do curso</h2>
        {(course.modules ?? []).map((moduleItem) => (
          <Panel key={moduleItem.id} className="p-0">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-xs font-bold text-primary-light">
                {moduleItem.order}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Módulo {moduleItem.order}: {moduleItem.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {moduleItem.lessons.length} aula(s)
                </p>
              </div>
              <BookOpen className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <ul className="divide-y divide-border">
              {moduleItem.lessons.map((lesson) => {
                const meta = statusMeta[lesson.status];
                const locked = lesson.status === "bloqueada";
                const inner = (
                  <>
                    <StatusIcon status={lesson.status} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{lesson.title}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" /> {lesson.duration} min
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </>
                );

                return (
                  <li key={lesson.id}>
                    {locked ? (
                      <div
                        aria-disabled="true"
                        className="grid cursor-not-allowed grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 opacity-70"
                      >
                        {inner}
                      </div>
                    ) : (
                      <Link
                        to="/cursos/$courseSlug/aula/$lessonId"
                        params={{ courseSlug: course.slug, lessonId: String(lesson.id) }}
                        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted"
                      >
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>
        ))}
      </section>
    </div>
  );
}
