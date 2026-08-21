import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Panel, ProgressBar } from "@/components/ui-kit";
import { VideoPlayer } from "@/components/VideoPlayer";
import { courseLessons, findCourse } from "@/demo/courses";

export function LessonPage({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: string;
}) {
  const course = findCourse(courseSlug);
  const lessons = course ? courseLessons(course) : [];
  const index = lessons.findIndex((item) => String(item.id) === lessonId);
  const lesson = index >= 0 ? lessons[index] : undefined;

  if (!course || !lesson) {
    return (
      <Panel className="py-12 text-center">
        <p className="text-sm font-medium">Aula não encontrada</p>
        <Link to="/cursos" className="mt-3 inline-block text-sm text-primary-light hover:underline">
          Voltar para Meus Cursos
        </Link>
      </Panel>
    );
  }

  const previous = index > 0 ? lessons[index - 1] : undefined;
  const next = index < lessons.length - 1 ? lessons[index + 1] : undefined;
  const moduleItem = (course.modules ?? []).find((item) => item.id === lesson.moduleId);

  return (
    <div className="space-y-6">
      <Link
        to="/cursos/$courseSlug"
        params={{ courseSlug: course.slug }}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {course.title}
      </Link>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {moduleItem ? `Módulo ${moduleItem.order}: ${moduleItem.title}` : course.title}
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
        <p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> {lesson.duration} min
          </span>
          <span>
            Aula {index + 1} de {lessons.length}
          </span>
        </p>
      </div>

      <VideoPlayer
        videoUrl={lesson.videoUrl}
        thumbnailUrl={lesson.thumbnailUrl}
        title={lesson.title}
      />

      <Panel className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progresso do curso</span>
          <span className="font-semibold text-primary-light">{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="min-w-0 space-y-3">
          <h2 className="text-base font-semibold">Conteúdo da aula</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{lesson.description}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{lesson.content}</p>
        </Panel>

        <div className="min-w-0 space-y-6">
          <Panel className="space-y-3">
            <h2 className="text-base font-semibold">Materiais complementares</h2>
            <ul className="space-y-2">
              {(lesson.materials ?? []).map((material) => (
                <li key={material.label}>
                  <button
                    type="button"
                    onClick={() => toast.success(`${material.label} — disponível em breve.`)}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-muted"
                  >
                    {material.type === "pdf" ? (
                      <Download className="size-4 shrink-0 text-primary-light" />
                    ) : (
                      <ExternalLink className="size-4 shrink-0 text-primary-light" />
                    )}
                    <span className="min-w-0 truncate">{material.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          {lesson.activity ? (
            <Panel className="space-y-3">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-purple/12 text-purple-light">
                  <ClipboardCheck className="size-[18px]" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{lesson.activity.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{lesson.activity.description}</p>
                </div>
              </div>
              <Link
                to="/atividades"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary hover:text-primary-foreground"
              >
                Fazer atividade
              </Link>
            </Panel>
          ) : null}
        </div>
      </div>

      <Panel className="flex flex-wrap items-center justify-between gap-3">
        {previous ? (
          <Link
            to="/cursos/$courseSlug/aula/$lessonId"
            params={{ courseSlug: course.slug, lessonId: String(previous.id) }}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Anterior
          </Link>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => toast.success("Aula marcada como concluída.")}
          className="inline-flex items-center gap-2 rounded-xl bg-success/15 px-4 py-2.5 text-sm font-semibold text-success transition-colors hover:bg-success/25"
        >
          <CheckCircle2 className="size-4" /> Marcar como concluída
        </button>

        {next ? (
          <Link
            to="/cursos/$courseSlug/aula/$lessonId"
            params={{ courseSlug: course.slug, lessonId: String(next.id) }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
          >
            Próxima <ArrowRight className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </Panel>
    </div>
  );
}
