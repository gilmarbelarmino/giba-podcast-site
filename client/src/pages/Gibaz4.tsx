import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Clock,
  Download,
  ExternalLink,
  FileSpreadsheet,
  HeartHandshake,
  Menu,
  MessageCircle,
  Mic,
  Play,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  GIBAZ4_CONTENT,
  buildWhatsAppLink,
  type Gibaz4Material,
} from "@shared/gibaz4";
import {
  CATALOG_CATEGORIES,
  defaultCatalogProducts,
  getCategoryLabel,
  getFirstProductName,
  loadCatalogProducts,
  type CatalogCategory,
  type CatalogProduct,
} from "@/lib/catalogApi";
import {
  defaultOngs,
  getFirstOngName,
  loadOngs,
  type OngItem,
} from "@/lib/ongsApi";
import { trackGibaz4Event, trackGibaz4PageView } from "@/lib/gibaz4Analytics";
import { cn } from "@/lib/utils";
import { Reveal, useSpotlight } from "@/components/site/primitives";

const navSections = [
  { label: "Catálogo", href: "#catalogo" },
  { label: "Social", href: "#social" },
  { label: "Downloads", href: "#downloads" },
];

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  const prevContent = el.getAttribute("content");
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
  return () => {
    if (created) el?.remove();
    else if (prevContent !== null) el?.setAttribute("content", prevContent);
  };
}

function InstagramSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function WhatsAppSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.91-1.26-4.81-4.19-4.96-4.38-.15-.2-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36.2 0 .4.01.57.01.18 0 .43-.07.67.51.24.59.82 2.01.89 2.15.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.93-1.15.2-.29.39-.24.66-.15.27.1 1.71.81 2 .95.29.15.49.22.56.34.07.12.07.71-.17 1.39z" />
    </svg>
  );
}

function YouTubeSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

function TikTokSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function CatalogProductThumb({ product }: { product: CatalogProduct }) {
  const displayFirstName = product.shortName || getFirstProductName(product.fullName) || "Produto";

  return (
    <a
      href={product.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      title={product.fullName || displayFirstName}
      onClick={() =>
        trackGibaz4Event("menu_recomendacoes", `Produto: ${product.fullName || displayFirstName}`)
      }
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b1114] transition-all duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_12px_30px_-12px_rgba(46,230,214,0.55)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#06090b]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.fullName || displayFirstName}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-brand/10 via-[#0b1215] to-[#06090b] p-2 text-center">
            <ShoppingBag className="size-7 text-brand/70 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-[#6f858d]">
              Foto do produto
            </span>
          </div>
        )}
        <span
          className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full border border-white/15 bg-black/70 text-white/80 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-[#031110] group-hover:opacity-100"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>

      <div className="flex flex-col items-center px-2 py-2 text-center">
        <span className="w-full truncate text-xs font-bold leading-tight text-white transition-colors group-hover:text-brand-soft sm:text-[0.82rem]">
          {displayFirstName}
        </span>
        {product.price ? (
          <span className="mt-0.5 text-[0.74rem] font-extrabold leading-tight text-brand sm:text-xs">
            {product.price}
          </span>
        ) : null}
      </div>
    </a>
  );
}

