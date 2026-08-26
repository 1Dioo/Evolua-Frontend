import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Github } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { AuthShell } from "./AuthShell";

const fieldClass =
    "h-12 w-full rounded-lg border border-white/10 bg-[#101318] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10";

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.41-.18-2.07H12v3.92h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.22Z" />
            <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.75Z" />
            <path fill="#FBBC05" d="M6.54 13.84A5.85 5.85 0 0 1 6.23 12c0-.64.11-1.26.31-1.84V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.52Z" />
            <path fill="#EA4335" d="M12 6.13c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.21 14.63 2.25 12 2.25A9.74 9.74 0 0 0 3.3 7.64l3.24 2.52c.77-2.31 2.92-4.03 5.46-4.03Z" />
        </svg>
    );
}

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
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
            setError(
                err instanceof Error ? err.message : "Não foi possível entrar.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            sideTitle={
                <>
                    Que bom ter <span className="text-[#3565c9]">você</span>
                    <br />
                    de volta!
                </>
            }
            sideDescription="Faça login para continuar aprendendo, ensinando e transformando vidas."
            sideItems={[
                "Acesse suas aulas e materiais",
                "Acompanhe seu progresso",
                "Conecte-se com nossa comunidade",
            ]}
            illustration="/assets/login-illustration.png"
            sidePosition="right"
        >
            <div className="mx-auto w-full max-w-[442px]">
                <div className="mb-12 text-center">
                    <h1 className="bg-gradient-to-r from-[#7420ff] to-[#a000ff] bg-clip-text text-[48px] font-bold leading-none tracking-[0.08em] text-transparent">
                        Entrar
                    </h1>
                    <p className="mt-4 text-sm tracking-wide text-white/70">
                        Acesse sua conta para continuar
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-7">
                    <Field label="E-mail">
                        <input
                            className={fieldClass}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            autoComplete="email"
                            placeholder="Seu@email.com"
                        />
                    </Field>

                    <Field label="Senha">
                        <div className="relative">
                            <input
                                className={`${fieldClass} pr-12`}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Sua senha"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </Field>

                    <div className="flex items-center justify-between gap-4 text-sm">
                        <label className="flex cursor-pointer items-center gap-2 text-white/75">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(event) => setRemember(event.target.checked)}
                                className="size-4 accent-[#2355ff]"
                            />
                            Lembrar de mim
                        </label>

                        <button
                            type="button"
                            onClick={() => toast.info("A recuperação de senha ainda não está disponível.")}
                            className="text-[#8b35ff] transition-colors hover:text-[#b06cff]"
                        >
                            Esqueceu sua senha?
                        </button>
                    </div>

                    {error ? (
                        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                            {error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#203cff] to-[#2449a8] text-lg font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                        {!loading && <ArrowRight className="size-4" />}
                    </button>
                </form>

                <div className="my-9 flex items-center gap-4 text-sm text-white/65">
                    <span className="h-px flex-1 bg-white/20" />
                    <span>ou</span>
                    <span className="h-px flex-1 bg-white/20" />
                </div>

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => toast.info("Login com Google ainda não está configurado.")}
                        className="flex h-12 w-full items-center justify-center gap-4 rounded-lg border border-white/10 bg-[#101318] text-sm text-white/75 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
                    >
                        <GoogleIcon />
                        Entrar com Google
                    </button>

                    <button
                        type="button"
                        onClick={() => toast.info("Login com GitHub ainda não está configurado.")}
                        className="flex h-12 w-full items-center justify-center gap-4 rounded-lg border border-white/10 bg-[#101318] text-sm text-white/75 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
                    >
                        <Github className="size-5" />
                        Entrar com GitHub
                    </button>
                </div>

                <p className="mt-8 text-center text-base text-white/85">
                    Não tem conta?{" "}
                    <Link to="/cadastro" className="font-medium text-[#245cff] hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-semibold text-white">{label}</span>
            {children}
        </label>
    );
}