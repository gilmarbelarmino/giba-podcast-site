import { Quote, Sparkles } from "lucide-react";
import type { SiteContent } from "@shared/content";
import { Reveal } from "./primitives";

export function About({ about, brand }: { about: SiteContent["about"]; brand: SiteContent["brand"] }) {
  return (
    <section id="sobre" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-[520px] w-[520px] rounded-full bg-brand/8 blur-[150px]" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal className="relative">
          <div className="relative mx-auto max-w-[520px]">
            <div className="absolute -inset-4 rounded-[2rem] border border-white/8" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/12">
              <img
                src={about.image}
                alt="Gravação de episódio no estúdio do GIBA Podcast"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050708]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                <span className="animate-pulse-dot size-1.5 rounded-full bg-brand" />
                {brand.production}
              </div>
            </div>

            <div className="animate-float-slow absolute -bottom-14 -right-3 hidden w-[34%] max-w-[170px] overflow-hidden rounded-2xl border border-white/15 bg-[#0b1012] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] sm:-right-10 sm:block">
              <img
                src="/assets/gilmar-estudio.jpg"
                alt={about.founderName}
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
              <div className="bg-[#0b1012] px-3 py-2.5">
                <p className="text-[0.76rem] font-semibold leading-tight text-white">{about.founderName}</p>
                <p className="mt-0.5 text-[0.52rem] uppercase leading-tight tracking-[0.07em] text-brand">
                  {about.founderRole}
                </p>
              </div>
            </div>

            <div className="absolute -left-3 -top-6 grid size-14 place-items-center rounded-full border border-brand/30 bg-[#071010] text-brand shadow-[0_0_40px_-8px_rgba(46,230,214,0.6)]">
              <Sparkles className="size-5" />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="display-title mt-4 text-[clamp(2.1rem,4.2vw,3.6rem)] text-white">
              {about.title}
            </h2>
          </Reveal>

          <div className="mt-6 space-y-4">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={80 + index * 60}>
                <p className="text-[0.98rem] leading-relaxed text-[#a9b8bd]">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={220}>
            <blockquote className="relative mt-9 rounded-2xl border border-brand/20 bg-brand/[0.06] p-6 pl-14">
              <Quote className="absolute left-5 top-6 size-6 text-brand/70" aria-hidden="true" />
              <p className="font-script text-[1.6rem] leading-tight text-brand-soft">{about.quote}</p>
            </blockquote>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <p className="font-display text-lg uppercase tracking-wide text-white">
                  {about.founderName}
                </p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand">
                  {about.founderRole}
                </p>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-muted-foreground">
                  {about.founderBio}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <p className="font-display text-lg uppercase tracking-wide text-white">
                  {about.productionName}
                </p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand">
                  Produção
                </p>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-muted-foreground">
                  {about.productionBio}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
