import type { SiteContent } from "@shared/content";
import { PlatformIcon } from "./primitives";

const LINKS = [
  { label: "Episódios", href: "#episodios" },
  { label: "Temas", href: "#temas" },
  { label: "Sobre", href: "#sobre" },
  { label: "Convidados", href: "#convidados" },
  { label: "Patrocínio", href: "#patrocinio" },
  { label: "Contato", href: "#contato" },
];

export function Footer({ content }: { content: SiteContent }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/8 bg-[#040607] pt-16">
      <div className="container-x">
        <div className="grid gap-12 pb-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <a href="#inicio" className="flex items-center gap-3">
              <img
                src={content.brand.logoUrl}
                alt={`Logotipo ${content.brand.name}`}
                className="size-12 rounded-full border border-white/15 object-cover"
                width={48}
                height={48}
                loading="lazy"
              />
              <span>
                <span className="font-display block text-xl tracking-[0.12em] text-white">
                  {content.brand.name.toUpperCase()}
                </span>
                <span className="block text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {content.brand.tagline}
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-sm font-script text-[1.5rem] leading-tight text-brand-soft">
              {content.footer.tagline}
            </p>
            <p className="mt-4 max-w-sm text-[0.85rem] leading-relaxed text-muted-foreground">
              {content.footer.note}
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#6f8088]">
              Navegue
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2.5">
              {LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-[0.88rem] text-[#b8c5ca] transition hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#6f8088]">
              Siga o podcast
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {content.social.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-white/12 text-white transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
                  aria-label={link.platform}
                  title={link.platform}
                >
                  <PlatformIcon platform={link.platform} className="size-4.5" />
                </a>
              ))}
            </div>
            <a
              href={`mailto:${content.contact.email}`}
              className="mt-5 block text-[0.85rem] text-[#b8c5ca] transition hover:text-brand"
            >
              {content.contact.email}
            </a>
            <p className="mt-1 text-[0.78rem] text-[#6f8088]">{content.brand.production}</p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/8 py-6 text-[0.75rem] text-[#6f8088] sm:flex-row sm:items-center">
          <p>
            © {year} {content.brand.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <span>Apresentação: {content.brand.presenter}</span>
            <a href="/admin" className="transition hover:text-brand">
              Área do produtor
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden">
        <p className="font-display translate-y-[22%] text-center text-[clamp(4rem,16vw,14rem)] leading-none text-white/[0.03]">
          GIBA PODCAST
        </p>
      </div>
    </footer>
  );
}
