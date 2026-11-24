import { cn } from "@/lib/utils";
import {
  GIBAZ4_CONTENT,
  buildWhatsAppLink,
  type Gibaz4Channel,
  type Gibaz4Material,
  type Gibaz4Product,
  type Gibaz4SocialProject,
  type ProductCategory,
} from "@shared/gibaz4";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Award,
  Bike,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  FileSpreadsheet,
  GraduationCap,
  HeartHandshake,
  Instagram,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  Phone,
  Play,
  ShoppingBag,
  Tag,
  X,
  Youtube,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PlatformIcon, Reveal, useSpotlight } from "@/components/site/primitives";

const ANCHOR_NAV = [
  { label: "Sobre", href: "#sobre" },
  { label: "Social", href: "#social" },
  { label: "Recomendações", href: "#recomendacoes" },
  { label: "Downloads", href: "#downloads" },
] as const;

const CURRICULUM_ICONS: Record<string, typeof Briefcase> = {
  "atuacao-profissional": Briefcase,
  "experiencias-projetos": Award,
  "formacao-estudos": GraduationCap,
  "esporte-trajetoria": Bike,
};

function upsertMetaTag(selector: string, attributes: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  const previous = el.getAttribute("content");
  Object.entries(attributes).forEach(([key, value]) => {
    el!.setAttribute(key, value);
  });
  return () => {
    if (created) {
      el?.remove();
    } else if (previous !== null) {
      el?.setAttribute("content", previous);
    }
  };
}

