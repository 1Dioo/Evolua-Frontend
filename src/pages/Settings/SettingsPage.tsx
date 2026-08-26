import {Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Eye, Globe, Lock, LogOut, Mail, Moon, Shield, Sun, User } from "lucide-react";
import { toast } from "sonner";
import { Panel, SectionTitle } from "@/components/ui-kit";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useProfile } from "@/lib/profile";


function Row({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary-light">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="col-span-2 sm:col-span-1">{children}</div>
    </div>
  );
}

function Toggle({ defaultOn = true, label }: { defaultOn?: boolean; label: string }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <label className="mt-3 inline-flex cursor-pointer items-center sm:mt-0">
      <input
        type="checkbox"
        checked={on}
        aria-label={label}
        onChange={(e) => {
          setOn(e.target.checked);
          toast.success(`${label}: ${e.target.checked ? "ativado" : "desativado"}.`);
        }}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-surface-2 ring-1 ring-border transition-colors peer-checked:bg-primary after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-muted-foreground after:transition-all peer-checked:after:left-6 peer-checked:after:bg-primary-foreground" />
    </label>
  );
}

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize sua experiência na plataforma.
        </p>
      </div>

      <section>
        <SectionTitle title="Conta" />
        <Panel className="divide-y divide-border p-0">
          <Row icon={User} title="Nome" description={profile.name}>
            <Link
              to="/perfil"
              className="mt-3 inline-flex rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary-light sm:mt-0"
            >
              Editar
            </Link>
          </Row>
          <Row icon={Mail} title="E-mail" description={profile.email}>
            <Link
              to="/perfil"
              className="mt-3 inline-flex rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary-light sm:mt-0"
            >
              Editar
            </Link>
          </Row>
          <Row icon={Lock} title="Alterar senha" description="Atualize sua senha de acesso na página de perfil.">
            <Link
              to="/perfil"
              className="mt-3 inline-flex rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary-light sm:mt-0"
            >
              Alterar
            </Link>
          </Row>
        </Panel>
      </section>

      <section>
        <SectionTitle title="Aparência" />
        <Panel className="p-0">
          <Row
            icon={theme === "dark" ? Moon : Sun}
            title="Tema da interface"
            description="Escolha entre tema escuro e claro. A preferência fica salva neste dispositivo."
          >
            <div className="mt-3 inline-flex rounded-xl border border-border p-1 sm:mt-0">
              <button
                type="button"
                onClick={() => theme !== "dark" && toggleTheme()}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Moon className="size-3.5" /> Escuro
              </button>
              <button
                type="button"
                onClick={() => theme !== "light" && toggleTheme()}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Sun className="size-3.5" /> Claro
              </button>
            </div>
          </Row>
        </Panel>
      </section>

      <section>
        <SectionTitle title="Notificações" />
        <Panel className="divide-y divide-border p-0">
          <Row icon={Bell} title="Notificações de atividades" description="Avisos de atividades pendentes e correções.">
            <Toggle label="Notificações de atividades" />
          </Row>
          <Row icon={Bell} title="Notificações de cursos" description="Novas aulas e conteúdos publicados.">
            <Toggle label="Notificações de cursos" />
          </Row>
          <Row icon={Bell} title="Notificações de eventos" description="Lembretes das oficinas presenciais e online.">
            <Toggle label="Notificações de eventos" />
          </Row>
          <Row icon={Bell} title="Notificações de certificados" description="Aviso quando um certificado for liberado.">
            <Toggle defaultOn={false} label="Notificações de certificados" />
          </Row>
        </Panel>
      </section>

      <section>
        <SectionTitle title="Privacidade" />
        <Panel className="divide-y divide-border p-0">
          <Row icon={Eye} title="Perfil visível para a turma" description="Outros alunos podem ver seu nome e progresso.">
            <Toggle defaultOn={false} label="Perfil visível para a turma" />
          </Row>
          <Row icon={Shield} title="Compartilhar dados de uso" description="Ajuda a melhorar os conteúdos da plataforma.">
            <Toggle label="Compartilhar dados de uso" />
          </Row>
          <Row icon={Globe} title="Idioma" description="Português (Brasil)">
            <button
              type="button"
              onClick={() => toast.success("Idioma mantido em Português (Brasil).")}
              className="mt-3 rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary-light sm:mt-0"
            >
              Alterar
            </button>
          </Row>
        </Panel>
      </section>

      <section>
        <SectionTitle title="Sessão" />
        <Panel className="p-0">
          <Row icon={LogOut} title="Sair da conta" description="Encerrar a sessão neste dispositivo.">
            <button
              type="button"
              onClick={async () => {
                try {
                  await logout();

                  toast.success("Sessão encerrada.");

                  await navigate({
                    to: "/login",
                    replace: true,
                  });
                } catch {
                  toast.error("Não foi possível encerrar a sessão.");
                }
              }}
              className="mt-3 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive sm:mt-0"
            >
              Sair
            </button>
          </Row>
        </Panel>
      </section>
    </div>
  );
}