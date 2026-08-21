import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  hover = false,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "panel p-5",
        hover && "hover:-translate-y-0.5 hover:border-primary/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold sm:text-xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function IconBadge({
  icon: Icon,
  tone = "primary",
  className,
}: {
  icon: LucideIcon;
  tone?: "primary" | "purple" | "success" | "muted";
  className?: string;
}) {
  const tones = {
    primary: "bg-primary/12 text-primary-light ring-primary/25",
    purple: "bg-purple/12 text-purple-light ring-purple/25",
    success: "bg-success/12 text-success ring-success/25",
    muted: "bg-muted text-muted-foreground ring-border",
  } as const;

  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl ring-1",
        tones[tone],
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "purple" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2 dark:bg-white/8">
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          tone === "primary"
            ? "bg-gradient-to-r from-primary to-primary-light"
            : "bg-gradient-to-r from-purple to-purple-light",
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 168,
  label = "Progresso geral",
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-6 rounded-full bg-primary/18 blur-2xl"
        aria-hidden="true"
      />
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-2 dark:stroke-white/8"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="70%" stopColor="var(--primary-light)" />
            <stop offset="100%" stopColor="var(--purple-light)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold tracking-tight">{value}%</span>
        <span className="mt-1 text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export function StatCard({
  icon,
  value,
  label,
  hint,
  tone = "primary",
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  hint?: string;
  tone?: "primary" | "purple" | "success";
}) {
  return (
    <Panel hover className="flex flex-col gap-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <IconBadge icon={icon} tone={tone} />
        <p className="min-w-0 truncate text-sm text-muted-foreground">{label}</p>
      </div>
      <div>
        <p className="font-display text-3xl font-bold leading-none">{value}</p>
        {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </Panel>
  );
}
