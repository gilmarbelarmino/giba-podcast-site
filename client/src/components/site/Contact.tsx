import { trpc } from "@/lib/trpc";
import { CheckCircle2, Loader2, Mail, MapPin, Send, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { SiteContent } from "@shared/content";
import { PlatformIcon, Reveal, SectionHeading } from "./primitives";

type FormState = { name: string; email: string; subject: string; message: string };

export function Contact({ content }: { content: SiteContent }) {
  const { contact, social } = content;
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: contact.subjects[0] ?? "Outro assunto",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const mutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSent(true);
      setForm({ name: "", email: "", subject: contact.subjects[0] ?? "Outro assunto", message: "" });
      toast.success("Mensagem enviada! A produção responde em breve.");
    },
    onError: error => {
      toast.error(error.message || "Não foi possível enviar agora.");
    },
  });

  const update = (field: keyof FormState) => (event: { target: { value: string } }) =>
    setForm(current => ({ ...current, [field]: event.target.value }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (form.message.trim().length < 10) {
      toast.error("Escreva um pouco mais sobre sua proposta (mínimo 10 caracteres).");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <section id="contato" className="relative py-24 lg:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading eyebrow={contact.eyebrow} title={contact.title} description={contact.description} />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="flex flex-col gap-4">
            <div className="card-surface flex items-start gap-4 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                <Mail className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  E-mail da produção
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-1 block truncate text-[1rem] font-medium text-white hover:text-brand"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            <div className="card-surface flex items-start gap-4 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Onde gravamos
                </p>
                <p className="mt-1 text-[1rem] font-medium text-white">{contact.location}</p>
                {contact.whatsapp ? (
                  <a href={`https://wa.me/${contact.whatsapp}`} className="mt-1 block text-sm text-brand">
                    WhatsApp: {contact.whatsapp}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="card-surface flex flex-col gap-4 p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Acompanhe
              </p>
              <div className="flex flex-wrap gap-2">
                {social.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[0.82rem] text-white transition hover:border-brand/60 hover:text-brand"
                  >
                    <PlatformIcon platform={link.platform} className="size-4" />
                    {link.platform}
                  </a>
                ))}
              </div>
              <p className="flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                Seus dados são usados apenas para responder à sua mensagem.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card-surface relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-brand/10 blur-3xl" />
              {sent ? (
                <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
                  <span className="grid size-16 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand">
                    <CheckCircle2 className="size-8" />
                  </span>
                  <h3 className="font-display text-2xl uppercase text-white">Mensagem enviada</h3>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Obrigado pelo contato. A produção do GIBA Podcast responde pelo e-mail informado.
                  </p>
                  <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-2">
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="relative flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-[0.78rem] font-medium text-[#b8c5ca]">
                      Seu nome
                      <input
                        required
                        minLength={2}
                        maxLength={160}
                        value={form.name}
                        onChange={update("name")}
                        className="field"
                        placeholder="Como podemos te chamar?"
                        autoComplete="name"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-[0.78rem] font-medium text-[#b8c5ca]">
                      E-mail
                      <input
                        required
                        type="email"
                        maxLength={320}
                        value={form.email}
                        onChange={update("email")}
                        className="field"
                        placeholder="voce@empresa.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-[0.78rem] font-medium text-[#b8c5ca]">
                    Assunto
                    <select value={form.subject} onChange={update("subject")} className="field">
                      {contact.subjects.map(subject => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-[0.78rem] font-medium text-[#b8c5ca]">
                    Mensagem
                    <textarea
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={6}
                      value={form.message}
                      onChange={update("message")}
                      className="field resize-none"
                      placeholder="Conte o que você tem em mente: pauta, convite, parceria..."
                    />
                  </label>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[0.72rem] text-[#6f8088]">
                      Resposta em até 2 dias úteis.
                    </span>
                    <button type="submit" disabled={mutation.isPending} className="btn btn-primary disabled:opacity-60">
                      {mutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      {mutation.isPending ? "Enviando..." : "Enviar mensagem"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
