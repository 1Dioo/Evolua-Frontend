import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { AuthShell } from "./AuthShell";
// termos
const fieldClass =
    "h-12 w-full rounded-lg border border-white/10 bg-[#101318] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/10";

export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");

        if (name.trim().length < 3) {
            setError("Informe seu nome completo.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Informe um e-mail válido.");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmation) {
            setError("As senhas não coincidem.");
            return;
        }

        if (!acceptedTerms) {
            setError("Aceite os termos de uso e a política de privacidade.");
            return;
        }

        setLoading(true);

        try {
            await register(name.trim(), email.trim(), password);
            toast.success("Cadastro realizado com sucesso.");
            await navigate({ to: "/" });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Não foi possível criar a conta.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            sideTitle={
                <>
                    Faça parte dessa
                    <br />
                    <span className="text-[#3565c9]">mudança</span>
                </>
            }
            sideDescription="Crie sua conta e faça parte dessa transformação através da educação."
            sideItems={[
                "Acesso gratuito às aulas",
                "Certificados de conclusão",
                "Comunidade engajada",
            ]}
            illustration="/assets/register-illustration.png"
            sidePosition="left"
        >
            <div className="mx-auto w-full max-w-[442px]">
                <div className="mb-10 text-center">
                    <h1 className="bg-gradient-to-r from-[#7c24ff] to-[#a000ff] bg-clip-text text-[48px] font-bold leading-none tracking-[0.06em] text-transparent">
                        Criar Conta
                    </h1>
                    <p className="mt-4 text-sm tracking-wide text-white/70">
                        Preencha os dados para se cadastrar
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <Field icon={UserRound} label="Nome">
                        <input
                            className={fieldClass}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            placeholder="Seu nome completo"
                        />
                    </Field>

                    <Field icon={Mail} label="E-mail">
                        <input
                            className={fieldClass}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            autoComplete="email"
                            placeholder="Seu@email.com"
                        />
                    </Field>

                    <Field icon={LockKeyhole} label="Senha">
                        <PasswordInput
                            value={password}
                            onChange={setPassword}
                            visible={showPassword}
                            onToggle={() => setShowPassword((value) => !value)}
                            placeholder="Crie uma senha"
                        />
                    </Field>

                    <Field icon={LockKeyhole} label="Confirmar senha">
                        <PasswordInput
                            value={confirmation}
                            onChange={setConfirmation}
                            visible={showConfirmation}
                            onToggle={() => setShowConfirmation((value) => !value)}
                            placeholder="Confirme sua senha"
                        />
                    </Field>

                    <label className="flex cursor-pointer items-start gap-2 pt-2 text-sm leading-5 text-white/75">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(event) => setAcceptedTerms(event.target.checked)}
                            className="mt-0.5 size-4 shrink-0 accent-[#8b24ff]"
                        />

                        <span className="min-w-0">
                            Aceita os{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    toast.info("Termos de uso ainda não publicados.")
                                }
                                className="whitespace-nowrap text-[#1685ff] hover:underline"
                            >
                                termos de uso
                            </button>{" "}
                            e{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    toast.info(
                                        "Política de privacidade ainda não publicada.",
                                    )
                                }
                                className="whitespace-nowrap text-[#1685ff] hover:underline"
                            >
                                política de privacidade
                            </button>
                        </span>
                    </label>

                    {error ? (
                        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                            {error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#9854ff] via-[#7d22ff] to-[#6800ff] text-lg font-semibold text-white shadow-lg shadow-purple-900/25 transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Cadastrando..." : "Cadastrar"}
                        {!loading && <ArrowRight className="size-4" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-base text-white/85">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="font-medium text-[#245cff] hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
}

function Field({
    icon: Icon,
    label,
    children,
}: {
    icon: typeof Mail;
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
                <Icon className="size-4 text-white/80" />
                {label}
            </span>
            {children}
        </label>
    );
}

function PasswordInput({
    value,
    onChange,
    visible,
    onToggle,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    visible: boolean;
    onToggle: () => void;
    placeholder: string;
}) {
    return (
        <div className="relative">
            <input
                className={`${fieldClass} pr-12`}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={onToggle}
                aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
            >
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}