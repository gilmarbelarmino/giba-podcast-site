import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Star, Trash2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Episode, Guest, SiteContent } from "@shared/content";
import { AdminSection, Checkbox, Field, SelectField, TextArea } from "./FormFields";

type TabProps = {
  draft: SiteContent;
  setDraft: Dispatch<SetStateAction<SiteContent>>;
};

const CATEGORY_OPTIONS = [
  { value: "Vida Real", label: "Vida Real" },
  { value: "Tecnologia", label: "Tecnologia" },
  { value: "Esporte e Qualidade de Vida", label: "Esporte e Qualidade de Vida" },
];

const TYPE_OPTIONS = [
  { value: "Episódio", label: "Episódio" },
  { value: "Corte", label: "Corte" },
  { value: "Ao vivo", label: "Ao vivo" },
];

const SOCIAL_OPTIONS = [
  "YouTube",
  "Instagram",
  "Spotify",
  "TikTok",
  "LinkedIn",
  "Apple Podcasts",
  "WhatsApp",
].map(value => ({ value, label: value }));

/* ------------------------------------------------------------------ */
/* Textos                                                              */
/* ------------------------------------------------------------------ */

export function TextsTab({ draft, setDraft }: TabProps) {
  const update = <K extends keyof SiteContent>(key: K, patch: Partial<SiteContent[K]>) =>
    setDraft(current => ({ ...current, [key]: { ...current[key], ...patch } }));

  return (
    <div className="flex flex-col gap-5">
      <AdminSection title="Marca" description="Nome, assinatura e links principais do podcast.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" value={draft.brand.name} onChange={v => update("brand", { name: v })} />
          <Field label="Assinatura / mote" value={draft.brand.tagline} onChange={v => update("brand", { tagline: v })} />
          <Field label="Apresentador" value={draft.brand.presenter} onChange={v => update("brand", { presenter: v })} />
          <Field label="Produção" value={draft.brand.production} onChange={v => update("brand", { production: v })} />
          <Field label="Link do YouTube" value={draft.brand.youtubeUrl} onChange={v => update("brand", { youtubeUrl: v })} />
          <Field
            label="Logotipo (URL)"
            value={draft.brand.logoUrl}
            onChange={v => update("brand", { logoUrl: v })}
            hint="Use /assets/logo-giba.png ou a URL de uma imagem enviada."
          />
        </div>
      </AdminSection>

      <AdminSection title="Abertura (hero)" description="O primeiro bloco que o visitante vê.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta" value={draft.hero.eyebrow} onChange={v => update("hero", { eyebrow: v })} />
          <Field label="Selo" value={draft.hero.badge} onChange={v => update("hero", { badge: v })} />
          <Field label="Título" value={draft.hero.headline} onChange={v => update("hero", { headline: v })} className="sm:col-span-2" />
          <Field
            label="Destaque (letra cursiva)"
            value={draft.hero.highlight}
            onChange={v => update("hero", { highlight: v })}
          />
          <Field label="Imagem (URL)" value={draft.hero.image} onChange={v => update("hero", { image: v })} />
          <TextArea
            label="Descrição"
            className="sm:col-span-2"
            value={draft.hero.description}
            onChange={v => update("hero", { description: v })}
          />
          <Field label="Botão principal" value={draft.hero.primaryCtaLabel} onChange={v => update("hero", { primaryCtaLabel: v })} />
          <Field label="Link do botão principal" value={draft.hero.primaryCtaHref} onChange={v => update("hero", { primaryCtaHref: v })} />
          <Field label="Botão secundário" value={draft.hero.secondaryCtaLabel} onChange={v => update("hero", { secondaryCtaLabel: v })} />
          <Field label="Link do botão secundário" value={draft.hero.secondaryCtaHref} onChange={v => update("hero", { secondaryCtaHref: v })} />
        </div>
      </AdminSection>

      <AdminSection title="Faixa de temas" description="Palavras que correm na faixa animada abaixo da abertura.">
        <TextArea
          label="Temas (um por linha)"
          rows={5}
          value={draft.marquee.join("\n")}
          onChange={v =>
            setDraft(current => ({
              ...current,
              marquee: v.split("\n").map(item => item.trim()).filter(Boolean),
            }))
          }
        />
      </AdminSection>

      <AdminSection title="Sobre o podcast">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta" value={draft.about.eyebrow} onChange={v => update("about", { eyebrow: v })} />
          <Field label="Título" value={draft.about.title} onChange={v => update("about", { title: v })} />
          <TextArea
            label="Parágrafos (separe com uma linha em branco)"
            className="sm:col-span-2"
            rows={7}
            value={draft.about.paragraphs.join("\n\n")}
            onChange={v =>
              update("about", {
                paragraphs: v.split(/\n\s*\n/).map(item => item.trim()).filter(Boolean),
              })
            }
          />
          <Field label="Frase de destaque" value={draft.about.quote} onChange={v => update("about", { quote: v })} className="sm:col-span-2" />
          <Field label="Foto (URL)" value={draft.about.image} onChange={v => update("about", { image: v })} />
          <Field label="Nome do apresentador" value={draft.about.founderName} onChange={v => update("about", { founderName: v })} />
          <Field label="Cargo do apresentador" value={draft.about.founderRole} onChange={v => update("about", { founderRole: v })} />
          <Field label="Nome da produção" value={draft.about.productionName} onChange={v => update("about", { productionName: v })} />
          <TextArea label="Bio do apresentador" value={draft.about.founderBio} onChange={v => update("about", { founderBio: v })} />
          <TextArea label="Bio da produção" value={draft.about.productionBio} onChange={v => update("about", { productionBio: v })} />
        </div>
      </AdminSection>

      <AdminSection title="Patrocínio">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta" value={draft.sponsorship.eyebrow} onChange={v => update("sponsorship", { eyebrow: v })} />
          <Field label="Título" value={draft.sponsorship.title} onChange={v => update("sponsorship", { title: v })} />
          <TextArea
            label="Descrição"
            className="sm:col-span-2"
            value={draft.sponsorship.description}
            onChange={v => update("sponsorship", { description: v })}
          />
          <Field label="Botão" value={draft.sponsorship.ctaLabel} onChange={v => update("sponsorship", { ctaLabel: v })} />
          <Field label="Link do botão" value={draft.sponsorship.ctaHref} onChange={v => update("sponsorship", { ctaHref: v })} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {draft.sponsorship.tiers.map((tier, index) => (
            <div key={tier.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <Field label={`Formato ${index + 1}`} value={tier.name} onChange={v => {
                const tiers = draft.sponsorship.tiers.map(t => (t.id === tier.id ? { ...t, name: v } : t));
                update("sponsorship", { tiers });
              }} />
              <Field
                label="Chamada curta"
                className="mt-3"
                value={tier.tagline}
                onChange={v => {
                  const tiers = draft.sponsorship.tiers.map(t => (t.id === tier.id ? { ...t, tagline: v } : t));
                  update("sponsorship", { tiers });
                }}
              />
              <TextArea
                label="Entregas (uma por linha)"
                className="mt-3"
                rows={4}
                value={tier.features.join("\n")}
                onChange={v => {
                  const tiers = draft.sponsorship.tiers.map(t =>
                    t.id === tier.id
                      ? { ...t, features: v.split("\n").map(item => item.trim()).filter(Boolean) }
                      : t,
                  );
                  update("sponsorship", { tiers });
                }}
              />
              <div className="mt-3">
                <Checkbox
                  label="Destacar este formato"
                  checked={tier.highlight}
                  onChange={checked => {
                    const tiers = draft.sponsorship.tiers.map(t => ({ ...t, highlight: t.id === tier.id ? checked : false }));
                    update("sponsorship", { tiers });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Contato e newsletter">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta" value={draft.contact.eyebrow} onChange={v => update("contact", { eyebrow: v })} />
          <Field label="Título" value={draft.contact.title} onChange={v => update("contact", { title: v })} />
          <TextArea
            label="Descrição"
            className="sm:col-span-2"
            value={draft.contact.description}
            onChange={v => update("contact", { description: v })}
          />
          <Field label="E-mail" value={draft.contact.email} onChange={v => update("contact", { email: v })} />
          <Field label="WhatsApp (só números)" value={draft.contact.whatsapp} onChange={v => update("contact", { whatsapp: v })} />
          <Field label="Local" value={draft.contact.location} onChange={v => update("contact", { location: v })} />
          <TextArea
            label="Assuntos (um por linha)"
            rows={5}
            value={draft.contact.subjects.join("\n")}
            onChange={v =>
              update("contact", {
                subjects: v.split("\n").map(item => item.trim()).filter(Boolean),
              })
            }
          />
          <Field label="Título da newsletter" value={draft.newsletter.title} onChange={v => update("newsletter", { title: v })} />
          <Field label="Mensagem de sucesso" value={draft.newsletter.successMessage} onChange={v => update("newsletter", { successMessage: v })} />
          <TextArea
            label="Descrição da newsletter"
            className="sm:col-span-2"
            value={draft.newsletter.description}
            onChange={v => update("newsletter", { description: v })}
          />
          <Field label="Frase do rodapé" value={draft.footer.tagline} onChange={v => update("footer", { tagline: v })} />
          <Field label="Nota do rodapé" value={draft.footer.note} onChange={v => update("footer", { note: v })} />
        </div>
      </AdminSection>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Episódios                                                           */
/* ------------------------------------------------------------------ */

export function EpisodesTab({ draft, setDraft }: TabProps) {
  const [openId, setOpenId] = useState<string | null>(draft.episodes[0]?.id ?? null);

  const patchEpisode = (id: string, patch: Partial<Episode>) =>
    setDraft(current => ({
      ...current,
      episodes: current.episodes.map(episode => (episode.id === id ? { ...episode, ...patch } : episode)),
    }));

  const removeEpisode = (id: string) =>
    setDraft(current => ({ ...current, episodes: current.episodes.filter(episode => episode.id !== id) }));

  const addEpisode = () => {
    const id = `ep-${Date.now()}`;
    const newEpisode: Episode = {
      id,
      title: "Novo episódio",
      guest: "",
      date: new Date().toISOString().slice(0, 10),
      duration: "",
      category: "Vida Real",
      youtubeId: "",
      description: "",
      type: "Episódio",
      featured: false,
    };
    setDraft(current => ({ ...current, episodes: [newEpisode, ...current.episodes] }));
    setOpenId(id);
  };

  const setFeatured = (id: string) =>
    setDraft(current => ({
      ...current,
      episodes: current.episodes.map(episode => ({ ...episode, featured: episode.id === id })),
    }));

  return (
    <AdminSection
      title="Episódios"
      description="Cole o ID do vídeo do YouTube (o trecho depois de watch?v=) para que o player funcione no site."
      action={
        <button type="button" onClick={addEpisode} className="btn btn-primary h-10 px-4 text-[0.8rem]">
          <Plus className="size-4" />
          Novo episódio
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        {draft.episodes.map((episode, index) => {
          const open = openId === episode.id;
          return (
            <div key={episode.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3 p-3">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : episode.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                  aria-expanded={open}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-[0.7rem] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9rem] font-medium text-white">
                      {episode.title || "Sem título"}
                    </span>
                    <span className="block text-[0.7rem] uppercase tracking-[0.12em] text-[#6f8088]">
                      {episode.type} · {episode.category} · {episode.date}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeatured(episode.id)}
                  className={cn(
                    "grid size-9 place-items-center rounded-lg border transition",
                    episode.featured
                      ? "border-brand bg-brand/15 text-brand"
                      : "border-white/10 text-[#6f8088] hover:text-white",
                  )}
                  title="Usar como destaque"
                  aria-label="Usar como destaque"
                >
                  <Star className={cn("size-4", episode.featured && "fill-current")} />
                </button>
                <button
                  type="button"
                  onClick={() => removeEpisode(episode.id)}
                  className="grid size-9 place-items-center rounded-lg border border-white/10 text-[#6f8088] transition hover:border-red-400/50 hover:text-red-400"
                  aria-label="Remover episódio"
                >
                  <Trash2 className="size-4" />
                </button>
                <ChevronDown
                  className={cn("size-4 text-[#6f8088] transition-transform", open && "rotate-180")}
                  aria-hidden="true"
                />
              </div>

              {open ? (
                <div className="grid gap-4 border-t border-white/8 p-4 sm:grid-cols-2">
                  <Field label="Título" className="sm:col-span-2" value={episode.title} onChange={v => patchEpisode(episode.id, { title: v })} />
                  <Field label="Convidado" value={episode.guest} onChange={v => patchEpisode(episode.id, { guest: v })} />
                  <Field label="ID do vídeo no YouTube" value={episode.youtubeId} onChange={v => patchEpisode(episode.id, { youtubeId: v.trim() })} hint="Ex.: _TjWFs-ZnjM" />
                  <Field label="Data" type="date" value={episode.date} onChange={v => patchEpisode(episode.id, { date: v })} />
                  <Field label="Duração / etiqueta" value={episode.duration} onChange={v => patchEpisode(episode.id, { duration: v })} />
                  <SelectField label="Tipo" value={episode.type} options={TYPE_OPTIONS} onChange={v => patchEpisode(episode.id, { type: v as Episode["type"] })} />
                  <SelectField label="Pilar" value={episode.category} options={CATEGORY_OPTIONS} onChange={v => patchEpisode(episode.id, { category: v as Episode["category"] })} />
                  <TextArea
                    label="Descrição"
                    className="sm:col-span-2"
                    value={episode.description}
                    onChange={v => patchEpisode(episode.id, { description: v })}
                  />
                  <div className="sm:col-span-2">
                    <Checkbox
                      label="Episódio em destaque"
                      hint="Aparece no bloco grande da seção de episódios."
                      checked={episode.featured}
                      onChange={() => setFeatured(episode.id)}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AdminSection>
  );
}

/* ------------------------------------------------------------------ */
/* Convidados                                                          */
/* ------------------------------------------------------------------ */

export function GuestsTab({ draft, setDraft }: TabProps) {
  const patchGuest = (id: string, patch: Partial<Guest>) =>
    setDraft(current => ({
      ...current,
      guests: current.guests.map(guest => (guest.id === id ? { ...guest, ...patch } : guest)),
    }));

  const episodeOptions = [
    { value: "", label: "Sem episódio relacionado" },
    ...draft.episodes.map(episode => ({ value: episode.id, label: episode.title })),
  ];

  return (
    <AdminSection
      title="Convidados"
      description="A foto é opcional: sem foto, o site usa a capa do episódio relacionado."
      action={
        <button
          type="button"
          onClick={() =>
            setDraft(current => ({
              ...current,
              guests: [
                ...current.guests,
                { id: `guest-${Date.now()}`, name: "Novo convidado", role: "", photo: "", episodeId: "" },
              ],
            }))
          }
          className="btn btn-primary h-10 px-4 text-[0.8rem]"
        >
          <Plus className="size-4" />
          Adicionar convidado
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {draft.guests.map(guest => (
          <div key={guest.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand">Convidado</span>
              <button
                type="button"
                onClick={() =>
                  setDraft(current => ({ ...current, guests: current.guests.filter(item => item.id !== guest.id) }))
                }
                className="text-[#6f8088] transition hover:text-red-400"
                aria-label="Remover convidado"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              <Field label="Nome" value={guest.name} onChange={v => patchGuest(guest.id, { name: v })} />
              <Field label="Descrição curta" value={guest.role} onChange={v => patchGuest(guest.id, { role: v })} />
              <Field label="Foto (URL)" value={guest.photo} onChange={v => patchGuest(guest.id, { photo: v })} />
              <SelectField
                label="Episódio"
                value={guest.episodeId}
                options={episodeOptions}
                onChange={v => patchGuest(guest.id, { episodeId: v })}
              />
            </div>
          </div>
        ))}
      </div>
      {draft.guests.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum convidado cadastrado ainda.</p>
      ) : null}
    </AdminSection>
  );
}

/* ------------------------------------------------------------------ */
/* Números                                                             */
/* ------------------------------------------------------------------ */

export function StatsTab({ draft, setDraft }: TabProps) {
  return (
    <AdminSection
      title="Números do canal"
      description="Aparecem no hero e na faixa de indicadores. Use textos como “1,11 mi” ou “100%”."
      action={
        <button
          type="button"
          onClick={() =>
            setDraft(current => ({
              ...current,
              stats: [...current.stats, { id: `stat-${Date.now()}`, value: "0", label: "novo indicador" }],
            }))
          }
          className="btn btn-primary h-10 px-4 text-[0.8rem]"
        >
          <Plus className="size-4" />
          Adicionar
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {draft.stats.map(stat => (
          <div key={stat.id} className="flex items-end gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <Field
              label="Valor"
              className="w-32"
              value={stat.value}
              onChange={v =>
                setDraft(current => ({
                  ...current,
                  stats: current.stats.map(item => (item.id === stat.id ? { ...item, value: v } : item)),
                }))
              }
            />
            <Field
              label="Rótulo"
              className="flex-1"
              value={stat.label}
              onChange={v =>
                setDraft(current => ({
                  ...current,
                  stats: current.stats.map(item => (item.id === stat.id ? { ...item, label: v } : item)),
                }))
              }
            />
            <button
              type="button"
              onClick={() => setDraft(current => ({ ...current, stats: current.stats.filter(item => item.id !== stat.id) }))}
              className="mb-1 grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-[#6f8088] transition hover:text-red-400"
              aria-label="Remover indicador"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}

/* ------------------------------------------------------------------ */
/* Redes                                                               */
/* ------------------------------------------------------------------ */

export function SocialTab({ draft, setDraft }: TabProps) {
  return (
    <AdminSection
      title="Redes sociais"
      description="Os links aparecem no contato e no rodapé. Deixe apenas os perfis que existem."
      action={
        <button
          type="button"
          onClick={() =>
            setDraft(current => ({
              ...current,
              social: [...current.social, { id: `social-${Date.now()}`, platform: "Instagram", url: "" }],
            }))
          }
          className="btn btn-primary h-10 px-4 text-[0.8rem]"
        >
          <Plus className="size-4" />
          Adicionar rede
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        {draft.social.map(link => (
          <div key={link.id} className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <SelectField
              label="Rede"
              className="w-44"
              value={link.platform}
              options={SOCIAL_OPTIONS}
              onChange={v =>
                setDraft(current => ({
                  ...current,
                  social: current.social.map(item => (item.id === link.id ? { ...item, platform: v as typeof item.platform } : item)),
                }))
              }
            />
            <Field
              label="URL"
              className="min-w-[240px] flex-1"
              value={link.url}
              onChange={v =>
                setDraft(current => ({
                  ...current,
                  social: current.social.map(item => (item.id === link.id ? { ...item, url: v } : item)),
                }))
              }
            />
            <button
              type="button"
              onClick={() => setDraft(current => ({ ...current, social: current.social.filter(item => item.id !== link.id) }))}
              className="mb-1 grid size-9 place-items-center rounded-lg border border-white/10 text-[#6f8088] transition hover:text-red-400"
              aria-label="Remover rede"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}
