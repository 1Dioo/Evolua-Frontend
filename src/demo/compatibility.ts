/**
 * Adaptador temporário para a interface.
 *
 * Os dados de `src/demo` possuem o mesmo formato esperado pelos serviços da API,
 * mas ainda são usados somente para validar o frontend antes da integração.
 */
import type { LucideIcon } from "lucide-react";
import {
  activities as activitiesData,
  categories as categoriesData,
  certificates as certificatesData,
  courses as coursesData,
  events as eventsData,
  faq as faqData,
  faqCategories as faqCategoriesData,
  tasks as tasksData,
} from "@/demo";
import { resolveIcon } from "@/utils/icons";
import type { CourseStatus, TaskStatus } from "@/types";

const withIcon = <T extends { iconName: string }>(item: T): T & { icon: LucideIcon } => ({
  ...item,
  icon: resolveIcon(item.iconName),
});

export const categories = categoriesData;
export type Category = (typeof categoriesData)[number];
export type { CourseStatus, TaskStatus };

/** Cursos no formato legado (lessons/done) + campos novos (slug, modules). */
export const courses = coursesData.map((course) => ({
  ...withIcon(course),
  lessons: course.totalLessons,
  done: course.completedLessons,
}));

export type Course = (typeof courses)[number];

export const tasks = tasksData.map(withIcon);
export type Task = (typeof tasks)[number];

export const activities = activitiesData.map(withIcon);
export type Activity = (typeof activities)[number];

export const events = eventsData.map(withIcon);
export type Event = (typeof events)[number];

export const certificates = certificatesData.map(withIcon);
export type Certificate = (typeof certificates)[number];

export const faqCategories = faqCategoriesData;
export type FaqCategory = (typeof faqCategoriesData)[number];
export const faq = faqData;
