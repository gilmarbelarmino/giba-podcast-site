import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  ExternalLink,
  Play,
  Radio,
  Scissors,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatEpisodeDate,
  youtubeThumbnail,
  type Episode,
  type SiteContent,
} from "@shared/content";
import { Reveal, SectionHeading, useSpotlight } from "./primitives";

const FILTERS = ["Todos", "Episódio", "Corte", "Ao vivo"] as const;
type Filter = (typeof FILTERS)[number];

function Thumb({ episode, className }: { episode: Episode; className?: string }) {
  if (episode.thumbnail) {
    return (
      <div className="relative size-full overflow-hidden bg-[#050b14]">
        <img
          src={episode.thumbnail}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full scale-110 object-cover opacity-45 blur-xl"
        />
        <img
          src={episode.thumbnail}
          alt={`Capa do episódio: ${episode.title}`}
          loading="lazy"
          className={cn("relative z-10 size-full object-contain", className)}
        />
      </div>
    );
  }
  return (
    <img
      src={youtubeThumbnail(episode.youtubeId)}
      alt={`Capa do episódio: ${episode.title}`}
      loading="lazy"
      className={cn("size-full object-cover", className)}
      onError={event => {
        const img = event.currentTarget;
        if (!img.dataset.fallback) {
          img.dataset.fallback = "1";
          img.src = youtubeThumbnail(episode.youtubeId, "hq");
        }
      }}
    />
  );
}

function TypeBadge({ episode }: { episode: Episode }) {
  const Icon = episode.type === "Ao vivo" ? Radio : episode.type === "Corte" ? Scissors : Play;
  return (
    <span className="chip border-white/20 bg-black/60 backdrop-blur">
      <Icon className="size-3 text-brand" aria-hidden="true" />
      {episode.type}
    </span>
  );
}

function PlayerModal({ episode, onClose }: { episode: Episode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Player: ${episode.title}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-label="Fechar player"
      />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-[#070b0c] shadow-[0_40px_120px_-30px_rgba(46,230,214,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-brand">
              {episode.type} · {episode.category}
            </p>
            <h3 className="mt-1 truncate text-base font-semibold text-white">{episode.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-white transition hover:border-brand/60 hover:text-brand"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${episode.youtubeId}?autoplay=1&rel=0`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm text-muted-foreground">
          <span>
            {episode.guest ? `Com ${episode.guest} · ` : ""}
            {formatEpisodeDate(episode.date)}
          </span>
          <a
            href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-brand hover:text-brand-soft"
          >
            Abrir no YouTube
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Episodes({ content }: { content: SiteContent }) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [playing, setPlaying] = useState<Episode | null>(null);
  const spotlight = useSpotlight();

  const featured = useMemo(
    () => content.episodes.find(episode => episode.featured) ?? content.episodes[0],
    [content.episodes],
  );

  const list = useMemo(() => {
    const others = content.episodes.filter(episode => episode.id !== featured?.id);
    if (filter === "Todos") return others;
    return others.filter(episode => episode.type === filter);
  }, [content.episodes, featured?.id, filter]);

  if (!featured) return null;

  return (
    <section id="episodios" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand/5 blur-[140px]" />

      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={content.episodesSection.eyebrow}
            title={content.episodesSection.title}
            description={content.episodesSection.description}
            action={
              <a
                href={content.brand.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                Ver o canal
                <ArrowUpRight className="size-4" />
              </a>
            }
          />
        </Reveal>

        {/* Destaque */}
        <Reveal delay={80} className="mt-12">
          <article
            {...spotlight}
            className="card-surface spotlight group grid overflow-hidden lg:grid-cols-[1.25fr_1fr]"
          >
            <button
              type="button"
              onClick={() => setPlaying(featured)}
              className="relative block aspect-video overflow-hidden bg-black text-left lg:aspect-auto lg:min-h-[380px]"
              aria-label={`Assistir: ${featured.title}`}
            >
              <Thumb
                episode={featured}
                className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
              <span className="absolute left-4 top-4">
                <TypeBadge episode={featured} />
              </span>
              <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand/70 bg-[#04100f]/75 text-brand shadow-[0_0_50px_-10px_rgba(46,230,214,0.8)] backdrop-blur transition-all duration-500 group-hover:scale-110 group-hover:border-brand group-hover:bg-brand group-hover:text-black">
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/80">
                <Clock className="size-3.5 text-brand" />
                {featured.duration || "Episódio completo"}
              </span>
            </button>

            <div className="flex flex-col justify-between gap-8 p-6 sm:p-9">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="rounded-full bg-brand/12 px-2.5 py-1 font-semibold text-brand">
                    {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {formatEpisodeDate(featured.date)}
                  </span>
                </div>
                <h3 className="mt-5 text-[clamp(1.5rem,2.6vw,2.3rem)] font-semibold leading-tight text-white">
                  {featured.title}
                </h3>
                {featured.guest ? (
                  <p className="mt-2 text-sm text-brand-soft">Com {featured.guest}</p>
                ) : null}
                <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setPlaying(featured)} className="btn btn-primary">
                  <Play className="size-4 fill-current" />
                  Assistir agora
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  YouTube
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Filtros */}
        <div className="mt-14 flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar episódios">
          {FILTERS.map(item => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={filter === item}
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                filter === item
                  ? "border-brand bg-brand text-[#04100f] shadow-[0_10px_30px_-12px_rgba(46,230,214,0.8)]"
                  : "border-white/12 text-[#a9b8bd] hover:border-white/30 hover:text-white",
              )}
            >
              {item === "Todos" ? "Todos" : `${item}s`}
            </button>
          ))}
          <span className="ml-auto text-[0.72rem] uppercase tracking-[0.16em] text-[#5f7178]">
            {list.length} {list.length === 1 ? "vídeo" : "vídeos"}
          </span>
        </div>

        {/* Grade */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((episode, index) => (
            <Reveal key={episode.id} delay={(index % 3) * 90}>
              <article
                {...spotlight}
                className="card-surface spotlight group flex h-full flex-col"
              >
                <button
                  type="button"
                  onClick={() => setPlaying(episode)}
                  className="relative block aspect-video overflow-hidden bg-black"
                  aria-label={`Assistir: ${episode.title}`}
                >
                  <Thumb
                    episode={episode}
                    className="opacity-90 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3">
                    <TypeBadge episode={episode} />
                  </span>
                  <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-black">
                    <Play className="size-4 translate-x-0.5 fill-current" />
                  </span>
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="text-brand">{episode.category}</span>
                    <span className="size-1 rounded-full bg-white/20" />
                    {formatEpisodeDate(episode.date)}
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-white transition-colors group-hover:text-brand-soft">
                    {episode.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[0.84rem] leading-relaxed text-muted-foreground">
                    {episode.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-[0.72rem] text-[#8fa0a6]">
                    <span className="truncate">{episode.guest}</span>
                    <button
                      type="button"
                      onClick={() => setPlaying(episode)}
                      className="inline-flex items-center gap-1 font-semibold text-brand transition hover:text-brand-soft"
                    >
                      Assistir
                      <Play className="size-3 fill-current" />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-white/12 p-8 text-center text-sm text-muted-foreground">
            Ainda não há vídeos deste tipo. Experimente outro filtro.
          </p>
        ) : null}
      </div>

      {playing ? <PlayerModal episode={playing} onClose={() => setPlaying(null)} /> : null}
    </section>
  );
}
