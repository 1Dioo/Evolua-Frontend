import type { FaqItem } from "@/types";

export const faqCategories = [
  "Conta",
  "Cursos",
  "Atividades",
  "Certificados",
  "Eventos",
  "Plataforma",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export const faq: FaqItem[] = [
  {
    category: "Conta",
    question: "Como faço para alterar meus dados?",
    answer:
      "Abra o menu do usuário no canto superior direito, clique em “Meu perfil”, depois em “Editar perfil”, atualize seu nome ou e-mail e salve. As informações são atualizadas na hora em todo o sistema.",
  },
  {
    category: "Conta",
    question: "Como altero minha senha?",
    answer:
      "Em “Meu perfil”, seção Segurança, informe a senha atual, a nova senha e a confirmação. Depois clique em “Atualizar senha”.",
  },
  {
    category: "Cursos",
    question: "Como faço para continuar um curso?",
    answer:
      "Em Meus Cursos, clique no card do curso para abrir a página dele e use o botão “Continuar aula”. Você volta exatamente para a próxima aula.",
  },
  {
    category: "Cursos",
    question: "Como vejo meu progresso?",
    answer:
      "A página Início mostra o progresso geral, e cada curso exibe a barra de progresso com as aulas concluídas — também dentro da página do curso e da aula.",
  },
  {
    category: "Atividades",
    question: "Como faço uma atividade?",
    answer:
      "Abra a página Atividades, filtre por “Pendentes” e clique em “Continuar” na atividade desejada para responder.",
  },
  {
    category: "Certificados",
    question: "Quando recebo meu certificado?",
    answer:
      "O certificado fica disponível quando você conclui 100% das aulas e atividades obrigatórias do curso.",
  },
  {
    category: "Eventos",
    question: "Como participo de um evento?",
    answer:
      "Na página Eventos, escolha um evento em “Próximos eventos” e clique em “Ver detalhes” para confirmar presença.",
  },
  {
    category: "Plataforma",
    question: "Como altero o tema da plataforma?",
    answer:
      "Use o botão de tema na barra superior ou na sidebar, ou vá em Configurações › Aparência. Sua escolha fica salva neste dispositivo.",
  },
];
