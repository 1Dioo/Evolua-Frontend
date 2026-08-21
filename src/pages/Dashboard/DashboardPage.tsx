import {Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { Panel, ProgressRing, SectionTitle, StatCard } from "@/components/ui-kit";
import { activities, courses } from "@/demo/compatibility";
import { useProfile } from "@/lib/profile";


export function DashboardPage() {
  const { firstName } = useProfile();
  const ongoing = courses.filter((course) => course.status === "Em andamento").slice(0, 3);

  const toneRing = {
    primary: "bg-primary/12 text-primary-light",
    purple: "bg-purple/12 text-purple-light",
    success: "bg-success/12 text-success",
  } as const;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Olá, {firstName}!</h1>
        <p className="text-sm text-muted-foreground">
          Este é o resumo da sua jornada no Projeto Social.
        </p>
      </div>

      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/18 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 right-24 size-56 rounded-full bg-purple/14 blur-3xl"
        />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light">
              <Sparkles className="size-3.5" strokeWidth={1.75} />
              Jornada em andamento
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Continue aprendendo</h2>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-base">
                Você está evoluindo bem. Retome de onde parou e siga sua trilha.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary-light"
              >
                Continuar estudando
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
              <Link
                to="/atividades"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                Ver atividades
              </Link>
            </div>
          </div>
          <div className="justify-self-center lg:justify-self-end">
            <ProgressRing value={Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(courses.length, 1))} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckCircle} value={String(courses.reduce((sum, course) => sum + course.completedLessons, 0))} label="Aulas concluídas" tone="primary" />
        <StatCard icon={BookOpen} value={String(ongoing.length)} label="Cursos em andamento" tone="primary" />
        <StatCard icon={ClipboardCheck} value={String(activities.length)} label="Atividades registradas" tone="success" />
        <StatCard icon={TrendingUp} value={`${Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / Math.max(courses.length, 1))}%`} label="Progresso geral" tone="purple" />
      </section>

      <section>
        <SectionTitle
          title="Meus cursos em andamento"
          subtitle="Retome de onde parou"
          action={
            <Link
              to="/cursos"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-light hover:underline"
            >
              Ver tudo <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ongoing.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Atividades recentes"
          subtitle="Seus últimos passos na plataforma"
          action={
            <Link
              to="/atividades"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-light hover:underline"
            >
              Ver tudo <ArrowRight className="size-4" />
            </Link>
          }
        />
        <Panel className="divide-y divide-border p-0">
          {activities.slice(0, 4).map((activity) => (
            <div
              key={activity.label}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
            >
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${toneRing[activity.tone]}`}>
                <activity.icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <p className="min-w-0 truncate text-sm font-medium">{activity.label}</p>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                <span className="hidden sm:inline">{activity.time}</span>
              </span>
            </div>
          ))}
        </Panel>
      </section>
    </div>
  );
}
