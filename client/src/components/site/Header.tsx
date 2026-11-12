import { cn } from "@/lib/utils";
import { Menu, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SiteContent } from "@shared/content";

const NAV_ITEMS = [
  { label: "Episódios", href: "#episodios" },
  { label: "Temas", href: "#temas" },
  { label: "Sobre", href: "#sobre" },
  { label: "Convidados", href: "#convidados" },
  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Contato", href: "#contato" },
];

export function Header({ brand }: { brand: SiteContent["brand"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 24);
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-brand-deep via-brand to-brand-soft transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[65] transition-all duration-500",
          scrolled
            ? "border-b border-white/8 bg-[#050708]/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-[76px] items-center justify-between gap-6">
          <a href="#inicio" className="group flex items-center gap-3" aria-label="GIBA Podcast — início">
            <span className="relative grid size-11 place-items-center">
              <span className="absolute inset-0 rounded-full bg-brand/25 blur-md transition group-hover:bg-brand/40" />
              <img
                src={brand.logoUrl}
                alt="Logotipo GIBA Podcast"
                className="relative size-11 rounded-full border border-white/15 object-cover"
                width={44}
                height={44}
              />
            </span>
            <span className="leading-none">
              <span className="font-display block text-lg tracking-[0.12em] text-white">
                {brand.name.toUpperCase()}
              </span>
              <span className="mt-1 hidden text-[0.62rem] font-medium uppercase tracking-[0.34em] text-muted-foreground sm:block">
                {brand.tagline}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded-full px-3.5 py-2 text-[0.86rem] font-medium text-[#c3ced3] transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={brand.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary hidden h-11 px-5 text-[0.85rem] sm:inline-flex"
            >
              <Play className="size-4 fill-current" />
              Assistir
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-white/12 text-white transition hover:border-brand/60 hover:text-brand lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[80] transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-8 border-l border-white/10 bg-[#070b0c] p-6 transition-transform duration-500",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl tracking-[0.14em] text-white">
              {brand.name.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-10 place-items-center rounded-full border border-white/12 text-white"
              aria-label="Fechar menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 rounded-xl px-3 py-3 text-2xl font-display uppercase tracking-wide text-white/90 transition hover:bg-white/5 hover:text-brand"
              >
                <span className="text-[0.65rem] font-sans font-semibold tracking-[0.2em] text-brand/70">
                  0{index + 1}
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={brand.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary mt-auto w-full"
          >
            <Play className="size-4 fill-current" />
            Assistir no YouTube
          </a>
        </div>
      </div>
    </>
  );
}
