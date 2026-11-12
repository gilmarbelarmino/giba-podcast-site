import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { SiteContent } from "@shared/content";
import { Reveal, Waveform } from "./primitives";

export function Newsletter({ newsletter }: { newsletter: SiteContent["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const mutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setDone(true);
      setEmail("");
      toast.success(newsletter.successMessage);
    },
    onError: error => toast.error(error.message || "Não foi possível concluir a inscrição."),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({ email });
  };

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070b0c] px-6 py-12 sm:px-10 lg:px-14">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-24 size-72 rounded-full bg-brand/15 blur-[100px]" />
              <div className="absolute inset-y-0 right-0 w-1/2 opacity-[0.07]">
                <Waveform bars={26} className="h-full text-brand" color="currentColor" />
              </div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
            </div>

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="eyebrow">Newsletter</span>
                <h2 className="display-title mt-4 text-[clamp(1.9rem,3.6vw,3rem)] text-white">
                  {newsletter.title}
                </h2>
                <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
                  {newsletter.description}
                </p>
              </div>

              <div>
                {done ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/[0.08] p-5">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
                    <div>
                      <p className="font-semibold text-white">{newsletter.successMessage}</p>
                      <button
                        type="button"
                        onClick={() => setDone(false)}
                        className="mt-2 text-[0.78rem] text-brand underline-offset-4 hover:underline"
                      >
                        Inscrever outro e-mail
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <label className="relative block">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand/70" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="Seu melhor e-mail"
                        className="field h-[3.25rem] pl-11"
                        autoComplete="email"
                        aria-label="Seu e-mail"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="btn btn-primary h-[3.25rem] w-full disabled:opacity-60"
                    >
                      {mutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                      Quero receber
                    </button>
                    <p className="text-[0.72rem] text-[#6f8088]">
                      Sem spam. Você pode sair da lista quando quiser.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
