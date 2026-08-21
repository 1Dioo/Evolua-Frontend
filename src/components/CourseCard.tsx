import { ArrowRight, PlayCircle } from "lucide-react";
import type { Course } from "@/demo/compatibility";
import { IconBadge, Panel, ProgressBar } from "./ui-kit";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Panel hover className="flex flex-col gap-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <IconBadge icon={course.icon} tone="primary" />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{course.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        </div>
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

      <button
        type="button"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary hover:text-primary-foreground"
      >
        <PlayCircle className="size-4" strokeWidth={1.75} />
        Continuar
        <ArrowRight className="size-4" strokeWidth={1.75} />
      </button>
    </Panel>
  );
}
