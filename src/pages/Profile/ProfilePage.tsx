import { useRef, useState } from "react";
import { Camera, CheckCircle, Lock, Mail, Pencil, ShieldCheck, User, X } from "lucide-react";
import { toast } from "sonner";
import { Panel, SectionTitle } from "@/components/ui-kit";
import { useProfile } from "@/lib/profile";

const fieldClass =
  "w-full rounded-xl border border-input bg-surface-2/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60";

export function ProfilePage() {
  const { profile, initials, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setName(profile.name);
    setEmail(profile.email);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const save = () => {
    const next: { name?: string; email?: string } = {};
    if (name.trim().length < 3) next.name = "Informe um nome com pelo menos 3 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Informe um e-mail válido.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateProfile({ name: name.trim(), email: email.trim() });
    setEditing(false);
    toast.success("Perfil atualizado com sucesso.");
  };

  const pickAvatar = (file?: File | null) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
        toast.error("A imagem deve ter no máximo 2 MB.");
        return;
    }

    if (!file.type.startsWith("image/")) {
        toast.error("Selecione uma imagem válida.");
        return;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Meu Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visualize e atualize seus dados na plataforma.
        </p>
      </div>

      <Panel className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`Foto de perfil de ${profile.name}`}
              className="size-16 shrink-0 rounded-2xl object-cover sm:size-20"
            />
          ) : (
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-purple text-xl font-bold text-primary-foreground sm:size-20 sm:text-2xl">
              {initials}
            </span>
          )}
          <div className="min-w-0 space-y-1.5">
            <h2 className="truncate text-xl font-semibold">{profile.name}</h2>
            <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="truncate">{profile.email}</span>
            </p>
            {profile.turma ? (
              <p className="text-xs text-muted-foreground">Turma: {profile.turma}</p>
            ) : null}
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-medium text-success">
              <CheckCircle className="size-3.5" /> Conta ativa
            </span>
          </div>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light lg:justify-self-end"
          >
            <Pencil className="size-4" strokeWidth={1.75} /> Editar perfil
          </button>
        ) : null}
      </Panel>

      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <SectionTitle title="Informações pessoais" subtitle="Nome e e-mail usados na plataforma" />
          <Panel className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nome completo
              </label>
              {editing ? (
                <>
                  <input
                    className={fieldClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
                </>
              ) : (
                <p className="flex items-center gap-2 text-sm">
                  <User className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <span className="truncate">{profile.name}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                E-mail
              </label>
              {editing ? (
                <>
                  <input
                    className={fieldClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    inputMode="email"
                  />
                  {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
                </>
              ) : (
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <span className="truncate">{profile.email}</span>
                </p>
              )}
            </div>

            {editing ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={save}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
                >
                  <CheckCircle className="size-4" strokeWidth={1.75} /> Salvar alterações
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" strokeWidth={1.75} /> Cancelar
                </button>
              </div>
            ) : null}
          </Panel>
        </div>

        <div className="space-y-6">
          <div>
            <SectionTitle title="Foto de perfil" subtitle="Use uma imagem quadrada para melhor resultado" />
            <Panel className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Pré-visualização da foto de perfil"
                  className="size-14 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-purple text-base font-bold text-primary-foreground">
                  {initials}
                </span>
              )}
              <div className="min-w-0 space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickAvatar(e.target.files?.[0])}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary-light"
                  >
                    <Camera className="size-3.5" strokeWidth={1.75} /> Alterar foto
                  </button>
                  {profile.avatar ? (
                    <button
                      type="button"
                      onClick={() => {
                        updateProfile({ avatar: null });
                        toast.success("Foto removida.");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Remover
                    </button>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG ou JPG, até 2 MB.
                </p>
              </div>
            </Panel>
          </div>

          <div>
            <SectionTitle title="Segurança" subtitle="Alterar senha de acesso" />
            <PasswordForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!current || !next || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (next.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (next !== confirm) {
      setError("A confirmação não corresponde à nova senha.");
      return;
    }
    setError(null);
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Senha atualizada com sucesso.");
  };

  return (
    <Panel className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary-light" strokeWidth={1.75} />
        Use uma senha forte, com letras, números e símbolos.
      </div>
      <input
        className={fieldClass}
        type="password"
        placeholder="Senha atual"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <input
        className={fieldClass}
        type="password"
        placeholder="Nova senha"
        value={next}
        onChange={(e) => setNext(e.target.value)}
      />
      <input
        className={fieldClass}
        type="password"
        placeholder="Confirmar nova senha"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <button
        type="button"
        onClick={submit}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary-light"
      >
        <Lock className="size-4" strokeWidth={1.75} /> Atualizar senha
      </button>
    </Panel>
  );
}
