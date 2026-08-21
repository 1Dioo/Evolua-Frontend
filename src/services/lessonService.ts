import { api } from "./api";
import type { Id, Lesson, LessonInput, LessonVideoInput } from "@/types";

/**
 * Aulas e vídeos.
 * As rotas de escrita (POST/PUT/DELETE) existem para o futuro painel do
 * professor/administrador cadastrar aulas e vídeos no banco MariaDB.
 */
export const lessonService = {
  getById: (id: Id | string) => api.get<Lesson>(`/aulas/${id}`),
  create: (input: LessonInput) => api.post<Lesson>("/aulas", input),
  update: (id: Id | string, input: Partial<LessonInput>) => api.put<Lesson>(`/aulas/${id}`, input),
  remove: (id: Id | string) => api.delete<{ id: Id }>(`/aulas/${id}`),
  /** Cadastra ou troca o vídeo da aula (video_url, thumbnail e duração). */
  setVideo: (id: Id | string, input: LessonVideoInput) =>
    api.post<Lesson>(`/aulas/${id}/video`, input),
};
