const fieldClass =
  "w-full rounded-xl border border-input bg-surface-2/60 px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/10";

import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "./LoginPage";
import { useAuth } from "@/lib/auth";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("Diogo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 3) return setError("Informe seu nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Informe um e-mail válido.");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirmation) return setError("As senhas não coincidem.");

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      toast.success("Cadastro realizado com sucesso.");
      await navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Criar sua conta" description="Cadastre seus dados para acessar a plataforma educacional.">
      <form onSubmit={submit} className="space-y-4">
        <Field icon={UserRound} label="Nome completo"><input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Seu nome completo" /></Field>
        <Field icon={Mail} label="E-mail"><input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="seu@email.com" /></Field>
        <Field icon={LockKeyhole} label="Senha"><input className={fieldClass} value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres" /></Field>
        <Field icon={LockKeyhole} label="Confirmar senha"><input className={fieldClass} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} type="password" autoComplete="new-password" placeholder="Repita sua senha" /></Field>
        {error ? <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">{error}</p> : null}
        <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Criando..." : "Criar cadastro"} <ArrowRight className="size-4" /></button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Já possui uma conta? <Link to="/login" className="font-semibold text-primary-light hover:underline">Entrar</Link></p>
    </AuthShell>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Icon className="size-3.5" />{label}</span>{children}</label>;
}