function OngIconItem({ ong }: { ong: OngItem }) {
  const displayFirstName = ong.shortName || getFirstOngName(ong.fullName) || "ONG";

  return (
    <a
      href={ong.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`${ong.fullName}${ong.handle ? ` (${ong.handle})` : ""}`}
      onClick={() => trackGibaz4Event("menu_social", `ONG: ${ong.fullName || displayFirstName}`)}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#0b1114] px-2 py-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/60 hover:bg-brand/[0.06] hover:shadow-[0_12px_28px_-12px_rgba(46,230,214,0.55)]"
    >
      <div className="relative size-16 shrink-0 sm:size-[72px]">
        <div
          className="size-full overflow-hidden rounded-full p-[2px] shadow-[0_0_24px_-8px_rgba(46,230,214,0.65)] transition-transform duration-300 group-hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #2ee6d6 0%, #0f8f88 50%, #e1306c 100%)",
          }}
        >
          <div className="size-full overflow-hidden rounded-full bg-[#06090b]">
            {ong.logo ? (
              <img
                src={ong.logo}
                alt={ong.fullName || displayFirstName}
                loading="lazy"
                className="size-full object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center bg-gradient-to-br from-brand/15 to-[#070b0d] text-brand">
                <HeartHandshake className="size-7" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-[#0b1114] text-white"
          style={{
            background: "linear-gradient(135deg, #f09433 0%, #dc2743 55%, #bc1888 100%)",
          }}
          aria-hidden="true"
        >
          <InstagramSvg className="size-2.5" />
        </span>
      </div>

      <span className="w-full truncate text-xs font-bold leading-tight text-white transition-colors group-hover:text-brand-soft">
        {displayFirstName}
      </span>
    </a>
  );
}

function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function MaterialCard({ material }: { material: Gibaz4Material }) {
  const [playingInline, setPlayingInline] = useState(false);
  const isAvailable = material.status === "available" && !!material.downloadOrPurchaseUrl;
  const youtubeId = extractYoutubeId(material.downloadOrPurchaseUrl);
  const isVideo = material.format.toLowerCase().includes("vídeo") || !!youtubeId;
  const isSpreadsheet = material.format.toLowerCase().includes("planilha");
  const Icon = isVideo ? Play : isSpreadsheet ? FileSpreadsheet : BookOpen;

  const handleTrack = (suffix = "") => {
    const eventKey =
      material.id === "video-calculo-peso-ideal" ? "video_peso_ideal" : "other_clicks";
    trackGibaz4Event(eventKey, `Material: ${material.title}${suffix}`);
  };

  return (
    <article
      className={cn(
        "flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0b1114] transition hover:border-brand/45",
        isAvailable
          ? "border-brand/40 shadow-[0_0_30px_-14px_rgba(46,230,214,0.4)]"
          : "border-white/10"
      )}
    >
      <div>
        {isVideo && youtubeId ? (
          <div className="relative aspect-video w-full overflow-hidden bg-[#050708]">
            {playingInline ? (
              <>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  title={material.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="size-full"
                />
                <button
                  type="button"
                  onClick={() => setPlayingInline(false)}
                  aria-label="Fechar player em miniatura"
                  title="Voltar para capa"
                  className="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-full border border-white/25 bg-black/80 text-white backdrop-blur transition hover:border-brand hover:text-brand"
                >
                  <X className="size-3.5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleTrack(" (Miniatura)");
                  setPlayingInline(true);
                }}
                aria-label={`Assistir em miniatura: ${material.title}`}
                className="group relative block size-full text-left"
              >
                {material.coverImage ? (
                  <img
                    src={material.coverImage}
                    alt={material.title}
                    width={480}
                    height={360}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand bg-black/75 text-brand shadow-[0_0_24px_rgba(46,230,214,0.8)] transition group-hover:scale-110 group-hover:bg-brand group-hover:text-[#031110]">
                  <Play className="size-5 translate-x-0.5 fill-current" aria-hidden="true" />
                </span>
                <span className="absolute bottom-2 left-2 rounded-full bg-black/75 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-brand-soft backdrop-blur">
                  Assistir aqui
                </span>
              </button>
            )}
          </div>
        ) : null}

        <div className="p-4 pb-0">
          <div className="flex items-center justify-between gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="truncate rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#c2cfd4]">
              {material.format}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-white">
            {material.title}
          </h3>
        </div>
      </div>

      <div className="p-4 pt-3">
        {isAvailable ? (
          isVideo && youtubeId ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!playingInline) handleTrack(" (Miniatura)");
                  setPlayingInline((prev) => !prev);
                }}
                className="btn btn-primary h-9 flex-1 px-3 text-xs"
              >
                <Play className="size-3.5 fill-current" aria-hidden="true" />
                {playingInline ? "Fechar vídeo" : "Assistir aqui"}
              </button>
              <a
                href={material.downloadOrPurchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrack(" (Abrir YouTube)")}
                title="Abrir vídeo inteiro no YouTube"
                aria-label="Abrir vídeo inteiro no YouTube"
                className="btn btn-ghost h-9 shrink-0 px-3 text-xs"
              >
                <span>YouTube</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          ) : (
            <a
              href={material.downloadOrPurchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleTrack()}
              className="btn btn-primary h-9 w-full justify-center px-3 text-xs"
            >
              <Download className="size-3.5" aria-hidden="true" />
              {material.ctaLabel || "Acessar"}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )
        ) : (
          <div
            aria-disabled="true"
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#8ba0a8]"
          >
            <Clock className="size-3 text-brand" aria-hidden="true" />
            Em breve
          </div>
        )}
      </div>
    </article>
  );
}

