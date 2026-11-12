import { ArrowUpRight, Mic, Play, Sparkles } from "lucide-react";
import { youtubeThumbnail, type SiteContent } from "@shared/content";
import { Reveal, SectionHeading, useSpotlight } from "./primitives";

export function Guests({ content }: { content: SiteContent }) {
  const { guests, guestsSection, episodes } = content;
  const spotlight = useSpotlight();

  return (
    <section id="convidados" className="relative py-24 lg:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={guestsSection.eyebrow}
            title={guestsSection.title}
            description={guestsSection.description}
            action={
              <a href="#contato" className="btn btn-ghost">
                <Mic className="size-4" />
                {guestsSection.ctaLabel}
              </a>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest, index) => {
            const episode = episodes.find(item => item.id === guest.episodeId);
            const image = guest.photo || (episode ? youtubeThumbnail(episode.youtubeId) : "");
            return (
              <Reveal key={guest.id} delay={index * 90}>
                <article
                  {...spotlight}
                  className="card-surface spotlight group relative h-full overflow-hidden"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    {image ? (
                      <img
                        src={image}
                        alt={guest.name}
                        loading="lazy"
                        className="size-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="grid size-full place-items-center bg-gradient-to-br from-[#0e1a1c] to-[#050708]">
                        <Mic className="size-10 text-brand/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050708] via-[#050708]/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050708] via-[#050708]/85 to-transparent p-5 pb-6">
                      <p className="font-display text-xl uppercase leading-tight text-white">
                        {guest.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[0.7rem] uppercase leading-snug tracking-[0.12em] text-brand">
                        {guest.role}
                      </p>
                    </div>
                    {episode ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute right-4 top-4 grid size-10 translate-y-2 place-items-center rounded-full border border-white/25 bg-black/50 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:border-brand hover:bg-brand hover:text-black"
                        aria-label={`Ver episódio com ${guest.name}`}
                      >
                        <Play className="size-4 translate-x-0.5 fill-current" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={guests.length * 90} className="self-start sm:col-span-1 lg:col-span-2">
            <a
              href="#contato"
              className="group flex min-h-[260px] flex-col items-start justify-center gap-6 rounded-[1.25rem] border border-dashed border-brand/35 bg-brand/[0.04] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-brand hover:bg-brand/[0.08] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-brand/30 bg-brand/10 text-brand">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="font-display text-2xl uppercase leading-tight text-white">
                    Sua história pode ser a próxima
                  </p>
                  <p className="mt-3 max-w-sm text-[0.86rem] leading-relaxed text-muted-foreground">
                    Tem um propósito, um negócio ou uma superação para contar? A produção entra em contato.
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-brand">
                Enviar minha história
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
