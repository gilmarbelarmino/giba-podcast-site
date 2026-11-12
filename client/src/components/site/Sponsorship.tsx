import { ArrowUpRight, Check } from "lucide-react";
import type { SiteContent } from "@shared/content";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading, useSpotlight } from "./primitives";

export function Sponsorship({ sponsorship }: { sponsorship: SiteContent["sponsorship"] }) {
  const spotlight = useSpotlight();

  return (
    <section id="patrocinio" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[560px] w-[560px] rounded-full bg-brand/8 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      </div>

      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={sponsorship.eyebrow}
            title={sponsorship.title}
            description={sponsorship.description}
            action={
              <a href={sponsorship.ctaHref} className="btn btn-primary">
                {sponsorship.ctaLabel}
                <ArrowUpRight className="size-4" />
              </a>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {sponsorship.tiers.map((tier, index) => (
            <Reveal key={tier.id} delay={index * 100}>
              <article
                {...spotlight}
                className={cn(
                  "spotlight group relative flex h-full flex-col gap-6 rounded-[1.25rem] border p-7 transition-all duration-500 hover:-translate-y-1.5",
                  tier.highlight
                    ? "border-brand/60 bg-gradient-to-b from-brand/[0.12] to-transparent shadow-[0_30px_80px_-40px_rgba(46,230,214,0.7)]"
                    : "border-white/10 bg-white/[0.02]",
                )}
              >
                {tier.highlight ? (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#04100f]">
                    Mais procurado
                  </span>
                ) : null}

                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand">
                    {tier.tagline}
                  </p>
                  <h3 className="display-title mt-3 text-[1.7rem] text-white">{tier.name}</h3>
                </div>

                <ul className="flex flex-1 flex-col gap-3">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-[#b8c5ca]">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={sponsorship.ctaHref}
                  className={cn("btn w-full", tier.highlight ? "btn-primary" : "btn-ghost")}
                >
                  Falar sobre parceria
                  <ArrowUpRight className="size-4" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
