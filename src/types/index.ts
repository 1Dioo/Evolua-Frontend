/**
 * Tipos compartilhados entre frontend e a futura API (MariaDB dos colegas).
 * Os nomes dos campos seguem o formato camelCase esperado pelo frontend.
 * A conversão de snake_case (banco) para camelCase acontece nos services do backend.
 */

export type Id = number;

export interface User {
  id: Id;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "aluno" | "professor" | "admin";
  turma?: string;
  joinedAt?: string;
}

export type CourseStatus = "Em andamento" | "Concluído" | "Disponível";

export type LessonStatus = "concluida" | "em-andamento" | "bloqueada";

export interface Lesson {
  id: Id;
  courseId: Id;
  moduleId: Id;
  title: string;
  description: string;
  /** Conteúdo textual da aula (pode vir em markdown/HTML do backend). */
  content: string;
  /** URL do vídeo real — vem do backend, nunca fixa no componente. */
  videoUrl: string | null;
  thumbnailUrl: string | null;
  /** Duração em minutos. */
  duration: number;
  /** Ordem da aula dentro do módulo. */
  order: number;
  status: LessonStatus;
  materials?: LessonMaterial[];
  activity?: LessonActivity;
}

export interface LessonMaterial {
  label: string;
  url: string;
  type: "pdf" | "link" | "slide";
}

export interface LessonActivity {
  title: string;
  description: string;
}

export interface Module {
  id: Id;
  courseId: Id;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: Id;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: CourseStatus;
  /** 0 a 100 */
  progress: number;
  totalLessons: number;
  completedLessons: number;
  hours: string;
  iconName: string;
  modules?: Module[];
}

/** Payloads de administração (professor/admin) para aulas. */
export interface LessonInput {
  courseId: Id;
  moduleId: Id;
  title: string;
  description: string;
  content: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  duration?: number;
  order?: number;
}

export interface LessonVideoInput {
  videoUrl: string;
  thumbnailUrl?: string | null;
  duration?: number;
}

export type TaskStatus = "Pendente" | "Em andamento" | "Concluída";

export interface Task {
  id: Id;
  title: string;
  course: string;
  type: "Atividade" | "Questionário" | "Exercício" | "Quiz";
  date: string;
  status: TaskStatus;
  score?: string;
  iconName: string;
}

export interface Activity {
  id: Id;
  label: string;
  time: string;
  tone: "primary" | "purple" | "success";
  iconName: string;
}

export interface Certificate {
  id: Id;
  title: string;
  status: "Disponível" | "Em andamento";
  hours: string;
  issued?: string;
  code?: string;
  progress: number;
  iconName: string;
}

export interface Event {
  id: Id;
  title: string;
  description: string;
  date: string;
  day: number;
  month: string;
  hour: string;
  place: string;
  status: "Inscrições abertas" | "Confirmado" | "Realizado";
  when: "upcoming" | "past";
  iconName: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  read: boolean;
}

export interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

/** Envelope padrão das respostas da API. */
export interface ApiResponse<T> {
  data: T;
}
