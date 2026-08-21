import type { Course, Lesson, Module } from "@/types";

/**
 * Mock de cursos, módulos e aulas.
 * Substituir por chamadas reais ao backend (ver src/services/courseService.ts).
 * Nenhum vídeo real está fixo aqui: `videoUrl` chega do backend/MariaDB.
 */

type LessonSeed = {
  title: string;
  description: string;
  content: string;
  duration: number;
  status: Lesson["status"];
};

type ModuleSeed = { title: string; lessons: LessonSeed[] };

type CourseSeed = Omit<Course, "progress" | "totalLessons" | "completedLessons" | "modules"> & {
  moduleSeeds: ModuleSeed[];
};

const lorem =
  "Nesta aula você acompanha uma explicação passo a passo, com exemplos práticos que podem ser repetidos em casa ou no laboratório da escola.";

const courseSeeds: CourseSeed[] = [
  {
    id: 1,
    slug: "informatica-basica",
    title: "Informática Básica",
    description: "Primeiros passos com o computador e o sistema operacional.",
    category: "Informática Básica",
    status: "Concluído",
    hours: "20h",
    iconName: "Monitor",
    moduleSeeds: [
      {
        title: "Introdução à Informática",
        lessons: [
          { title: "O que é um computador", description: "Conceitos iniciais e tipos de computador.", content: lorem, duration: 8, status: "concluida" },
          { title: "Ligando e desligando com segurança", description: "Boas práticas no uso do equipamento.", content: lorem, duration: 6, status: "concluida" },
        ],
      },
      {
        title: "Sistema operacional",
        lessons: [
          { title: "Área de trabalho e janelas", description: "Navegando pelo sistema.", content: lorem, duration: 10, status: "concluida" },
          { title: "Arquivos e pastas", description: "Como organizar seus documentos.", content: lorem, duration: 12, status: "concluida" },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "internet-e-navegacao",
    title: "Internet e Navegação",
    description: "Buscas, e-mail, serviços públicos digitais e redes.",
    category: "Internet",
    status: "Concluído",
    hours: "12h",
    iconName: "Globe",
    moduleSeeds: [
      {
        title: "Navegando na web",
        lessons: [
          { title: "Navegadores e sites", description: "Como abrir e pesquisar sites.", content: lorem, duration: 9, status: "concluida" },
          { title: "Pesquisas eficientes", description: "Buscando informação confiável.", content: lorem, duration: 8, status: "concluida" },
        ],
      },
      {
        title: "Serviços digitais",
        lessons: [
          { title: "Criando e usando e-mail", description: "Enviar, receber e anexar arquivos.", content: lorem, duration: 11, status: "concluida" },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "hardware",
    title: "Hardware",
    description: "Componentes físicos, montagem e manutenção preventiva.",
    category: "Hardware",
    status: "Em andamento",
    hours: "18h",
    iconName: "Cpu",
    moduleSeeds: [
      {
        title: "Introdução ao hardware",
        lessons: [
          { title: "Peças de um computador", description: "Gabinete, placa-mãe e periféricos.", content: lorem, duration: 10, status: "concluida" },
          { title: "Processador e memória", description: "Como o computador processa dados.", content: lorem, duration: 12, status: "concluida" },
        ],
      },
      {
        title: "Montagem e manutenção",
        lessons: [
          { title: "Montando passo a passo", description: "Encaixes, cabos e cuidados.", content: lorem, duration: 15, status: "em-andamento" },
          { title: "Limpeza preventiva", description: "Rotina de manutenção segura.", content: lorem, duration: 9, status: "bloqueada" },
        ],
      },
      {
        title: "Diagnóstico",
        lessons: [
          { title: "Identificando problemas comuns", description: "Testes simples de diagnóstico.", content: lorem, duration: 13, status: "bloqueada" },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "excel",
    title: "Excel",
    description: "Planilhas, fórmulas essenciais e organização de dados.",
    category: "Excel",
    status: "Em andamento",
    hours: "16h",
    iconName: "FileSpreadsheet",
    moduleSeeds: [
      {
        title: "Primeiros passos",
        lessons: [
          { title: "Células, linhas e colunas", description: "Estrutura de uma planilha.", content: lorem, duration: 8, status: "concluida" },
          { title: "Formatando dados", description: "Deixando a planilha legível.", content: lorem, duration: 9, status: "concluida" },
        ],
      },
      {
        title: "Fórmulas",
        lessons: [
          { title: "Soma, média e contagem", description: "As fórmulas do dia a dia.", content: lorem, duration: 12, status: "em-andamento" },
          { title: "Gráficos simples", description: "Visualizando resultados.", content: lorem, duration: 10, status: "bloqueada" },
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "software",
    title: "Software",
    description: "Programas, instalação, atualizações e boas práticas.",
    category: "Software",
    status: "Em andamento",
    hours: "14h",
    iconName: "BookOpen",
    moduleSeeds: [
      {
        title: "Programas essenciais",
        lessons: [
          { title: "Tipos de software", description: "Sistema, aplicativos e utilitários.", content: lorem, duration: 8, status: "concluida" },
          { title: "Instalando com segurança", description: "Fontes confiáveis e permissões.", content: lorem, duration: 11, status: "em-andamento" },
        ],
      },
      {
        title: "Manutenção de software",
        lessons: [
          { title: "Atualizações e backups", description: "Mantendo o sistema saudável.", content: lorem, duration: 10, status: "bloqueada" },
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "seguranca-digital",
    title: "Segurança Digital",
    description: "Senhas fortes, golpes online e proteção de dados.",
    category: "Segurança Digital",
    status: "Disponível",
    hours: "10h",
    iconName: "ShieldCheck",
    moduleSeeds: [
      {
        title: "Protegendo suas contas",
        lessons: [
          { title: "Senhas fortes", description: "Como criar e guardar senhas.", content: lorem, duration: 8, status: "bloqueada" },
          { title: "Verificação em duas etapas", description: "Uma camada extra de proteção.", content: lorem, duration: 7, status: "bloqueada" },
        ],
      },
      {
        title: "Golpes online",
        lessons: [
          { title: "Reconhecendo golpes", description: "Mensagens e links suspeitos.", content: lorem, duration: 9, status: "bloqueada" },
        ],
      },
    ],
  },
];

function buildModules(seed: CourseSeed): Module[] {
  let lessonId = seed.id * 100;
  return seed.moduleSeeds.map((moduleSeed, moduleIndex) => {
    const moduleId = seed.id * 10 + moduleIndex + 1;
    return {
      id: moduleId,
      courseId: seed.id,
      title: moduleSeed.title,
      order: moduleIndex + 1,
      lessons: moduleSeed.lessons.map((lesson, lessonIndex) => {
        lessonId += 1;
        return {
          id: lessonId,
          courseId: seed.id,
          moduleId,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          videoUrl: null,
          thumbnailUrl: null,
          duration: lesson.duration,
          order: lessonIndex + 1,
          status: lesson.status,
          materials: [
            { label: "Resumo da aula (PDF)", url: "#", type: "pdf" },
            { label: "Material complementar", url: "#", type: "link" },
          ],
          activity: {
            title: `Atividade — ${lesson.title}`,
            description: "Pratique o conteúdo da aula e envie sua resposta para o monitor.",
          },
        } satisfies Lesson;
      }),
    };
  });
}

export const courses: Course[] = courseSeeds.map((seed) => {
  const modules = buildModules(seed);
  const lessons = modules.flatMap((moduleItem) => moduleItem.lessons);
  const completed = lessons.filter((lesson) => lesson.status === "concluida").length;
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    category: seed.category,
    status: seed.status,
    hours: seed.hours,
    iconName: seed.iconName,
    totalLessons: lessons.length,
    completedLessons: completed,
    progress: Math.round((completed / lessons.length) * 100),
    modules,
  };
});

export const categories = [
  "Informática Básica",
  "Hardware",
  "Software",
  "Excel",
  "Segurança Digital",
  "Internet",
] as const;

export function findCourse(idOrSlug: string | number): Course | undefined {
  const value = String(idOrSlug);
  return courses.find((course) => course.slug === value || String(course.id) === value);
}

export function courseLessons(course: Course): Lesson[] {
  return (course.modules ?? []).flatMap((moduleItem) => moduleItem.lessons);
}

export function findLesson(lessonId: string | number) {
  for (const course of courses) {
    for (const moduleItem of course.modules ?? []) {
      const lesson = moduleItem.lessons.find((item) => String(item.id) === String(lessonId));
      if (lesson) return { course, module: moduleItem, lesson };
    }
  }
  return undefined;
}
