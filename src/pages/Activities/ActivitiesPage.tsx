import { useMemo, useState } from "react";
import { CheckCircle, ClipboardCheck, Clock, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { IconBadge, Panel, ProgressBar, SectionTitle, StatCard } from "@/components/ui-kit";
import { tasks, type TaskStatus } from "@/demo/compatibility";


const filters: ("Todas" | TaskStatus)[] = ["Todas", "Pendente", "Concluída", "Em andamento"];
const filterLabels: Record<string, string> = {
  Todas: "Todas",
  Pendente: "Pendentes",
  Concluída: "Concluídas",
  "Em andamento": "Em andamento",
};

export function ActivitiesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");

  const list = useMemo(
    () => (filter === "Todas" ? tasks : tasks.filter((task) => task.status === filter)),
    [filter],
  );

  const done = tasks.filter((t) => t.status === "Concluída").length;
  const pending = tasks.filter((t) => t.status === "Pendente").length;
  const ongoing = tasks.filter((t) => t.status === "Em andamento").length;
  const percent = Math.round((done / tasks.length) * 100);

  const tone = (status: TaskStatus) =>
    status === "Concluída"
      ? "bg-success/12 text-success"
      : status === "Em andamento"
        ? "bg-primary/12 text-primary-light"
        : "bg-warning/12 text-warning";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Minhas Atividades</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exercícios, questionários e quizzes dos seus cursos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CheckCircle} value={String(done)} label="Concluídas" tone="success" />
        <StatCard icon={Clock} value={String(pending)} label="Pendentes" tone="primary" />
        <StatCard icon={ClipboardCheck} value={String(ongoing)} label="Em andamento" tone="purple" />
      </div>

      <Panel className="space-y-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <p className="min-w-0 truncate text-sm font-medium">Progresso das atividades</p>
          <span className="shrink-0 text-xs font-semibold text-primary-light">{percent}%</span>
        </div>
        <ProgressBar value={percent} />
        <p className="text-xs text-muted-foreground">
          {done} de {tasks.length} atividades concluídas.
        </p>
      </Panel>

      <section>
        <SectionTitle title="Atividades" subtitle="Filtre por situação" />
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === item
                  ? "border-primary/40 bg-primary/12 text-primary-light"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {filterLabels[item]}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <Panel className="py-12 text-center">
            <p className="text-sm font-medium">Nenhuma atividade nesta categoria</p>
            <p className="mt-1 text-sm text-muted-foreground">Escolha outro filtro para ver mais.</p>
          </Panel>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {list.map((task) => (
              <Panel key={task.title} hover className="space-y-4">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <IconBadge icon={task.icon} tone="primary" />
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">{task.title}</h2>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {task.course} • {task.type}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${tone(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {task.date}
                  </span>
                  {task.score ? (
                    <span className="flex items-center gap-1.5 text-success">
                      <CheckCircle className="size-3.5" /> Nota {task.score}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => toast.success(`Abrindo “${task.title}”.`)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary hover:text-primary-foreground"
                >
                  <PlayCircle className="size-4" strokeWidth={1.75} /> Continuar
                </button>
              </Panel>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
