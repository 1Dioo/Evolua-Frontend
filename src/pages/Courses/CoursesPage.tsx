import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle, PlayCircle, Search, TrendingUp } from "lucide-react";
import { IconBadge, Panel, ProgressBar, SectionTitle, StatCard } from "@/components/ui-kit";
import { categories, courses, type Course, type CourseStatus } from "@/demo/compatibility";



const statuses: (CourseStatus | "Todos")[] = ["Todos", "Em andamento", "Concluído", "Disponível"];
const sorts = [
  { value: "progress-desc", label: "Maior progresso" },
  { value: "progress-asc", label: "Menor progresso" },
  { value: "name", label: "Nome (A–Z)" },
] as const;

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
    active
      ? "border-primary/40 bg-primary/12 text-primary-light"
      : "border-border text-muted-foreground hover:text-foreground"
  }`;

export function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todas");
  const [status, setStatus] = useState<(typeof statuses)[number]>("Todos");
  const [sort, setSort] = useState<(typeof sorts)[number]["value"]>("progress-desc");

  const filtered = useMemo(() => {
    const list = courses.filter((course) => {
      const matchesQuery =
        course.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        course.description.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = category === "Todas" || course.category === category;
      const matchesStatus = status === "Todos" || course.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });

    return [...list].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "progress-asc") return a.progress - b.progress;
      return b.progress - a.progress;
    });
  }, [query, category, status, sort]);

  const groups: { label: string; status: CourseStatus }[] = [
    { label: "Em andamento", status: "Em andamento" },
    { label: "Concluídos", status: "Concluído" },
    { label: "Disponíveis", status: "Disponível" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Meus Cursos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Continue sua jornada de aprendizado.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} value={String(courses.length)} label="Cursos matriculados" tone="primary" />
        <StatCard
          icon={CheckCircle}
          value={String(courses.filter((c) => c.status === "Concluído").length)}
          label="Cursos concluídos"
          tone="success"
        />
        <StatCard
          icon={TrendingUp}
          value={`${Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length)}%`}
          label="Progresso médio"
          tone="purple"
        />
      </div>

      <Panel className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <label className="flex min-w-0 items-center gap-2 rounded-xl border border-input bg-surface-2/60 px-3 py-2.5">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar um curso..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-xl border border-input bg-surface-2/60 px-3 py-2.5 text-sm outline-none"
            aria-label="Ordenar cursos"
          >
            {sorts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Categoria
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCategory("Todas")} className={chip(category === "Todas")}>
              Todas
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={chip(category === item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button key={item} type="button" onClick={() => setStatus(item)} className={chip(status === item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <Panel className="py-12 text-center">
          <p className="text-sm font-medium">Nenhum curso encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">Tente outra pesquisa ou remova os filtros.</p>
        </Panel>
      ) : (
        groups.map((group) => {
          const list = filtered.filter((c) => c.status === group.status);
          if (list.length === 0) return null;
          return (
            <section key={group.status}>
              <SectionTitle title={group.label} subtitle={`${list.length} curso(s)`} />
              <div className="grid gap-4 lg:grid-cols-2">
                {list.map((course) => (
                  <BigCourseCard key={course.title} course={course} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function BigCourseCard({ course }: { course: Course }) {
  const tone =
    course.status === "Concluído"
      ? "bg-success/12 text-success"
      : course.status === "Em andamento"
        ? "bg-primary/12 text-primary-light"
        : "bg-muted text-muted-foreground";

  return (
    <Panel hover className="flex flex-col gap-4 p-6">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <IconBadge icon={course.icon} tone="primary" className="size-12" />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{course.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${tone}`}>{course.status}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border px-3 py-1">{course.category}</span>
        <span className="rounded-full border border-border px-3 py-1">{course.lessons} aulas</span>
        <span className="rounded-full border border-border px-3 py-1">
          {course.done} concluídas
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {course.done} de {course.lessons} aulas
          </span>
          <span className="font-semibold text-primary-light">{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} />
      </div>

      <Link
        to="/cursos/$courseSlug"
        params={{ courseSlug: course.slug }}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary hover:text-primary-foreground"
      >
        <PlayCircle className="size-4" strokeWidth={1.75} />
        {course.progress > 0 ? "Continuar curso" : "Acessar curso"}
        <ArrowRight className="size-4" strokeWidth={1.75} />
      </Link>

    </Panel>
  );
}