export default function Gibaz4() {
  const data = GIBAZ4_CONTENT;
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "Todas">("Todas");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const spotlight = useSpotlight();

  const whatsappUrl = useMemo(
    () => buildWhatsAppLink(data.contact.whatsappNumber, data.contact.whatsappInitialMessage),
    [data.contact.whatsappNumber, data.contact.whatsappInitialMessage],
  );

  const publishedChannels = useMemo(
    () => data.channels.filter(item => item.published && Boolean(item.url)),
    [data.channels],
  );

  const publishedPhotos = useMemo(
    () => data.about.historyPhotos.filter(item => item.published && Boolean(item.src)),
    [data.about.historyPhotos],
  );

  const publishedCurriculum = useMemo(
    () => data.about.curriculumBlocks.filter(item => item.published && item.items.length > 0),
    [data.about.curriculumBlocks],
  );

  const publishedSocialProjects = useMemo(
    () => data.socialProjects.filter(item => item.published),
    [data.socialProjects],
  );

  const publishedProducts = useMemo(
    () =>
      data.products.filter(
        item => item.published && Boolean(item.name) && Boolean(item.affiliateUrl),
      ),
    [data.products],
  );

  const availableCategories = useMemo(() => {
    const set = new Set<ProductCategory>();
    publishedProducts.forEach(item => set.add(item.category));
    return Array.from(set);
  }, [publishedProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todas") return publishedProducts;
    return publishedProducts.filter(item => item.category === selectedCategory);
  }, [publishedProducts, selectedCategory]);

  const hasAffiliateProducts = useMemo(
    () => publishedProducts.some(item => item.isAffiliate),
    [publishedProducts],
  );

  const publishedMaterials = useMemo(
    () => data.materials.filter(item => item.published),
    [data.materials],
  );

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setShowBackToTop(scrollTop > 260);
      setScrollProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;
    document.title = data.seo.title;
    document.documentElement.lang = "pt-BR";

    const cleanups: Array<() => void> = [
      upsertMetaTag('meta[name="description"]', {
        name: "description",
        content: data.seo.description,
      }),
      upsertMetaTag('meta[property="og:title"]', {
        property: "og:title",
        content: data.seo.title,
      }),
      upsertMetaTag('meta[property="og:description"]', {
        property: "og:description",
        content: data.seo.description,
      }),
      upsertMetaTag('meta[property="og:url"]', {
        property: "og:url",
        content: data.seo.canonicalUrl,
      }),
      upsertMetaTag('meta[property="og:image"]', {
        property: "og:image",
        content: data.seo.ogImage,
      }),
      upsertMetaTag('meta[name="twitter:title"]', {
        name: "twitter:title",
        content: data.seo.title,
      }),
      upsertMetaTag('meta[name="twitter:description"]', {
        name: "twitter:description",
        content: data.seo.description,
      }),
      upsertMetaTag('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: data.seo.ogImage,
      }),
    ];

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const createdCanonical = !canonical;
    const previousCanonicalHref = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", data.seo.canonicalUrl);

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang || "pt-BR";
      cleanups.forEach(fn => fn());
      if (createdCanonical) {
        canonical?.remove();
      } else if (previousCanonicalHref && canonical) {
        canonical.setAttribute("href", previousCanonicalHref);
      }
    };
  }, [data.seo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050708] text-[#e9eef1]">
      {/* Barra de progresso de leitura no topo */}
      <div className="fixed inset-x-0 top-0 z-[70] h-[2.5px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-brand-deep via-brand to-[#ff7a1a] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Cabeçalho compacto com logo aparente */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050708]/90 backdrop-blur-xl">
        <div className="container-x flex h-[70px] items-center justify-between gap-3">
          <a
            href="#canais"
            className="group flex items-center gap-3 rounded-full py-1 pr-2 focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Descer para os canais de Gilmar (@gibaz4)"
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

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Seções da página de Gilmar"
          >
            {ANCHOR_NAV.map(item => (
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
              onClick={() => setMenuOpen(prev => !prev)}
              aria-expanded={menuOpen}
              aria-controls="gibaz4-mobile-nav"
              aria-label={menuOpen ? "Fechar menu de seções" : "Abrir menu de seções"}
              className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-brand/60 hover:text-brand md:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile compacto */}
        {menuOpen ? (
          <nav
            id="gibaz4-mobile-nav"
            aria-label="Menu mobile de seções"
            className="border-t border-white/10 bg-[#080c0e] px-5 py-4 md:hidden"
          >
            <ul className="grid grid-cols-2 gap-2">
              {ANCHOR_NAV.map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
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
        {/* 4. Apresentação Inicial (Hero com efeitos visuais e logo oficial em destaque) */}
        <section className="relative isolate overflow-hidden pb-14 pt-8 sm:py-16 lg:py-20">
          {/* Efeitos especiais de iluminação de fundo */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute inset-0 grid-lines opacity-55" />
            <div className="animate-glow absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]" />
            <div className="animate-float-slow absolute -right-32 top-1/3 size-[360px] rounded-full bg-[#ff7a1a]/10 blur-[130px]" />
          </div>

          <div className="container-x">
            <div
              {...spotlight}
              className="card-surface spotlight mx-auto max-w-4xl rounded-3xl border border-white/12 bg-[#0a0f12]/90 p-6 shadow-[0_30px_90px_-28px_rgba(46,230,214,0.28)] sm:p-8 lg:p-10"
            >
              <div className="grid items-center gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] lg:gap-10">
                {/* Coluna da Foto principal (compacta no celular e focada no rosto) + Logo oficial */}
                <div className="mx-auto flex w-full flex-row items-center justify-center gap-4 md:flex-col">
                  {/* Foto principal menor no celular e focada no rosto */}
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

                  {/* Card do Logo Oficial em destaque — clicável para descer a página */}
                  <a
                    href="#sobre"
                    aria-label="Logo Oficial Gilmar Belarmino — clique para conhecer a trajetória"
                    className="group relative flex flex-col items-center overflow-hidden rounded-2xl border-2 border-brand/50 bg-white px-3.5 py-2.5 shadow-[0_0_40px_-10px_rgba(46,230,214,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_0_60px_-8px_rgba(46,230,214,0.9)] md:w-full md:p-3.5"
                  >
                    <img
                      src={data.profile.logoImage}
                      alt={data.profile.logoAlt}
                      width={220}
                      height={220}
                      className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24 md:h-28"
                    />
                    <span className="mt-1 inline-flex items-center gap-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#0b2530] transition-colors group-hover:text-[#0f8f88]">
                      Minha história
                      <ChevronDown className="size-3.5 animate-bounce" aria-hidden="true" />
                    </span>
                  </a>
                </div>

                {/* Identificação e Botões Principais */}
                <div className="text-center md:text-left">
                  <div className="inline-flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-soft shadow-[0_0_25px_-5px_rgba(46,230,214,0.5)]">
                      <span className="animate-pulse-dot size-2 rounded-full bg-brand" aria-hidden="true" />
                      Esporte • Tecnologia • Vida Real
                    </span>
                  </div>

                  <h1 className="display-title mt-4 text-3xl text-white sm:text-4xl lg:text-5xl">
                    {data.profile.heroTitle}
                  </h1>

                  <p className="mt-3 text-sm leading-relaxed text-[#c2d0d6] sm:text-base">
                    {data.profile.introText}
                  </p>

                  {/* Botões para os principais destinos */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <a
                      href={data.profile.podcastYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary min-h-[48px] w-full justify-center text-sm sm:text-base"
                    >
                      <Play className="size-4 fill-current" aria-hidden="true" />
                      Assistir ao Giba Podcast
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>

                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn min-h-[48px] w-full justify-center border border-[#25D366]/60 bg-[#25D366]/15 text-sm font-semibold text-white shadow-[0_0_30px_-10px_rgba(37,211,102,0.7)] transition hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-[#04140a] sm:text-base"
                      >
                        <span className="relative flex size-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
                          <span className="relative inline-flex size-3 rounded-full bg-[#25D366]" />
                        </span>
                        <MessageCircle className="size-4" aria-hidden="true" />
                        Falar comigo no WhatsApp
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ) : null}

                    {data.contact.instagramUrl ? (
                      <a
                        href={data.contact.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost min-h-[48px] w-full justify-center text-sm sm:text-base"
                      >
                        <Instagram className="size-4 text-brand" aria-hidden="true" />
                        Instagram (@gibaz4)
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ) : null}

                    <a
                      href="https://www.youtube.com/watch?v=m75KthGtZs4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost min-h-[48px] w-full justify-center border-brand/40 bg-brand/[0.07] text-sm text-brand-soft hover:bg-brand/15 sm:text-base"
                    >
                      <Play className="size-4 text-brand" aria-hidden="true" />
                      Calcular seu peso ideal
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>

                  {/* Atalhos rápidos por âncora */}
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-5 md:justify-start">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a8c94]">
                      Explorar:
                    </span>
                    <a
                      href="#canais"
                      className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#d0dce0] transition hover:border-brand/50 hover:text-brand-soft"
                    >
                      Canais
                    </a>
                    {ANCHOR_NAV.map(item => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#d0dce0] transition hover:border-brand/50 hover:text-brand-soft"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão central para descer a tela suavemente */}
              <div className="mt-8 flex justify-center border-t border-white/8 pt-5">
                <a
                  href="#canais"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-brand/[0.07] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft transition hover:border-brand hover:bg-brand/15"
                >
                  <span>Role ou clique para explorar a página</span>
                  <ArrowDown className="size-4 animate-bounce text-brand" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Canais e Conteúdos */}
        <section id="canais" className="border-t border-white/8 py-14 sm:py-16">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="eyebrow">Onde me encontrar</span>
                <h2 className="display-title mt-3 text-2xl text-white sm:text-3xl">
                  Acompanhe meus canais
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Conteúdos em vídeo, conversas completas e bastidores da rotina.
                </p>
              </Reveal>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {publishedChannels.map((channel, index) => (
                  <Reveal
                    key={channel.id}
                    delay={index * 80}
                    className={cn(channel.featured && "sm:col-span-2")}
                  >
                    <ChannelCard channel={channel} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Sobre Gilmar e Mini Currículo */}
        <section id="sobre" className="border-t border-white/8 bg-[#070b0d] py-14 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <span className="eyebrow">{data.about.eyebrow}</span>
                    <h2 className="display-title mt-3 text-2xl text-white sm:text-4xl">
                      {data.about.title}
                    </h2>
                  </div>
                  <img
                    src={data.profile.logoImage}
                    alt={data.profile.logoAlt}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-20 w-auto rounded-2xl border-2 border-brand/40 bg-white p-2 object-contain shadow-[0_0_30px_-8px_rgba(46,230,214,0.5)]"
                  />
                </div>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-[#c2cfd4]">
                  {data.about.summaryParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              {/* Mini currículo em blocos curtos */}
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {publishedCurriculum.map((block, index) => {
                  const Icon = CURRICULUM_ICONS[block.id] ?? CheckCircle2;
                  return (
                    <Reveal key={block.id} delay={index * 70}>
                      <article
                        {...spotlight}
                        className="card-surface spotlight h-full rounded-2xl border border-white/10 bg-[#0b1114] p-6"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <h3 className="text-lg font-semibold text-white">{block.title}</h3>
                        </div>
                        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#b2c1c7]">
                          {block.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    </Reveal>
                  );
                })}
              </div>

              {/* Registros reais da trajetória */}
              {publishedPhotos.length > 0 ? (
                <div className="mt-12">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                    Registros da caminhada
                  </h3>
                  <div className="mt-5 grid gap-5 sm:grid-cols-3">
                    {publishedPhotos.map((photo, index) => (
                      <Reveal key={photo.id} delay={index * 90}>
                        <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1114] transition hover:border-brand/40">
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050708]">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              width={photo.width}
                              height={photo.height}
                              loading="lazy"
                              className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                          <figcaption className="p-4 text-xs leading-relaxed text-[#b2c1c7]">
                            {photo.caption}
                          </figcaption>
                        </figure>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* 7. Participação em Trabalhos Sociais */}
        <section id="social" className="border-t border-white/8 py-14 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="eyebrow">{data.socialProjectsSection.eyebrow}</span>
                <h2 className="display-title mt-3 text-2xl text-white sm:text-4xl">
                  {data.socialProjectsSection.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {data.socialProjectsSection.description}
                </p>
              </Reveal>

              <div className="mt-8 grid gap-6">
                {publishedSocialProjects.map((project, index) => (
                  <Reveal key={project.id} delay={index * 90}>
                    <SocialProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Produtos que Gilmar Indica */}
        <section id="recomendacoes" className="border-t border-white/8 bg-[#070b0d] py-14 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="eyebrow">{data.productsSection.eyebrow}</span>
                <h2 className="display-title mt-3 text-2xl text-white sm:text-4xl">
                  {data.productsSection.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {data.productsSection.description}
                </p>
              </Reveal>

              {hasAffiliateProducts ? (
                <p className="mt-4 rounded-xl border border-brand/25 bg-brand/[0.05] px-4 py-3 text-xs leading-relaxed text-[#c6d5da]">
                  {data.productsSection.affiliateDisclosure}
                </p>
              ) : null}

              {availableCategories.length > 1 ? (
                <div
                  className="mt-6 flex flex-wrap gap-2"
                  role="tablist"
                  aria-label="Filtrar produtos por categoria"
                >
                  {(["Todas", ...availableCategories] as const).map(category => (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "min-h-[40px] rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
                        selectedCategory === category
                          ? "border-brand bg-brand text-[#031110]"
                          : "border-white/15 bg-white/[0.03] text-[#b8c6cc] hover:border-white/30 hover:text-white",
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : null}

              {filteredProducts.length > 0 ? (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priceNote={data.productsSection.priceNote}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b1114] p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
                      <ShoppingBag className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Lista de indicações em atualização
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#a8b8be]">
                        As recomendações de equipamentos para esporte, tecnologia e leitura na
                        Shopee e no Mercado Livre estão sendo selecionadas e serão publicadas aqui
                        com seus links diretos.
                      </p>
                      <p className="mt-3 text-xs text-[#7c8e95]">
                        {data.productsSection.affiliateDisclosure}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 9. Materiais Digitais e Downloads */}
        <section id="downloads" className="border-t border-white/8 py-14 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <span className="eyebrow">{data.materialsSection.eyebrow}</span>
                <h2 className="display-title mt-3 text-2xl text-white sm:text-4xl">
                  {data.materialsSection.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {data.materialsSection.description}
                </p>
              </Reveal>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {publishedMaterials.map((material, index) => (
                  <Reveal key={material.id} delay={index * 80}>
                    <MaterialCard material={material} />
                  </Reveal>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-[#0a1013] p-5 text-xs leading-relaxed text-[#9eb0b7]">
                {data.materialsSection.generalHealthNotice}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Contato Final */}
        <section id="contato" className="border-t border-white/8 bg-[#070b0d] py-14 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#0b1114] p-6 sm:p-10">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <span className="eyebrow">Conexão direta</span>
                  <h2 className="display-title mt-3 text-2xl text-white sm:text-4xl">
                    Vamos conversar?
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#b8c6cc] sm:text-base">
                    Para convites, parcerias, sugestões de pauta para o Giba Podcast ou troca de
                    ideias, escolha o canal de sua preferência.
                  </p>
                </div>
                <img
                  src={data.profile.logoImage}
                  alt={data.profile.logoAlt}
                  width={88}
                  height={88}
                  loading="lazy"
                  className="h-20 w-auto shrink-0 rounded-2xl border-2 border-brand/40 bg-white p-2 object-contain shadow-[0_0_30px_-8px_rgba(46,230,214,0.5)]"
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn min-h-[48px] bg-[#25D366] text-[#04140a] shadow-[0_0_30px_-8px_rgba(37,211,102,0.8)] hover:bg-[#3bf07c]"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Chamar no WhatsApp
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}

                {data.contact.phoneForCalls ? (
                  <a
                    href={`tel:${data.contact.phoneForCalls.replace(/\s+/g, "")}`}
                    className="btn btn-ghost min-h-[48px]"
                  >
                    <Phone className="size-4 text-brand" aria-hidden="true" />
                    Ligar
                  </a>
                ) : null}

                {data.contact.instagramUrl ? (
                  <a
                    href={data.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost min-h-[48px]"
                  >
                    <Instagram className="size-4 text-brand" aria-hidden="true" />
                    Instagram (@gibaz4)
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}

                {data.contact.tiktokUrl ? (
                  <a
                    href={data.contact.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost min-h-[48px]"
                  >
                    <PlatformIcon platform="TikTok" className="size-4 text-brand" />
                    TikTok
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}

                <a
                  href={data.contact.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost min-h-[48px]"
                >
                  <Youtube className="size-4 text-brand" aria-hidden="true" />
                  YouTube (Giba Podcast)
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>

                {data.contact.email ? (
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="btn btn-ghost min-h-[48px]"
                  >
                    <Mail className="size-4 text-brand" aria-hidden="true" />
                    {data.contact.email}
                  </a>
                ) : null}

                <a href={data.profile.podcastSiteUrl} className="btn btn-ghost min-h-[48px]">
                  <Mic className="size-4 text-brand" aria-hidden="true" />
                  Site do Giba Podcast
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé com Logo Oficial mais aparente */}
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
                  © {currentYear} Giba Podcast. Todos os direitos reservados.
                </p>
              </div>
            </div>

            <nav aria-label="Links institucionais do Giba Podcast">
              <ul className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#a8b8be]">
                <li>
                  <a href="/" className="transition hover:text-brand">
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
                  <a href="/#contato" className="transition hover:text-brand">
                    Contato do Podcast
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>

      {/* Botões flutuantes fixos: Subir ao topo + WhatsApp Pulsando */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
        {/* Ícone para voltar ao topo ao descer a tela */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Voltar ao topo da página"
          title="Voltar ao topo"
          className={cn(
            "group flex size-12 items-center justify-center rounded-full border border-brand/50 bg-[#091316]/90 text-brand shadow-[0_10px_30px_-5px_rgba(46,230,214,0.45)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-[#031110]",
            showBackToTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0",
          )}
        >
          <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>

        {/* Ícone do WhatsApp pulsando para clicar direto */}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com Gilmar diretamente pelo WhatsApp"
            title="Chamar no WhatsApp agora"
            className="group relative flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 text-[#04140a] shadow-[0_0_35px_rgba(37,211,102,0.75)] transition-transform duration-300 hover:scale-105 sm:px-4 sm:py-3.5"
          >
            {/* Ondas pulsantes ao redor do botão */}
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

function ChannelCard({ channel }: { channel: Gibaz4Channel }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col justify-between rounded-2xl border p-6 transition",
        channel.featured
          ? "border-brand/40 bg-gradient-to-br from-brand/[0.09] via-[#0b1214] to-[#080d0f]"
          : "border-white/10 bg-[#0b1114] hover:border-brand/35",
      )}
    >
      <div>
        <div className="flex items-center gap-3.5">
          {channel.image ? (
            <img
              src={channel.image}
              alt={channel.name}
              width={48}
              height={48}
              loading="lazy"
              className="size-12 shrink-0 rounded-full border border-white/15 object-cover object-top"
            />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand">
              <PlatformIcon platform={channel.platform} className="size-5" />
            </span>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
              {channel.featured ? (
                <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-soft">
                  Canal principal
                </span>
              ) : null}
            </div>
            {channel.handle ? (
              <p className="text-xs font-medium text-[#8ba0a8]">{channel.handle}</p>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#b8c6cc]">{channel.description}</p>
      </div>

      <div className="mt-6">
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "btn min-h-[46px] w-full justify-center text-sm sm:w-auto",
            channel.featured ? "btn-primary" : "btn-ghost",
          )}
        >
          <PlatformIcon platform={channel.platform} className="size-4" />
          {channel.ctaLabel}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function SocialProjectCard({ project }: { project: Gibaz4SocialProject }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1114] transition hover:border-brand/35">
      <div className={cn("grid gap-6 p-6 sm:p-7", project.image && "md:grid-cols-[240px_1fr]")}>
        {project.image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#050708]">
            <img
              src={project.image}
              alt={project.imageAlt || project.name}
              width={540}
              height={405}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        ) : null}

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-soft">
                <HeartHandshake className="size-3.5" aria-hidden="true" />
                {project.roleType}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-semibold text-white">{project.name}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[#c2cfd4]">{project.description}</p>

            <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                Forma de participação
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#b2c1c7]">
                {project.participationDetails}
              </p>
            </div>
          </div>

          {project.officialUrl || project.helpUrl ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {project.officialUrl ? (
                <a
                  href={project.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost min-h-[44px] text-xs sm:text-sm"
                >
                  Conhecer o projeto
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
              {project.helpUrl ? (
                <a
                  href={project.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary min-h-[44px] text-xs sm:text-sm"
                >
                  {project.helpText || "Como apoiar oficialmente"}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProductCard({ product, priceNote }: { product: Gibaz4Product; priceNote: string }) {
  const buttonLabel =
    product.platform === "Shopee" ? "Ver na Shopee" : "Ver no Mercado Livre";

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0b1114] transition hover:border-brand/35">
      <div>
        <div className="relative aspect-square w-full overflow-hidden bg-[#050708]">
          <img
            src={product.image}
            alt={product.imageAlt || product.name}
            width={480}
            height={480}
            loading="lazy"
            className="size-full object-contain p-4"
          />
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
            {product.platform}
          </span>
        </div>

        <div className="p-5">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand">
            <Tag className="size-3" aria-hidden="true" />
            {product.category}
          </span>
          <h3 className="mt-1.5 text-base font-semibold text-white">{product.name}</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#b2c1c7]">{product.reason}</p>
        </div>
      </div>

      <div className="border-t border-white/8 p-5 pt-4">
        <p className="mb-3 text-xs font-medium text-[#8ba0a8]">{priceNote}</p>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel={product.isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
          className="btn btn-primary min-h-[44px] w-full justify-center text-xs sm:text-sm"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          {buttonLabel}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function MaterialCard({ material }: { material: Gibaz4Material }) {
  const isAvailable =
    material.status === "available" && Boolean(material.downloadOrPurchaseUrl);
  const isVideo = material.format.toLowerCase().includes("vídeo");
  const isSpreadsheet = material.format.toLowerCase().includes("planilha");
  const Icon = isVideo ? Play : isSpreadsheet ? FileSpreadsheet : BookOpen;

  return (
    <article
      className={cn(
        "flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0b1114] transition hover:border-brand/45",
        isAvailable ? "border-brand/40 shadow-[0_0_35px_-14px_rgba(46,230,214,0.4)]" : "border-white/10",
      )}
    >
      <div>
        {material.coverImage ? (
          <a
            href={isAvailable ? material.downloadOrPurchaseUrl : undefined}
            target={isAvailable ? "_blank" : undefined}
            rel={isAvailable ? "noopener noreferrer" : undefined}
            className="group relative block aspect-video w-full overflow-hidden bg-[#050708]"
          >
            <img
              src={material.coverImage}
              alt={material.title}
              width={480}
              height={360}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand bg-black/70 text-brand shadow-[0_0_25px_rgba(46,230,214,0.8)] transition group-hover:scale-110 group-hover:bg-brand group-hover:text-[#031110]">
              <Play className="size-5 translate-x-0.5 fill-current" aria-hidden="true" />
            </span>
          </a>
        ) : null}

        <div className="p-6 pb-0">
          <div className="flex items-center justify-between gap-2">
            <span className="grid size-10 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
              <Icon className="size-4.5" aria-hidden="true" />
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#c2cfd4]">
                {material.format}
              </span>
              {material.accessType ? (
                <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-brand-soft">
                  {material.accessType}
                </span>
              ) : null}
            </div>
          </div>

          <h3 className="mt-4 text-base font-semibold leading-snug text-white">
            {material.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#b2c1c7]">{material.description}</p>

          {material.healthDisclaimer ? (
            <p className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 text-[0.72rem] leading-relaxed text-[#8fa2a9]">
              {material.healthDisclaimer}
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-6 pt-5">
        {isAvailable ? (
          <a
            href={material.downloadOrPurchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary min-h-[44px] w-full justify-center text-xs sm:text-sm"
          >
            {isVideo ? (
              <Play className="size-4 fill-current" aria-hidden="true" />
            ) : (
              <Download className="size-4" aria-hidden="true" />
            )}
            {material.ctaLabel || "Acessar material"}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ) : (
          <div
            aria-disabled="true"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#8ba0a8]"
          >
            <Clock className="size-3.5 text-brand" aria-hidden="true" />
            Em breve
          </div>
        )}
      </div>
    </article>
  );
}
