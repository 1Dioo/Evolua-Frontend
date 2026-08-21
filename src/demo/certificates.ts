import type { Certificate } from "@/types";

export const certificates: Certificate[] = [
  { id: 1, title: "Informática Básica", status: "Disponível", hours: "20h", issued: "09 Ago 2026", code: "PS-2026-INF-0142", progress: 100, iconName: "Monitor" },
  { id: 2, title: "Internet e Navegação", status: "Disponível", hours: "12h", issued: "28 Jul 2026", code: "PS-2026-NET-0098", progress: 100, iconName: "Globe" },
  { id: 3, title: "Excel", status: "Em andamento", hours: "16h", progress: 65, iconName: "FileSpreadsheet" },
  { id: 4, title: "Hardware", status: "Em andamento", hours: "18h", progress: 45, iconName: "Cpu" },
  { id: 5, title: "Software", status: "Em andamento", hours: "14h", progress: 30, iconName: "BookOpen" },
];
