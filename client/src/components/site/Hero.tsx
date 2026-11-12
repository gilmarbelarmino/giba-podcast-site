import { ArrowDownRight, ArrowUpRight, Play, Youtube } from "lucide-react";
import type { SiteContent } from "@shared/content";
import { Waveform } from "./primitives";

export function Hero({ content }: { content: SiteContent }) {
  const { hero, brand, stats } = content;
  const subscribers = stats[0];
  const videos = stats[1];

  return (
    <section id="inicio" className="relative isolate overflow-hidden pb-10 pt-32 sm:pt-36 lg:pb-14 lg:pt-40">
      {/* Fundo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-lines opacity-70" />
        <div className="animate-glow absolute -right-40 -top-40 size-[620px] rounded-full bg-brand/20 blur-[140px]" />
        <div className="animate-float-slow absolute -left-32 top-1/3 size-[420px] rounded-full bg-[#1d4a63]/40 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050708] to-transparent" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
        <div>
          <div className="animate-rise inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/4 py-1.5 pl-2 pr-4 backdrop-blur">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-brand-soft">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-brand" />
              {hero.badge}
            </span>
            <span className="text-[0.72rem] font-medium tracking-wide text-[#a9b8bd]">
              {hero.eyebrow}
            </span>
          </div>

          <h1
            className="display-title animate-rise mt-7 text-[clamp(2.7rem,7.2vw,5.9rem)] text-white"
            style={{ animationDelay: "80ms" }}
          >
            {hero.headline}{" "}
            <span className="font-script relative inline-block lowercase tracking-normal text-brand">
              {hero.highlight}
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-brand/60"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8c60-6 120-6 180-2s80 2 116-3"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-brand">.</span>
          </h1>

          <p
            className="animate-rise mt-8 max-w-xl whitespace-pre-line text-[1.02rem] leading-relaxed text-[#a9b8bd]"
            style={{ animationDelay: "160ms", whiteSpace: "pre-line" }}
          >
            {hero.description}
          </p>

          <div
            className="animate-rise mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <a href={hero.primaryCtaHref} target="_blank" rel="noreferrer" className="btn btn-primary group">
              <Play className="size-4 fill-current" />
              {hero.primaryCtaLabel}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a href={hero.secondaryCtaHref} className="btn btn-ghost">
              {hero.secondaryCtaLabel}
              <ArrowDownRight className="size-4" />
            </a>
          </div>

          <dl
            className="animate-rise mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/8 pt-6"
            style={{ animationDelay: "320ms" }}
          >
            {[subscribers, videos].filter(Boolean).map(stat => (
              <div key={stat.id} className="flex items-baseline gap-2">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl text-white">{stat.value}</dd>
                <span className="text-[0.78rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.14em] text-muted-foreground">
              <Youtube className="size-4 text-brand" aria-hidden="true" />
              {brand.production}
            </div>
          </dl>
        </div>

        {/* Composição visual */}
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="relative mx-auto aspect-square w-[86%] max-w-[430px]">
            <div
              className="animate-ring absolute inset-0 rounded-full opacity-90"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(201,211,216,0.9), rgba(46,230,214,0.15) 25%, rgba(46,230,214,0.95) 50%, rgba(255,255,255,0.08) 72%, rgba(201,211,216,0.9))",
                maskImage: "radial-gradient(circle, transparent 66%, #000 67%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 66%, #000 67%)",
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-[7%] rounded-full bg-[#050708] shadow-[inset_0_0_60px_rgba(46,230,214,0.12)]" />
            <div className="absolute inset-[7%] overflow-hidden rounded-full border border-white/10 bg-black">
              <img
                src={brand.logoUrl}
                alt={`Logotipo ${brand.name}`}
                className="size-full scale-[1.04] object-cover"
                width={624}
                height={626}
              />
            </div>
            <div className="absolute inset-0 rounded-full shadow-[0_0_120px_-20px_rgba(46,230,214,0.55)]" />
          </div>

          {/* Foto do estúdio */}
          <figure className="animate-float absolute -right-2 top-0 w-[40%] max-w-[205px] rotate-[5deg] overflow-hidden rounded-2xl border border-white/15 bg-[#0b1012] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] sm:-right-6">
            <img
              src={hero.image}
              alt={hero.imageCaption}
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
            <figcaption className="flex items-center gap-1.5 px-3 py-2 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-[#9fb0b6]">
              <span className="size-1.5 rounded-full bg-brand" />
              Ao vivo no estúdio
            </figcaption>
          </figure>

          {/* Card de ondas */}
          <div className="animate-float-slow glass absolute -bottom-2 left-0 w-[68%] max-w-[290px] rounded-2xl p-4 sm:-left-4">
            <div className="flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#9fb0b6]">
              <span>No ar agora</span>
              <span className="text-brand">00:42:18</span>
            </div>
            <Waveform className="mt-2 h-12 text-brand" color="currentColor" bars={40} />
            <div className="mt-2 flex items-center justify-between text-[0.66rem] text-[#8fa0a6]">
              <span>{brand.presenter}</span>
              <span>GIBA · EP. 08</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x mt-10 hidden items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-[#5f7178] lg:flex">
        <span className="h-8 w-px bg-gradient-to-b from-brand/80 to-transparent" />
        Role para ouvir as histórias
      </div>
    </section>
  );
}
