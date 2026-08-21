import {
  Award,
  Bell,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  HelpCircle,
  Home,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; to: string; icon: LucideIcon };

/** Menu da sidebar — "Perfil" fica apenas no menu do usuário (header). */
export const navItems: NavItem[] = [
  { label: "Início", to: "/", icon: Home },
  { label: "Meus Cursos", to: "/cursos", icon: GraduationCap },
  { label: "Certificados", to: "/certificados", icon: Award },
  { label: "Atividades", to: "/atividades", icon: ClipboardCheck },
  { label: "Eventos", to: "/eventos", icon: Calendar },
  { label: "Notificações", to: "/notificacoes", icon: Bell },
  { label: "Ajuda / FAQ", to: "/ajuda", icon: HelpCircle },
  { label: "Configurações", to: "/configuracoes", icon: Settings },
];

/** Itens exibidos no menu inferior do mobile. */
export const bottomNavPaths = ["/", "/cursos", "/atividades", "/eventos", "/notificacoes"];
