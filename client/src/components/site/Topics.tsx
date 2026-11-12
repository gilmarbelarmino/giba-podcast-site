import { BookOpen, Briefcase, Cpu, HeartPulse, Users, type LucideIcon } from "lucide-react";
import type { SiteContent, Topic } from "@shared/content";
import { Reveal, SectionHeading, useSpotlight } from "./primitives";

const ICONS: Record<Topic["icon"], LucideIcon> = {
  briefcase: Briefcase,
  cpu: Cpu,
  book: BookOpen,
  users: Users,
  heart: HeartPulse,
};

export function Topics({ topics }: { topics: SiteContent["topics"] }) {
  const spotlight = useSpotlight();

  return (
    <section id="temas" className="relative py-24 lg:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Temas e formatos"
            title="Três pilares, uma conversa"
            description="Cada episódio cruza vida real, tecnologia e esporte e qualidade de vida — porque nenhuma trajetória cabe em uma única caixa."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {topics.map((topic, index) => {
            const Icon = ICONS[topic.icon] ?? Briefcase;
            return (
              <Reveal key={topic.id} delay={index * 110}>
                <article
                  {...spotlight}
                  className="card-surface spotlight group relative flex h-full flex-col gap-6 p-7 transition-transform duration-500 hover:-translate-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl border border-brand/25 bg-brand/10 text-brand transition-colors duration-500 group-hover:bg-brand group-hover:text-[#04100f]">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-display text-4xl leading-none text-white/8 transition-colors duration-500 group-hover:text-brand/30">
                      0{index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="display-title text-balance text-[1.45rem] leading-[1.12] text-white sm:text-[1.6rem]">
                      {topic.title}
                    </h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-auto h-px w-full bg-gradient-to-r from-brand/60 via-white/10 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
