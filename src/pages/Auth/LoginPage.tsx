const fieldClass =
  "w-full rounded-xl border border-input bg-surface-2/60 px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/10";

import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      toast.success("Login realizado com sucesso.");
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Bem-vindo de volta"
      description="Entre na sua conta para continuar seus cursos e acompanhar seu progresso."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={Mail} label="E-mail">
          <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="seu@email.com" />
        </Field>
        <Field icon={LockKeyhole} label="Senha">
          <input className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="Sua senha" />
        </Field>
        {error ? <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">{error}</p> : null}
        <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Entrando..." : "Entrar"} <ArrowRight className="size-4" />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não possui uma conta?{" "}
        <Link to="/cadastro" className="font-semibold text-primary-light hover:underline">Criar cadastro</Link>
      </p>
    </AuthShell>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Icon className="size-3.5" />{label}</span>{children}</label>;
}

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"><span className="text-lg font-bold">D</span></span>
              <span className="font-display text-xl font-bold">Projeto Social</span>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">Plataforma educacional</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight">Aprender tecnologia ficou mais simples.</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">Acompanhe cursos, aulas, atividades, eventos e certificados em um único lugar.</p>
          </div>
        </section>
        <section className="w-full">
          <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
            <div className="mb-7 lg:hidden"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">D</span><span className="font-display text-lg font-bold">Projeto Social</span></div></div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