export default function Gibaz4() {
  const data = GIBAZ4_CONTENT;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>(defaultCatalogProducts);
  const [ongsList, setOngsList] = useState<OngItem[]>(defaultOngs);
  const [selectedCatalogMenu, setSelectedCatalogMenu] = useState<"todos" | CatalogCategory>(
    "todos"
  );
  const spotlight = useSpotlight();

  const whatsappUrl = useMemo(
    () => buildWhatsAppLink(data.contact.whatsappNumber, data.contact.whatsappInitialMessage),
    [data.contact.whatsappNumber, data.contact.whatsappInitialMessage]
  );

  const visibleCatalog = useMemo(
    () => catalogProducts.filter((p) => p.published && !!p.url),
    [catalogProducts]
  );

  const filteredCatalog = useMemo(
    () =>
      selectedCatalogMenu === "todos"
        ? visibleCatalog
        : visibleCatalog.filter((p) => p.category === selectedCatalogMenu),
    [visibleCatalog, selectedCatalogMenu]
  );

  const visibleOngs = useMemo(
    () => ongsList.filter((o) => o.published && !!o.instagramUrl),
    [ongsList]
  );
  const materials = useMemo(
    () => data.materials.filter((m) => m.published),
    [data.materials]
  );

  useEffect(() => {
    trackGibaz4PageView();
    loadCatalogProducts().then((items) => setCatalogProducts(items));
    loadOngs().then((items) => setOngsList(items));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setShowBackTop(y > 260);
      setScrollProgress(total > 0 ? Math.min(100, (y / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    const prevLang = document.documentElement.lang;
    document.title = data.seo.title;
    document.documentElement.lang = "pt-BR";

    const cleanups = [
      upsertMeta('meta[name="description"]', { name: "description", content: data.seo.description }),
      upsertMeta('meta[property="og:title"]', { property: "og:title", content: data.seo.title }),
      upsertMeta('meta[property="og:description"]', {
        property: "og:description",
        content: data.seo.description,
      }),
      upsertMeta('meta[property="og:url"]', { property: "og:url", content: data.seo.canonicalUrl }),
      upsertMeta('meta[property="og:image"]', { property: "og:image", content: data.seo.ogImage }),
      upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: data.seo.title }),
      upsertMeta('meta[name="twitter:description"]', {
        name: "twitter:description",
        content: data.seo.description,
      }),
      upsertMeta('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: data.seo.ogImage,
      }),
    ];

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonical;
    const prevHref = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", data.seo.canonicalUrl);

    return () => {
      document.title = prevTitle;
      document.documentElement.lang = prevLang || "pt-BR";
      cleanups.forEach((fn) => fn());
      if (createdCanonical) canonical?.remove();
      else if (prevHref && canonical) canonical.setAttribute("href", prevHref);
    };
  }, [data.seo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050708] text-[#e9eef1]">
      <div className="fixed inset-x-0 top-0 z-[70] h-[2.5px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-brand-deep via-brand to-[#ff7a1a] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050708]/90 backdrop-blur-xl">
        <div className="container-x flex h-[70px] items-center justify-between gap-3">
          <a
            href="#catalogo"
            className="group flex items-center gap-3 rounded-full py-1 pr-2 focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Descer para o catálogo de indicações de Gilmar (@gibaz4)"
            title="Clique para explorar a página"
          >
            <span className="relative flex items-center">
              <span
                className="pointer-events-none absolute -inset-1 rounded-xl bg-brand/30 blur-md transition duration-300 group-hover:bg-brand/60"
                aria-hidden="true"
              />
              <img
                src={data.profile.logoImage}
                alt={data.profile.logoAlt}
                width={52}
                height={52}
                className="relative h-11 w-11 shrink-0 rounded-xl border border-brand/50 bg-white object-contain p-0.5 shadow-[0_0_20px_-4px_rgba(46,230,214,0.6)] transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <img
              src={data.profile.avatarPhoto}
              alt={`Foto de ${data.profile.displayName}`}
              width={38}
              height={38}
              className="size-9.5 shrink-0 rounded-full border border-brand/40 object-cover object-top"
            />
            <span className="text-sm font-semibold tracking-wide text-white transition-colors group-hover:text-brand-soft sm:text-base">
              {data.profile.headerTitle}
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Seções da página de Gilmar">
            {navSections.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-[#c3ced3] transition-colors hover:bg-white/5 hover:text-brand-soft"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={data.profile.podcastSiteUrl}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 text-xs font-semibold text-white transition hover:border-brand/60 hover:text-brand-soft sm:text-sm"
            >
              <Mic className="size-3.5 text-brand" aria-hidden="true" />
              <span>Giba Podcast</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="gibaz4-mobile-nav"
              aria-label={mobileMenuOpen ? "Fechar menu de seções" : "Abrir menu de seções"}
              className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-brand/60 hover:text-brand md:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            id="gibaz4-mobile-nav"
            aria-label="Menu mobile de seções"
            className="border-t border-white/10 bg-[#080c0e] px-5 py-4 md:hidden"
          >
            <ul className="grid grid-cols-3 gap-2">
              {navSections.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-white transition hover:border-brand/50 hover:text-brand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-white/10 pt-3">
              <a
                href={data.profile.podcastSiteUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-sm font-semibold text-brand-soft"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Ir para o site do Giba Podcast
              </a>
            </div>
          </nav>
        ) : null}
      </header>

      <main id="topo">
        <section className="relative isolate overflow-hidden pb-14 pt-8 sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="grid-lines absolute inset-0 opacity-55" />
            <div className="animate-glow absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]" />
            <div className="animate-float-slow absolute -right-32 top-1/3 size-[360px] rounded-full bg-[#ff7a1a]/10 blur-[130px]" />
          </div>

          <div className="container-x">
            <div
              {...spotlight}
              className="card-surface spotlight mx-auto max-w-4xl rounded-3xl border border-white/12 bg-[#0a0f12]/90 p-6 shadow-[0_30px_90px_-28px_rgba(46,230,214,0.28)] sm:p-8 lg:p-10"
            >
              <div className="grid items-center gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] lg:gap-10">
                <div className="mx-auto flex w-full flex-row items-center justify-center gap-4 md:flex-col">
                  <div className="group relative size-28 shrink-0 overflow-hidden rounded-full border-2 border-brand bg-[#050708] shadow-[0_0_40px_-8px_rgba(46,230,214,0.65)] sm:size-32 md:size-44 md:rounded-3xl">
                    <img
                      src={data.profile.heroPhoto}
                      alt={data.profile.heroPhotoAlt}
                      width={600}
                      height={600}
                      fetchPriority="high"
                      className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border-2 border-brand/50 bg-white px-3.5 py-2.5 shadow-[0_0_40px_-10px_rgba(46,230,214,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_0_60px_-8px_rgba(46,230,214,0.9)] md:w-full md:p-3.5">
                    <img
                      src={data.profile.logoImage}
                      alt={data.profile.logoAlt}
                      width={220}
                      height={220}
                      className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24 md:h-28"
                    />
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <div className="inline-flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/15 px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-brand-soft shadow-[0_0_20px_-5px_rgba(46,230,214,0.45)] sm:px-3 sm:py-1 sm:text-[0.68rem] sm:tracking-[0.16em]">
                      <span
                        className="animate-pulse-dot size-1.5 rounded-full bg-brand"
                        aria-hidden="true"
                      />
                      Esporte • Tecnologia • Vida Real
                    </span>
                  </div>

                  <h1 className="display-title mt-3 text-3xl text-white sm:mt-4 sm:text-4xl lg:text-5xl">
                    {data.profile.heroTitle}
                  </h1>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#c2d0d6] sm:mt-3 sm:text-base">
                    {data.profile.introText}
                  </p>

                  <div className="mt-5 grid grid-cols-5 gap-1.5 sm:mt-6 sm:gap-3">
                    <a
                      href={data.contact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackGibaz4Event("instagram", "Instagram @gibaz4 (Ícone do Topo)")}
                      aria-label="Instagram @gibaz4"
                      className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/12 bg-white/[0.03] px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#E1306C]/70 hover:bg-[#E1306C]/10 hover:shadow-[0_12px_30px_-10px_rgba(225,48,108,0.6)] sm:gap-2 sm:px-2 sm:py-3.5"
                    >
                      <span
                        className="grid size-11 place-items-center rounded-xl text-white shadow-[0_8px_22px_-6px_rgba(225,48,108,0.75)] transition-transform duration-300 group-hover:scale-110 sm:size-13 sm:rounded-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                        }}
                      >
                        <InstagramSvg className="size-6 sm:size-7" />
                      </span>
                      <span className="text-[0.62rem] font-bold leading-tight text-white group-hover:text-[#ff9ec0] sm:text-xs">
                        Instagram
                      </span>
                    </a>

                    <a
                      href={data.contact.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackGibaz4Event("tiktok", "TikTok @gibaaz4 (Ícone do Topo)")}
                      aria-label="TikTok @gibaaz4"
                      className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/12 bg-white/[0.03] px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#00f2fe]/70 hover:bg-[#00f2fe]/10 hover:shadow-[0_12px_30px_-10px_rgba(0,242,254,0.55)] sm:gap-2 sm:px-2 sm:py-3.5"
                    >
                      <span
                        className="grid size-11 place-items-center rounded-xl border border-white/15 bg-[#08090c] text-white shadow-[0_8px_22px_-6px_rgba(0,242,254,0.6)] transition-transform duration-300 group-hover:scale-110 sm:size-13 sm:rounded-2xl"
                        style={{
                          boxShadow:
                            "-2px -2px 10px -2px rgba(0,242,254,0.55), 2px 2px 10px -2px rgba(254,44,85,0.65)",
                        }}
                      >
                        <TikTokSvg className="size-6 sm:size-7" />
                      </span>
                      <span className="text-[0.62rem] font-bold leading-tight text-white group-hover:text-[#00f2fe] sm:text-xs">
                        TikTok
                      </span>
                    </a>

                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackGibaz4Event("whatsapp_hero", "WhatsApp (Ícone do Topo)")}
                        aria-label="Falar no WhatsApp"
                        className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#25D366]/35 bg-[#25D366]/[0.06] px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#25D366] hover:bg-[#25D366]/15 hover:shadow-[0_12px_30px_-10px_rgba(37,211,102,0.65)] sm:gap-2 sm:px-2 sm:py-3.5"
                      >
                        <span className="relative grid size-11 place-items-center rounded-xl bg-[#25D366] text-[#04140a] shadow-[0_8px_22px_-6px_rgba(37,211,102,0.85)] transition-transform duration-300 group-hover:scale-110 sm:size-13 sm:rounded-2xl">
                          <span
                            className="pointer-events-none absolute -right-1 -top-1 flex size-3"
                            aria-hidden="true"
                          >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                            <span className="relative inline-flex size-3 rounded-full border-2 border-[#0a0f12] bg-[#25D366]" />
                          </span>
                          <WhatsAppSvg className="size-6 sm:size-7" />
                        </span>
                        <span className="text-[0.62rem] font-bold leading-tight text-white group-hover:text-[#69f09c] sm:text-xs">
                          WhatsApp
                        </span>
                      </a>
                    ) : null}

                    <a
                      href={data.profile.personalYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackGibaz4Event("youtube_gibaz4", "YouTube gibaz4 (Ícone do Topo)")
                      }
                      aria-label="Canal do YouTube gibaz4"
                      className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/12 bg-white/[0.03] px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#FF0000]/70 hover:bg-[#FF0000]/10 hover:shadow-[0_12px_30px_-10px_rgba(255,0,0,0.6)] sm:gap-2 sm:px-2 sm:py-3.5"
                    >
                      <span className="grid size-11 place-items-center rounded-xl bg-[#FF0000] text-white shadow-[0_8px_22px_-6px_rgba(255,0,0,0.8)] transition-transform duration-300 group-hover:scale-110 sm:size-13 sm:rounded-2xl">
                        <YouTubeSvg className="size-6 sm:size-7" />
                      </span>
                      <span className="text-[0.62rem] font-bold leading-tight text-white group-hover:text-[#ff8080] sm:text-xs">
                        gibaz4
                      </span>
                    </a>

                    <a
                      href={data.profile.podcastYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackGibaz4Event(
                          "youtube_podcast",
                          "YouTube Giba Podcast (Ícone do Topo)"
                        )
                      }
                      aria-label="Canal do YouTube Giba Podcast"
                      className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-brand/35 bg-brand/[0.06] px-1 py-2.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand/15 hover:shadow-[0_12px_30px_-10px_rgba(46,230,214,0.6)] sm:gap-2 sm:px-2 sm:py-3.5"
                    >
                      <span className="relative grid size-11 place-items-center rounded-xl bg-[#FF0000] text-white shadow-[0_8px_22px_-6px_rgba(255,0,0,0.8)] ring-2 ring-brand/60 transition-transform duration-300 group-hover:scale-110 sm:size-13 sm:rounded-2xl">
                        <YouTubeSvg className="size-6 sm:size-7" />
                      </span>
                      <span className="text-[0.6rem] font-bold leading-tight text-brand-soft group-hover:text-white sm:text-xs">
                        Giba Podcast
                      </span>
                    </a>
                  </div>

                  <nav
                    aria-label="Menus principais da página"
                    className="mt-5 border-t border-white/10 pt-4 text-left"
                  >
                    <p className="mb-2.5 text-center text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand md:text-left">
                      Menu de acesso rápido
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      <a
                        href="#downloads"
                        onClick={() =>
                          trackGibaz4Event("video_peso_ideal", "Menu Rápido: Vídeo Peso Ideal")
                        }
                        className="group flex items-center justify-between gap-2 rounded-xl border border-brand/40 bg-brand/[0.08] px-2.5 py-2 transition hover:border-brand hover:bg-brand/15 sm:px-3 sm:py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand text-[#031110] sm:size-8">
                            <Play className="size-3.5 fill-current" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate text-[0.7rem] font-bold leading-tight text-white sm:text-xs">
                              Peso Ideal
                            </span>
                            <span className="block truncate text-[0.6rem] text-brand-soft">
                              Vídeo explicativo
                            </span>
                          </div>
                        </div>
                        <ArrowDown className="size-3.5 shrink-0 text-brand" />
                      </a>

                      <a
                        href="#catalogo"
                        onClick={() =>
                          trackGibaz4Event(
                            "menu_recomendacoes",
                            "Menu Rápido: Catálogo de Produtos (#catalogo)"
                          )
                        }
                        className="group flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-2.5 py-2 transition hover:border-brand/50 hover:bg-white/[0.06] sm:px-3 sm:py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand sm:size-8">
                            <ShoppingBag className="size-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate text-[0.7rem] font-semibold leading-tight text-white sm:text-xs">
                              Catálogo
                            </span>
                            <span className="block truncate text-[0.6rem] text-[#8ba0a8]">
                              Produtos que indico
                            </span>
                          </div>
                        </div>
                        <ArrowDown className="size-3.5 shrink-0 text-[#8ba0a8] group-hover:text-brand" />
                      </a>

                      <a
                        href={data.profile.podcastSiteUrl}
                        onClick={() =>
                          trackGibaz4Event("site_podcast", "Menu Rápido: Site Giba Podcast")
                        }
                        className="group flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-2.5 py-2 transition hover:border-brand/50 hover:bg-white/[0.06] sm:px-3 sm:py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand sm:size-8">
                            <Mic className="size-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate text-[0.7rem] font-semibold leading-tight text-white sm:text-xs">
                              Giba Podcast
                            </span>
                            <span className="block truncate text-[0.6rem] text-[#8ba0a8]">
                              Site oficial
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="size-3.5 shrink-0 text-[#8ba0a8] group-hover:text-brand" />
                      </a>

                      <a
                        href="#social"
                        onClick={() =>
                          trackGibaz4Event("menu_social", "Menu Rápido: ONGs que Ajudo (#social)")
                        }
                        className="group flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-2.5 py-2 transition hover:border-brand/50 hover:bg-white/[0.06] sm:px-3 sm:py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand sm:size-8">
                            <HeartHandshake className="size-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate text-[0.7rem] font-semibold leading-tight text-white sm:text-xs">
                              ONGs
                            </span>
                            <span className="block truncate text-[0.6rem] text-[#8ba0a8]">
                              Projetos sociais
                            </span>
                          </div>
                        </div>
                        <ArrowDown className="size-3.5 shrink-0 text-[#8ba0a8] group-hover:text-brand" />
                      </a>

                      <a
                        href="#downloads"
                        onClick={() =>
                          trackGibaz4Event(
                            "menu_materiais",
                            "Menu Rápido: Materiais e Planilhas (#downloads)"
                          )
                        }
                        className="group flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-2.5 py-2 transition hover:border-brand/50 hover:bg-white/[0.06] sm:px-3 sm:py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand sm:size-8">
                            <FileSpreadsheet className="size-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate text-[0.7rem] font-semibold leading-tight text-white sm:text-xs">
                              Materiais
                            </span>
                            <span className="block truncate text-[0.6rem] text-[#8ba0a8]">
                              Vídeos e planilhas
                            </span>
                          </div>
                        </div>
                        <ArrowDown className="size-3.5 shrink-0 text-[#8ba0a8] group-hover:text-brand" />
                      </a>

                      {whatsappUrl ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackGibaz4Event("whatsapp_contact", "Menu Rápido: WhatsApp")
                          }
                          className="group flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-2.5 py-2 transition hover:border-brand/50 hover:bg-white/[0.06] sm:px-3 sm:py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand sm:size-8">
                              <MessageCircle className="size-3.5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <span className="block truncate text-[0.7rem] font-semibold leading-tight text-white sm:text-xs">
                                WhatsApp
                              </span>
                              <span className="block truncate text-[0.6rem] text-[#8ba0a8]">
                                Fale comigo
                              </span>
                            </div>
                          </div>
                          <ArrowUpRight className="size-3.5 shrink-0 text-[#8ba0a8] group-hover:text-brand" />
                        </a>
                      ) : null}
                    </div>
                  </nav>
                </div>
              </div>

              <div className="mt-8 flex justify-center border-t border-white/8 pt-5">
                <a
                  href="#catalogo"
                  onClick={() =>
                    trackGibaz4Event("menu_recomendacoes", "Botão: Explorar catálogo (#catalogo)")
                  }
                  className="group inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-brand/[0.07] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft transition hover:border-brand hover:bg-brand/15"
                >
                  <span>Ver produtos que eu indico</span>
                  <ArrowDown className="size-4 animate-bounce text-brand" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="catalogo" className="border-t border-white/8 py-12 sm:py-16">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="eyebrow">{data.productsSection.eyebrow}</span>
                    <h2 className="display-title mt-3 text-2xl text-white sm:text-3xl">
                      {data.productsSection.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      Produtos selecionados que ajudam no dia a dia. Toque na foto para abrir o
                      link direto.
                    </p>
                  </div>
                </div>
              </Reveal>

              <div
                className="mt-5 flex flex-wrap gap-2"
                role="tablist"
                aria-label="Menus do catálogo de produtos"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCatalogMenu === "todos"}
                  onClick={() => setSelectedCatalogMenu("todos")}
                  className={cn(
                    "min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition",
                    selectedCatalogMenu === "todos"
                      ? "border-brand bg-brand text-[#031110] shadow-[0_8px_24px_-10px_rgba(46,230,214,0.85)]"
                      : "border-white/15 bg-white/[0.03] text-[#b8c6cc] hover:border-brand/50 hover:text-white"
                  )}
                >
                  Todos
                </button>
                {CATALOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedCatalogMenu === cat.id}
                    onClick={() => setSelectedCatalogMenu(cat.id)}
                    className={cn(
                      "min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition",
                      selectedCatalogMenu === cat.id
                        ? "border-brand bg-brand text-[#031110] shadow-[0_8px_24px_-10px_rgba(46,230,214,0.85)]"
                        : "border-white/15 bg-white/[0.03] text-[#b8c6cc] hover:border-brand/50 hover:text-white"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {filteredCatalog.length > 0 ? (
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-2.5">
                  {filteredCatalog.map((product) => (
                    <CatalogProductThumb key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b1114] p-6 text-center text-sm text-[#8ba0a8]">
                  {selectedCatalogMenu === "todos" ? (
                    <>
                      Nenhum produto publicado ainda. Adicione seus links pelo{" "}
                      <a href="/gibaz4/painel" className="font-semibold text-brand hover:underline">
                        Painel @gibaz4
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Em breve novos produtos em{" "}
                      <strong className="text-white">{getCategoryLabel(selectedCatalogMenu)}</strong>.
                    </>
                  )}
                </div>
              )}

              <p className="mt-4 text-[0.72rem] text-[#7c8e95]">
                {data.productsSection.affiliateDisclosure}
              </p>
            </div>
          </div>
        </section>

        <section id="social" className="border-t border-white/8 bg-[#070b0d] py-12 sm:py-16">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="eyebrow">Compromisso social</span>
                <h2 className="display-title mt-3 text-2xl text-white sm:text-3xl">
                  ONGs que o @gibaz4 ajuda
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Toque no ícone para abrir o Instagram oficial de cada ONG.
                </p>
              </Reveal>

              {visibleOngs.length > 0 ? (
                <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-3 md:grid-cols-6">
                  {visibleOngs.map((ong) => (
                    <OngIconItem key={ong.id} ong={ong} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1114] p-6 text-center text-sm text-[#8ba0a8]">
                  Nenhuma ONG cadastrada ainda. Adicione os links do Instagram pelo{" "}
                  <a href="/gibaz4/painel" className="font-semibold text-brand hover:underline">
                    Painel @gibaz4
                  </a>
                  .
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="downloads" className="border-t border-white/8 py-12 sm:py-16">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="eyebrow">{data.materialsSection.eyebrow}</span>
                <h2 className="display-title mt-3 text-2xl text-white sm:text-3xl">
                  {data.materialsSection.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  {data.materialsSection.description}
                </p>
              </Reveal>

              <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {materials.map((mat, idx) => (
                  <Reveal key={mat.id} delay={idx * 70}>
                    <MaterialCard material={mat} />
                  </Reveal>
                ))}
              </div>

              <p className="mt-5 text-[0.72rem] leading-relaxed text-[#7c8e95]">
                {data.materialsSection.generalHealthNotice}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#040607] py-12 pb-28 sm:pb-12">
        <div className="container-x">
          <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <img
                src={data.profile.logoImage}
                alt={data.profile.logoAlt}
                width={64}
                height={64}
                loading="lazy"
                className="size-16 rounded-2xl border-2 border-brand/40 bg-white object-contain p-1.5 shadow-[0_0_25px_-6px_rgba(46,230,214,0.45)]"
              />
              <div>
                <p className="text-base font-semibold text-white">
                  {data.profile.displayName} • {data.profile.handle}
                </p>
                <p className="mt-0.5 text-xs text-[#7c8e95]">
                  © {year} Giba Podcast. Todos os direitos reservados.
                </p>
              </div>
            </div>

            <nav aria-label="Links institucionais do Giba Podcast">
              <ul className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#a8b8be]">
                <li>
                  <a
                    href="/"
                    onClick={() => trackGibaz4Event("site_podcast", "Início do Podcast (Rodapé)")}
                    className="transition hover:text-brand"
                  >
                    Início do Podcast
                  </a>
                </li>
                <li>
                  <a href="/#episodios" className="transition hover:text-brand">
                    Episódios
                  </a>
                </li>
                <li>
                  <a href="/#convidados" className="transition hover:text-brand">
                    Convidados
                  </a>
                </li>
                <li>
                  <a href="/#patrocinio" className="transition hover:text-brand">
                    Patrocínio
                  </a>
                </li>
                <li>
                  <a
                    href="/gibaz4/painel"
                    className="text-[#7c8e95] transition hover:text-brand"
                  >
                    Painel @gibaz4
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Voltar ao topo da página"
          title="Voltar ao topo"
          className={cn(
            "group flex size-12 items-center justify-center rounded-full border border-brand/50 bg-[#091316]/90 text-brand shadow-[0_10px_30px_-5px_rgba(46,230,214,0.45)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-[#031110]",
            showBackTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          )}
        >
          <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackGibaz4Event("whatsapp_floating", "WhatsApp (Ícone Flutuante Pulsante)")
            }
            aria-label="Falar com Gilmar diretamente pelo WhatsApp"
            title="Chamar no WhatsApp agora"
            className="group relative flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 text-[#04140a] shadow-[0_0_35px_rgba(37,211,102,0.75)] transition-transform duration-300 hover:scale-105 sm:px-4 sm:py-3.5"
          >
            <span
              className="pointer-events-none absolute -inset-1.5 animate-ping rounded-full bg-[#25D366] opacity-55"
              style={{ animationDuration: "1.9s" }}
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute -inset-3 animate-pulse rounded-full bg-[#25D366]/25"
              aria-hidden="true"
            />
            <MessageCircle className="relative z-10 size-6 fill-current" aria-hidden="true" />
            <span className="relative z-10 hidden text-xs font-extrabold uppercase tracking-wider text-[#04140a] sm:inline">
              WhatsApp
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
