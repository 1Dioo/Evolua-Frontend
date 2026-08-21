import type { Task } from "@/types";

export const tasks: Task[] = [
  { id: 1, title: "Atividade de Hardware", course: "Hardware", type: "Atividade", date: "18 Ago 2026", status: "Pendente", iconName: "Cpu" },
  { id: 2, title: "Questionário de Software", course: "Software", type: "Questionário", date: "16 Ago 2026", status: "Em andamento", iconName: "BookOpen" },
  { id: 3, title: "Exercício de Excel", course: "Excel", type: "Exercício", date: "14 Ago 2026", status: "Concluída", score: "9,0", iconName: "FileSpreadsheet" },
  { id: 4, title: "Quiz de Segurança Digital", course: "Segurança Digital", type: "Quiz", date: "12 Ago 2026", status: "Pendente", iconName: "ShieldCheck" },
  { id: 5, title: "Atividade de Internet e Navegação", course: "Internet e Navegação", type: "Atividade", date: "08 Ago 2026", status: "Concluída", score: "10,0", iconName: "Globe" },
  { id: 6, title: "Questionário de Informática Básica", course: "Informática Básica", type: "Questionário", date: "02 Ago 2026", status: "Concluída", score: "8,5", iconName: "Monitor" },
];
