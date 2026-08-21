import { Award, Clock, Download, Eye, Hash } from "lucide-react";
import { toast } from "sonner";
import { IconBadge, Panel, ProgressBar, SectionTitle, StatCard } from "@/components/ui-kit";
import { certificates } from "@/demo/compatibility";


export function CertificatesPage() {
  const available = certificates.filter((c) => c.status === "Disponível");
  const pending = certificates.filter((c) => c.status === "Em andamento");
  const totalHours = available.reduce((sum, c) => sum + parseInt(c.hours, 10), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Certificados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Veja os certificados que você conquistou.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Award} value={String(available.length)} label="Certificados disponíveis" tone="primary" />
        <StatCard icon={Clock} value={`${totalHours}h`} label="Carga horária certificada" tone="success" />
        <StatCard icon={Hash} value={String(pending.length)} label="Em andamento" tone="purple" />
      </div>

      <section>
        <SectionTitle title="Meus Certificados" subtitle="Disponíveis para visualizar e baixar" />
        <div className="grid gap-4 sm:grid-cols-2">
          {available.map((certificate) => (
            <Panel key={certificate.title} hover className="space-y-4">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                <IconBadge icon={certificate.icon} tone="primary" />
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">{certificate.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Concluído em {certificate.issued} • {certificate.hours}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-success/12 px-3 py-1 text-xs font-medium text-success">
                  Disponível
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground">
                <Hash className="size-3.5 shrink-0" />
                <span className="truncate">Código de validação: {certificate.code}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toast.success(`Certificado de ${certificate.title} aberto.`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary-light"
                >
                  <Eye className="size-4" strokeWidth={1.75} /> Visualizar
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("Download iniciado.")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
                >
                  <Download className="size-4" strokeWidth={1.75} /> Baixar
                </button>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Ainda não disponíveis"
          subtitle="Continue seus cursos para conquistar novos certificados."
        />
        <Panel className="divide-y divide-border p-0">
          {pending.map((certificate) => (
            <div key={certificate.title} className="space-y-3 px-5 py-4">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <IconBadge icon={certificate.icon} tone="muted" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{certificate.title}</p>
                  <p className="text-xs text-muted-foreground">{certificate.hours} • carga horária prevista</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-primary-light">
                  {certificate.progress}%
                </span>
              </div>
              <ProgressBar value={certificate.progress} />
              <p className="text-xs text-muted-foreground">
                Faltam {100 - certificate.progress}% para liberar este certificado.
              </p>
            </div>
          ))}
        </Panel>
      </section>
    </div>
  );
}
