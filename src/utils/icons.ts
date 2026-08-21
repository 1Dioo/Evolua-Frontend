import {
  Award,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Cpu,
  FileSpreadsheet,
  Globe,
  Monitor,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Mapa nome → ícone: permite que o backend envie apenas uma string. */
const registry: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Cpu,
  FileSpreadsheet,
  Globe,
  Monitor,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
};

export function resolveIcon(name: string | undefined): LucideIcon {
  return (name && registry[name]) || BookOpen;
}
