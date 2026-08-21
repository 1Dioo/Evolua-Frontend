import { useMemo, useState } from "react";
import { LifeBuoy, MessageCircle, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Panel, SectionTitle } from "@/components/ui-kit";
import { faq, faqCategories } from "@/demo/compatibility";


const fieldClass =
  "w-full rounded-xl border border-input bg-surface-2/60 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60";

export function HelpPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todas");
  const [contactOpen, setContactOpen] = useState(false);

  const list = useMemo(
    () =>
      faq.filter((item) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          q.length === 0 ||
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q);
        const matchesCategory = category === "Todas" || item.category === category;
        return matchesQuery && matchesCategory;
      }),
    [query, category],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Como podemos ajudar?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pesquise sua dúvida ou navegue pelas categorias abaixo.
        </p>
      </div>

      <Panel className="space-y-4">
        <label className="flex min-w-0 items-center gap-2 rounded-xl border border-input bg-surface-2/60 px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar uma dúvida..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {["Todas", ...faqCategories].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === item
                  ? "border-primary/40 bg-primary/12 text-primary-light"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </Panel>

      <section>
        <SectionTitle title="Perguntas frequentes" subtitle={`${list.length} resultado(s)`} />
        {list.length === 0 ? (
          <Panel className="py-12 text-center">
            <LifeBuoy className="mx-auto size-6 text-muted-foreground" strokeWidth={1.75} />
            <p className="mt-3 text-sm font-medium">Nenhuma pergunta encontrada</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente outros termos ou fale com a equipe do Projeto Social.
            </p>
          </Panel>
        ) : (
          <Panel className="px-5 py-2">
            <Accordion type="single" collapsible className="w-full">
              {list.map((item, index) => (
                <AccordionItem key={item.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Panel>
        )}
      </section>

      <Panel className="grid gap-4 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Não encontrou o que procurava?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fale com os monitores do curso de Desenvolvimento de Sistemas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light"
        >
          <MessageCircle className="size-4" strokeWidth={1.75} /> Entrar em contato
        </button>
      </Panel>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrar em contato</DialogTitle>
            <DialogDescription>
              Descreva sua dúvida e a equipe responde pelo e-mail cadastrado.
            </DialogDescription>
          </DialogHeader>
          <ContactForm onSent={() => setContactOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContactForm({ onSent }: { onSent: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const submit = () => {
    if (subject.trim().length < 3 || message.trim().length < 10) {
      setError("Informe um assunto e uma mensagem com pelo menos 10 caracteres.");
      return;
    }
    setError(null);
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Mensagem enviada. Responderemos em breve.");
      onSent();
    }, 700);
  };

  return (
    <div className="space-y-3">
      <input
        className={fieldClass}
        placeholder="Assunto"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        className={`${fieldClass} min-h-28 resize-y`}
        placeholder="Escreva sua dúvida..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <button
        type="button"
        disabled={sending}
        onClick={submit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light disabled:opacity-60"
      >
        {sending ? "Enviando..." : "Enviar mensagem"}
      </button>
    </div>
  );
}
