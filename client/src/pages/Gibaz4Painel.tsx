import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Award,
  ChartColumn,
  Clock,
  Compass,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  HeartHandshake,
  Instagram,
  Link2,
  LoaderCircle,
  Lock,
  Mail,
  MessageCircle,
  Mic,
  Monitor,
  MousePointerClick,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Share2,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trash2,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { GIBAZ4_CONTENT } from "@shared/gibaz4";
import {
  CATALOG_CATEGORIES,
  defaultCatalogProducts,
  fetchProductFromLink,
  getCategoryLabel,
  getFirstProductName,
  loadCatalogProducts,
  saveCatalogProducts,
  type CatalogCategory,
  type CatalogProduct,
} from "@/lib/catalogApi";
import {
  defaultOngs,
  extractInstagramHandle,
  fetchOngFromInstagram,
  getFirstOngName,
  loadOngs,
  normalizeInstagramUrl,
  saveOngs,
  type OngItem,
} from "@/lib/ongsApi";
import {
  fetchGibaz4Stats,
  resetGibaz4Stats,
  type Gibaz4StatsData,
} from "@/lib/gibaz4Analytics";
import { cn } from "@/lib/utils";

const UNLOCK_KEY = "gibaz4_painel_unlocked_v1";
const VALID_PINS = ["giba2026", "1234"];

function CatalogManager() {
  const [products, setProducts] = useState<CatalogProduct[]>(defaultCatalogProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState<CatalogCategory>("naturais");
  const [listFilter, setListFilter] = useState<"todos" | CatalogCategory>("todos");
  const [url, setUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [shortName, setShortName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchHint, setFetchHint] = useState("");

  useEffect(() => {
    loadCatalogProducts().then((items) => setProducts(items));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setUrl("");
    setFullName("");
    setShortName("");
    setPrice("");
    setImage("");
    setFetchHint("");
  };

  const handleFetchFromLink = async (rawUrl?: string) => {
    const target = (rawUrl ?? url).trim();
    if (!target || target.length < 8) return;
    setFetching(true);
    setFetchHint("");
    try {
      const res = await fetchProductFromLink(target);
      if (res.ok) {
        if (res.fullName) setFullName(res.fullName);
        if (res.shortName) setShortName(res.shortName);
        else if (res.fullName) setShortName(getFirstProductName(res.fullName));
        if (res.price) setPrice(res.price);
        if (res.image) setImage(res.image);

        if (res.partial) {
          setFetchHint(
            "Alguns dados não foram liberados pela loja automaticamente — complete o que faltou abaixo."
          );
          toast.info("Busca parcial concluída. Confira ou complete os campos.");
        } else {
          setFetchHint("Foto, primeiro nome e valor preenchidos automaticamente!");
          toast.success("Informações do produto carregadas automaticamente!");
        }
      } else {
        setFetchHint(res.error || "Não foi possível buscar automaticamente. Preencha abaixo.");
        toast.error(res.error || "Não foi possível ler o link automaticamente.");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      toast.error("Cole o link do produto.");
      return;
    }
    const normalizedUrl = /^https?:\/\//i.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`;
    const finalShort = shortName.trim() || getFirstProductName(fullName.trim()) || "Produto";
    const finalFull = fullName.trim() || finalShort;
    const finalPrice = price.trim();

    setSaving(true);
    try {
      let next: CatalogProduct[];
      if (editingId) {
        next = products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                category,
                url: normalizedUrl,
                fullName: finalFull,
                shortName: finalShort,
                price: finalPrice,
                image: image.trim(),
                isPlaceholder: false,
                published: true,
              }
            : p
        );
      } else {
        const newItem: CatalogProduct = {
          id: `prod-${Date.now()}`,
          category,
          url: normalizedUrl,
          fullName: finalFull,
          shortName: finalShort,
          price: finalPrice,
          image: image.trim(),
          published: true,
          isPlaceholder: false,
        };
        next = [...products, newItem];
      }

      setProducts(next);
      await saveCatalogProducts(next);
      toast.success(
        editingId
          ? `Produto atualizado em ${getCategoryLabel(category)}!`
          : `Produto adicionado em ${getCategoryLabel(category)}!`
      );
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: CatalogProduct) => {
    setEditingId(p.id);
    setCategory(p.category || "acessorios");
    setUrl(p.isPlaceholder ? "" : p.url);
    setFullName(p.fullName);
    setShortName(p.shortName);
    setPrice(p.price);
    setImage(p.image);
    setFetchHint(
      p.isPlaceholder
        ? "Cole o link real do seu produto abaixo para puxar foto, nome e valor automaticamente."
        : ""
    );
  };

  const handleDelete = async (id: string) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    await saveCatalogProducts(next);
    if (editingId === id) resetForm();
    toast.success("Produto removido do catálogo.");
  };

  const handleClearPlaceholders = async () => {
    const next = products.filter((p) => !p.isPlaceholder);
    setProducts(next);
    await saveCatalogProducts(next);
    toast.success("Exemplos removidos. Agora cadastre seus produtos reais!");
  };

  const hasPlaceholders = products.some((p) => p.isPlaceholder);
  const filteredProducts =
    listFilter === "todos" ? products : products.filter((p) => p.category === listFilter);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-brand/30 bg-[#0b1114] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
              <ShoppingBag className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Editar produto do catálogo" : "Adicionar produto por menu"}
              </h2>
              <p className="text-xs text-[#8ba0a8]">
                Escolha o menu (Naturais, Suplementos, Bikes ou Acessórios) e cole o link para
                buscar foto, primeiro nome e valor automaticamente.
              </p>
            </div>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#b8c6cc] hover:border-brand/50 hover:text-white"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSaveProduct} className="mt-6 grid gap-6 lg:grid-cols-[1fr_210px]">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand">
                1. Escolha o menu do produto
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATALOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition",
                      category === cat.id
                        ? "border-brand bg-brand text-[#031110] shadow-[0_8px_20px_-8px_rgba(46,230,214,0.85)]"
                        : "border-white/15 bg-white/[0.03] text-[#c2cfd4] hover:border-brand/50 hover:text-white"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand">
                2. Link do produto
              </label>
              <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand/70" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text").trim();
                      if (pasted && /^https?:\/\//i.test(pasted)) {
                        setTimeout(() => handleFetchFromLink(pasted), 60);
                      }
                    }}
                    placeholder="https://www.mercadolivre.com.br/..."
                    className="field pl-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleFetchFromLink()}
                  disabled={fetching || !url.trim()}
                  className="btn btn-primary h-auto shrink-0 px-4 py-2.5 text-xs disabled:opacity-50"
                >
                  {fetching ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {fetching ? "Buscando..." : "Buscar automático"}
                </button>
              </div>
              {fetchHint ? <p className="mt-1.5 text-xs text-brand-soft">{fetchHint}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-[#c2cfd4]">
                  Primeiro nome (exibido)
                </label>
                <input
                  type="text"
                  required
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Ex.: Garrafa"
                  className="field mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#c2cfd4]">Valor (R$)</label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex.: R$ 89,90"
                  className="field mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#c2cfd4]">
                  Nome completo (tooltip)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (!shortName) setShortName(getFirstProductName(e.target.value));
                  }}
                  placeholder="Nome completo opcional"
                  className="field mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#c2cfd4]">
                URL da foto (preenchida automaticamente)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... (opcional se quiser colar imagem manual)"
                className="field mt-1"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary h-11 px-6 text-xs sm:text-sm"
              >
                <Plus className="size-4" />
                {editingId ? "Salvar alterações" : "Adicionar ao catálogo"}
              </button>
              <a href="/gibaz4#catalogo" className="btn btn-ghost h-11 px-5 text-xs sm:text-sm">
                Ver como ficou em /gibaz4
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#070b0d] p-4">
            <span className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#8ba0a8]">
              Prévia da miniatura
            </span>
            <span className="mb-3 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-brand-soft">
              {getCategoryLabel(category)}
            </span>
            <div className="w-[140px] overflow-hidden rounded-xl border border-brand/40 bg-[#0b1114]">
              <div className="aspect-square w-full overflow-hidden bg-[#06090b]">
                {image ? (
                  <img
                    src={image}
                    alt={shortName || "Prévia"}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-1 text-[#6f858d]">
                    <ShoppingBag className="size-7 text-brand/60" />
                    <span className="text-[0.6rem]">Sem foto</span>
                  </div>
                )}
              </div>
              <div className="px-2 py-2 text-center">
                <p className="truncate text-xs font-bold text-white">
                  {shortName || getFirstProductName(fullName) || "Produto"}
                </p>
                <p className="mt-0.5 text-xs font-extrabold text-brand">{price || "R$ 0,00"}</p>
              </div>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              Produtos no catálogo ({products.length})
            </h2>
            <p className="text-xs text-[#8ba0a8]">
              Aparecem em miniaturas compactas logo abaixo do topo em /gibaz4
            </p>
          </div>
          {hasPlaceholders ? (
            <button
              type="button"
              onClick={handleClearPlaceholders}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-[#ff9f7a] transition hover:border-[#ff7a1a]/60"
            >
              <Trash2 className="size-3.5" />
              Limpar itens de exemplo
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setListFilter("todos")}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              listFilter === "todos"
                ? "border-brand bg-brand text-[#031110]"
                : "border-white/15 bg-white/[0.03] text-[#c2cfd4] hover:border-brand/50"
            )}
          >
            Todos ({products.length})
          </button>
          {CATALOG_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setListFilter(cat.id);
                  if (!editingId) setCategory(cat.id);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  listFilter === cat.id
                    ? "border-brand bg-brand text-[#031110]"
                    : "border-white/15 bg-white/[0.03] text-[#c2cfd4] hover:border-brand/50"
                )}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-[#8ba0a8]">
            Nenhum produto cadastrado neste menu ainda. Cole um link acima para adicionar!
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex flex-col overflow-hidden rounded-xl border bg-[#070b0d]",
                  p.isPlaceholder ? "border-dashed border-amber-400/40" : "border-white/12"
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#050708]">
                  {p.image ? (
                    <img src={p.image} alt={p.fullName} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-1 text-[#6f858d]">
                      <ShoppingBag className="size-6 text-brand/60" />
                      <span className="text-[0.6rem]">
                        {p.isPlaceholder ? "Exemplo" : "Sem foto"}
                      </span>
                    </div>
                  )}
                  <span className="absolute right-1.5 top-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase text-brand-soft backdrop-blur">
                    {getCategoryLabel(p.category)}
                  </span>
                  {p.isPlaceholder ? (
                    <span className="absolute left-1.5 top-1.5 rounded bg-amber-400/90 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase text-black">
                      Exemplo
                    </span>
                  ) : null}
                </div>
                <div className="px-2 py-2 text-center">
                  <p className="truncate text-xs font-bold text-white" title={p.fullName}>
                    {p.shortName || getFirstProductName(p.fullName)}
                  </p>
                  <p className="mt-0.5 text-xs font-extrabold text-brand">{p.price}</p>
                </div>
                <div className="mt-auto flex items-center justify-center gap-1 border-t border-white/8 p-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(p)}
                    title="Editar"
                    className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-[#b8c6cc] hover:bg-brand/20 hover:text-brand"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir link"
                    className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-[#b8c6cc] hover:bg-brand/20 hover:text-brand"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    title="Remover"
                    className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-[#b8c6cc] hover:bg-[#ff5d5d]/20 hover:text-[#ff7878]"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OngsManager() {
  const [ongs, setOngs] = useState<OngItem[]>(defaultOngs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [handle, setHandle] = useState("");
  const [fullName, setFullName] = useState("");
  const [shortName, setShortName] = useState("");
  const [logo, setLogo] = useState("");
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchHint, setFetchHint] = useState("");

  useEffect(() => {
    loadOngs().then((items) => setOngs(items));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setInstagramUrl("");
    setHandle("");
    setFullName("");
    setShortName("");
    setLogo("");
    setFetchHint("");
  };

  const handleFetchInstagram = async (rawInput?: string) => {
    const target = (rawInput ?? instagramUrl).trim();
    if (!target || target.length < 3) return;
    setFetching(true);
    setFetchHint("");
    try {
      const res = await fetchOngFromInstagram(target);
      if (res.ok) {
        if (res.instagramUrl) setInstagramUrl(res.instagramUrl);
        if (res.handle) setHandle(res.handle);
        if (res.fullName) setFullName(res.fullName);
        if (res.shortName) setShortName(res.shortName);
        else if (res.fullName) setShortName(getFirstOngName(res.fullName));
        if (res.logo) setLogo(res.logo);

        if (res.partial) {
          setFetchHint(
            "O Instagram limitou o carregamento automático da foto deste perfil — você pode colar a URL do logo ou ajustar o primeiro nome abaixo."
          );
          toast.info("Perfil identificado! Complete o logo se necessário.");
        } else {
          setFetchHint("Logo, primeiro nome e link direto puxados automaticamente do Instagram!");
          toast.success("Dados da ONG carregados do Instagram!");
        }
      } else {
        const h = extractInstagramHandle(target);
        if (h) {
          setHandle(`@${h}`);
          if (!shortName) setShortName(getFirstOngName(h));
        }
        setFetchHint(res.error || "Não foi possível puxar automaticamente. Preencha abaixo.");
        toast.error(res.error || "Erro ao consultar Instagram.");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleSaveOng = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = instagramUrl.trim();
    if (!cleanInput) {
      toast.error("Cole o link do Instagram da ONG.");
      return;
    }
    const normalizedUrl = normalizeInstagramUrl(cleanInput);
    const extractedHandle =
      handle.trim() ||
      (extractInstagramHandle(cleanInput) ? `@${extractInstagramHandle(cleanInput)}` : "");
    const finalShort =
      shortName.trim() || getFirstOngName(fullName.trim() || extractedHandle) || "ONG";
    const finalFull = fullName.trim() || finalShort;

    setSaving(true);
    try {
      let next: OngItem[];
      if (editingId) {
        next = ongs.map((o) =>
          o.id === editingId
            ? {
                ...o,
                instagramUrl: normalizedUrl,
                handle: extractedHandle,
                fullName: finalFull,
                shortName: finalShort,
                logo: logo.trim(),
                published: true,
                isPlaceholder: false,
              }
            : o
        );
      } else {
        const newOng: OngItem = {
          id: `ong-${Date.now()}`,
          instagramUrl: normalizedUrl,
          handle: extractedHandle,
          fullName: finalFull,
          shortName: finalShort,
          logo: logo.trim(),
          published: true,
          isPlaceholder: false,
        };
        next = [...ongs, newOng];
      }

      setOngs(next);
      await saveOngs(next);
      toast.success(editingId ? "ONG atualizada!" : "ONG adicionada à página /gibaz4!");
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (o: OngItem) => {
    setEditingId(o.id);
    setInstagramUrl(o.isPlaceholder ? "" : o.instagramUrl);
    setHandle(o.handle);
    setFullName(o.fullName);
    setShortName(o.shortName);
    setLogo(o.logo);
    setFetchHint(
      o.isPlaceholder
        ? "Cole o link real do Instagram da ONG para puxar logo e nome automaticamente."
        : ""
    );
  };

  const handleDelete = async (id: string) => {
    const next = ongs.filter((o) => o.id !== id);
    setOngs(next);
    await saveOngs(next);
    if (editingId === id) resetForm();
    toast.success("ONG removida.");
  };

  const handleClearPlaceholders = async () => {
    const next = ongs.filter((o) => !o.isPlaceholder);
    setOngs(next);
    await saveOngs(next);
    toast.success("Exemplos removidos. Agora cadastre os Instagrams reais das ONGs!");
  };

  const hasPlaceholders = ongs.some((o) => o.isPlaceholder);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-brand/30 bg-[#0b1114] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
              <HeartHandshake className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Editar ONG" : "Adicionar ONG pelo link do Instagram"}
              </h2>
              <p className="text-xs text-[#8ba0a8]">
                Cole o link do Instagram da ONG (ou o @perfil) para puxar automaticamente o logo, o
                primeiro nome e o link direto.
              </p>
            </div>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#b8c6cc] hover:border-brand/50 hover:text-white"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSaveOng} className="mt-6 grid gap-6 lg:grid-cols-[1fr_190px]">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand">
                1. Link do Instagram da ONG (ou @perfil)
              </label>
              <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Instagram className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand/70" />
                  <input
                    type="text"
                    required
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text").trim();
                      if (pasted && (pasted.includes("instagram.com/") || pasted.startsWith("@"))) {
                        setTimeout(() => handleFetchInstagram(pasted), 60);
                      }
                    }}
                    placeholder="https://www.instagram.com/nome_da_ong/"
                    className="field pl-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleFetchInstagram()}
                  disabled={fetching || !instagramUrl.trim()}
                  className="btn btn-primary h-auto shrink-0 px-4 py-2.5 text-xs disabled:opacity-50"
                >
                  {fetching ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {fetching ? "Buscando..." : "Buscar do Instagram"}
                </button>
              </div>
              {fetchHint ? <p className="mt-1.5 text-xs text-brand-soft">{fetchHint}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-[#c2cfd4]">
                  Primeiro nome da ONG (exibido)
                </label>
                <input
                  type="text"
                  required
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Ex.: Lar"
                  className="field mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#c2cfd4]">
                  Nome completo (tooltip)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (!shortName) setShortName(getFirstOngName(e.target.value));
                  }}
                  placeholder="Ex.: Lar Nossa Senhora Aparecida"
                  className="field mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#c2cfd4]">
                URL do logo (puxado automaticamente do Instagram)
              </label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="Preenchido automaticamente ou cole um link de imagem"
                className="field mt-1"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary h-11 px-6 text-xs sm:text-sm"
              >
                <Plus className="size-4" />
                {editingId ? "Salvar alterações" : "Adicionar ONG"}
              </button>
              <a href="/gibaz4#social" className="btn btn-ghost h-11 px-5 text-xs sm:text-sm">
                Ver ícones em /gibaz4
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#070b0d] p-4">
            <span className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#8ba0a8]">
              Prévia do ícone
            </span>
            <div className="flex w-[110px] flex-col items-center gap-2 rounded-2xl border border-brand/40 bg-[#0b1114] px-2 py-3 text-center">
              <div
                className="size-16 overflow-hidden rounded-full p-[2px]"
                style={{
                  background: "linear-gradient(135deg, #2ee6d6 0%, #0f8f88 50%, #e1306c 100%)",
                }}
              >
                <div className="size-full overflow-hidden rounded-full bg-[#06090b]">
                  {logo ? (
                    <img
                      src={logo}
                      alt={shortName || "Prévia ONG"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-brand">
                      <HeartHandshake className="size-6" />
                    </div>
                  )}
                </div>
              </div>
              <p className="w-full truncate text-xs font-bold text-white">
                {shortName || getFirstOngName(fullName) || "ONG"}
              </p>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              ONGs cadastradas ({ongs.length})
            </h2>
            <p className="text-xs text-[#8ba0a8]">
              Aparecem como ícones clicáveis na seção &quot;ONGs que o @gibaz4 ajuda&quot; em
              /gibaz4
            </p>
          </div>
          {hasPlaceholders ? (
            <button
              type="button"
              onClick={handleClearPlaceholders}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-[#ff9f7a] transition hover:border-[#ff7a1a]/60"
            >
              <Trash2 className="size-3.5" />
              Limpar exemplos
            </button>
          ) : null}
        </div>

        {ongs.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-[#8ba0a8]">
            Nenhuma ONG cadastrada ainda. Cole o link do Instagram acima para adicionar!
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {ongs.map((o) => (
              <div
                key={o.id}
                className={cn(
                  "flex flex-col items-center rounded-2xl border bg-[#070b0d] p-3 text-center",
                  o.isPlaceholder ? "border-dashed border-amber-400/40" : "border-white/12"
                )}
              >
                <div className="relative size-14 overflow-hidden rounded-full border border-brand/40 bg-[#050708]">
                  {o.logo ? (
                    <img src={o.logo} alt={o.fullName} className="size-full object-cover" />
                  ) : (
                    <div className="grid size-full place-items-center text-brand/70">
                      <HeartHandshake className="size-6" />
                    </div>
                  )}
                </div>
                <p className="mt-2 w-full truncate text-xs font-bold text-white" title={o.fullName}>
                  {o.shortName || getFirstOngName(o.fullName)}
                </p>
                {o.isPlaceholder ? (
                  <span className="mt-0.5 text-[0.58rem] font-semibold uppercase text-amber-400">
                    Exemplo
                  </span>
                ) : null}
                <div className="mt-2 flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(o)}
                    title="Editar"
                    className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-[#b8c6cc] hover:bg-brand/20 hover:text-brand"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <a
                    href={o.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir Instagram"
                    className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-[#b8c6cc] hover:bg-brand/20 hover:text-brand"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(o.id)}
                    title="Remover"
                    className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-[#b8c6cc] hover:bg-[#ff5d5d]/20 hover:text-[#ff7878]"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function Gibaz4Painel() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<"catalogo" | "ongs" | "metricas">("catalogo");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [stats, setStats] = useState<Gibaz4StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [resetting, setResetting] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchGibaz4Stats();
      setStats(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Painel @gibaz4 — Catálogo, ONGs e Métricas";
    if (!unlocked) return;
    loadStats();
    const timer = window.setInterval(() => {
      fetchGibaz4Stats()
        .then((d) => setStats(d))
        .catch(() => {});
    }, 4000);
    return () => window.clearInterval(timer);
  }, [unlocked, loadStats]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pin.trim().toLowerCase();
    if (VALID_PINS.includes(cleaned)) {
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
      } catch {
        // ignore
      }
      setUnlocked(true);
      setPinError("");
    } else {
      setPinError("Senha incorreta. Digite giba2026 ou 1234.");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Tem certeza que deseja zerar todos os contadores de cliques e visitas?")) {
      return;
    }
    setResetting(true);
    try {
      const fresh = await resetGibaz4Stats("giba2026");
      setStats(fresh);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Erro ao zerar contadores.");
    } finally {
      setResetting(false);
    }
  };

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050708] px-4 py-12 text-[#e9eef1]">
        <div className="w-full max-w-md rounded-3xl border border-white/12 bg-[#0b1114] p-7 text-center shadow-[0_30px_80px_-25px_rgba(46,230,214,0.3)] sm:p-9">
          <img
            src={GIBAZ4_CONTENT.profile.logoImage}
            alt="Logo Gilmar Belarmino"
            className="mx-auto h-20 w-auto rounded-2xl border-2 border-brand/40 bg-white object-contain p-2"
          />
          <h1 className="display-title mt-5 text-2xl text-white sm:text-3xl">Painel • @gibaz4</h1>
          <p className="mt-2 text-sm text-[#9eb0b7]">
            Acesso exclusivo de Gilmar para gerenciar o catálogo de produtos, ONGs e acompanhar
            métricas da página.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-3 text-left">
            <div>
              <label
                htmlFor="pin-input"
                className="text-xs font-semibold uppercase tracking-wider text-brand"
              >
                Senha de acesso
              </label>
              <input
                id="pin-input"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Digite a senha do painel"
                className="field mt-1.5"
                autoFocus
              />
            </div>
            {pinError ? <p className="text-xs text-[#ff6b6b]">{pinError}</p> : null}
            <button type="submit" className="btn btn-primary w-full justify-center">
              <Lock className="size-4" />
              Entrar no Painel
            </button>
          </form>

          <a
            href="/gibaz4"
            className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-[#8ba0a8] hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para a página /gibaz4
          </a>
        </div>
      </div>
    );
  }

  const t = stats?.totals ?? {
    page_view: 0,
    unique_view: 0,
    whatsapp_floating: 0,
    whatsapp_hero: 0,
    whatsapp_contact: 0,
    instagram: 0,
    tiktok: 0,
    youtube_gibaz4: 0,
    youtube_podcast: 0,
    video_peso_ideal: 0,
    menu_canais: 0,
    menu_sobre: 0,
    menu_social: 0,
    menu_recomendacoes: 0,
    menu_materiais: 0,
    site_podcast: 0,
    email: 0,
    other_clicks: 0,
  };

  const views = t.page_view;
  const whatsappTotal = t.whatsapp_floating + t.whatsapp_hero + t.whatsapp_contact;
  const socialTotal = t.instagram + t.tiktok + (t.youtube_gibaz4 ?? 0) + t.youtube_podcast;
  const menuTotal =
    t.video_peso_ideal +
    (t.menu_canais ?? 0) +
    (t.menu_sobre ?? 0) +
    (t.menu_social ?? 0) +
    (t.menu_recomendacoes ?? 0) +
    (t.menu_materiais ?? 0) +
    t.site_podcast +
    t.email +
    t.other_clicks;
  const allClicks = whatsappTotal + socialTotal + menuTotal;
  const whatsappRate = views > 0 ? ((whatsappTotal / views) * 100).toFixed(1) : "0.0";
  const socialRate = views > 0 ? ((socialTotal / views) * 100).toFixed(1) : "0.0";

  const socialRows = [
    {
      id: "whatsapp_floating",
      label: "WhatsApp — Ícone Flutuante Pulsante",
      count: t.whatsapp_floating,
      color: "bg-[#25D366]",
      icon: MessageCircle,
    },
    {
      id: "whatsapp_hero",
      label: "WhatsApp — Ícone do Topo",
      count: t.whatsapp_hero,
      color: "bg-[#25D366]",
      icon: MessageCircle,
    },
    {
      id: "whatsapp_contact",
      label: "WhatsApp — Botão Menu / Contato",
      count: t.whatsapp_contact,
      color: "bg-[#25D366]",
      icon: MessageCircle,
    },
    {
      id: "instagram",
      label: "Instagram (@gibaz4)",
      count: t.instagram,
      color: "bg-[#E1306C]",
      icon: Instagram,
    },
    {
      id: "tiktok",
      label: "TikTok (@gibaaz4)",
      count: t.tiktok,
      color: "bg-[#00f2fe]",
      icon: Share2,
    },
    {
      id: "youtube_gibaz4",
      label: "YouTube — Canal gibaz4",
      count: t.youtube_gibaz4 ?? 0,
      color: "bg-[#FF0000]",
      icon: Youtube,
    },
    {
      id: "youtube_podcast",
      label: "YouTube — Giba Podcast",
      count: t.youtube_podcast,
      color: "bg-[#FF0000]",
      icon: Youtube,
    },
  ];

  const menuRows = [
    {
      id: "menu_recomendacoes",
      label: "Catálogo: Cliques nos Produtos Indicados",
      count: t.menu_recomendacoes ?? 0,
      color: "bg-[#facc15]",
      icon: ShoppingBag,
    },
    {
      id: "menu_social",
      label: "ONGs: Cliques nos Ícones de ONGs",
      count: t.menu_social ?? 0,
      color: "bg-[#34d399]",
      icon: HeartHandshake,
    },
    {
      id: "video_peso_ideal",
      label: "Vídeo: Calcular Peso Ideal",
      count: t.video_peso_ideal,
      color: "bg-brand",
      icon: Play,
    },
    {
      id: "menu_materiais",
      label: "Menu Rápido: Materiais e Planilhas",
      count: t.menu_materiais ?? 0,
      color: "bg-[#c084fc]",
      icon: FileSpreadsheet,
    },
    {
      id: "site_podcast",
      label: "Acesso ao Site Principal do Giba Podcast",
      count: t.site_podcast,
      color: "bg-[#60a5fa]",
      icon: Mic,
    },
    {
      id: "menu_sobre",
      label: "Outros Cliques Históricos",
      count: (t.menu_sobre ?? 0) + (t.menu_canais ?? 0),
      color: "bg-[#38bdf8]",
      icon: Award,
    },
    {
      id: "email",
      label: "Clique no E-mail de Contato",
      count: t.email,
      color: "bg-[#a78bfa]",
      icon: Mail,
    },
  ];

  const maxSocial = Math.max(1, ...socialRows.map((r) => r.count));
  const maxMenu = Math.max(1, ...menuRows.map((r) => r.count));
  const dailyRows = Object.entries(stats?.byDate ?? {})
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 14);

  return (
    <div className="min-h-screen bg-[#050708] pb-20 text-[#e9eef1]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050708]/90 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={GIBAZ4_CONTENT.profile.logoImage}
              alt="Logo Gilmar"
              className="size-10 rounded-xl border border-brand/40 bg-white object-contain p-0.5"
            />
            <div>
              <h1 className="text-sm font-bold text-white sm:text-base">Painel @gibaz4</h1>
              <p className="text-[0.7rem] text-[#8ba0a8]">
                Gerencie catálogo, ONGs e acompanhe as métricas da bio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadStats}
              disabled={loading}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3.5 text-xs font-semibold text-brand-soft transition hover:bg-brand hover:text-[#031110]"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <a
              href="/gibaz4"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 text-xs font-semibold text-white transition hover:border-brand/50"
            >
              <span>Ver página</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="container-x pt-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("catalogo")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm",
                activeTab === "catalogo"
                  ? "border-brand bg-brand text-[#031110]"
                  : "border-white/15 bg-white/[0.03] text-[#c2cfd4] hover:border-brand/50"
              )}
            >
              <ShoppingBag className="size-4" />
              Catálogo de Produtos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ongs")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm",
                activeTab === "ongs"
                  ? "border-brand bg-brand text-[#031110]"
                  : "border-white/15 bg-white/[0.03] text-[#c2cfd4] hover:border-brand/50"
              )}
            >
              <HeartHandshake className="size-4" />
              ONGs que Ajudo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("metricas")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm",
                activeTab === "metricas"
                  ? "border-brand bg-brand text-[#031110]"
                  : "border-white/15 bg-white/[0.03] text-[#c2cfd4] hover:border-brand/50"
              )}
            >
              <ChartColumn className="size-4" />
              Métricas de Acessos
            </button>
          </div>

          {activeTab === "catalogo" ? (
            <CatalogManager />
          ) : activeTab === "ongs" ? (
            <OngsManager />
          ) : (
            <div className="space-y-8">
              {loadError ? (
                <div className="rounded-2xl border border-[#ff5d5d]/40 bg-[#ff5d5d]/10 p-4 text-sm text-[#ffb3b3]">
                  {loadError}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <article className="rounded-2xl border border-brand/35 bg-gradient-to-br from-brand/[0.12] via-[#0b1215] to-[#080c0e] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-soft">
                      1. Acessos no Link
                    </span>
                    <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
                      <Eye className="size-5" />
                    </span>
                  </div>
                  <p className="font-display mt-3 text-4xl text-white sm:text-5xl">{views}</p>
                  <p className="mt-2 text-xs text-[#9eb0b7]">
                    Visitas em <strong className="text-white">/gibaz4</strong> ({t.unique_view}{" "}
                    únicos)
                  </p>
                </article>

                <article className="rounded-2xl border border-[#25D366]/40 bg-gradient-to-br from-[#25D366]/[0.14] via-[#0b1410] to-[#080c0e] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#69f09c]">
                      2. Cliques WhatsApp
                    </span>
                    <span className="grid size-10 place-items-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
                      <MessageCircle className="size-5" />
                    </span>
                  </div>
                  <p className="font-display mt-3 text-4xl text-white sm:text-5xl">
                    {whatsappTotal}
                  </p>
                  <p className="mt-2 text-xs text-[#9eb0b7]">
                    <strong className="text-[#69f09c]">{t.whatsapp_floating}</strong> pulsante ·{" "}
                    <strong className="text-[#69f09c]">{t.whatsapp_hero}</strong> topo · Taxa:{" "}
                    <strong className="text-white">{whatsappRate}%</strong>
                  </p>
                </article>

                <article className="rounded-2xl border border-[#E1306C]/35 bg-gradient-to-br from-[#E1306C]/[0.12] via-[#130b12] to-[#080c0e] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#ff85b1]">
                      3. Redes Sociais
                    </span>
                    <span className="grid size-10 place-items-center rounded-xl bg-[#E1306C]/20 text-[#ff6b9d]">
                      <Share2 className="size-5" />
                    </span>
                  </div>
                  <p className="font-display mt-3 text-4xl text-white sm:text-5xl">{socialTotal}</p>
                  <p className="mt-2 text-xs text-[#9eb0b7]">
                    Instagram, TikTok e 2 canais YouTube · Taxa:{" "}
                    <strong className="text-white">{socialRate}%</strong>
                  </p>
                </article>

                <article className="rounded-2xl border border-white/12 bg-[#0b1114] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#a8b8be]">
                      4. Menus & Todas Ações
                    </span>
                    <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-brand">
                      <MousePointerClick className="size-5" />
                    </span>
                  </div>
                  <p className="font-display mt-3 text-4xl text-white sm:text-5xl">{allClicks}</p>
                  <p className="mt-2 text-xs text-[#9eb0b7]">
                    <strong className="text-white">{menuTotal}</strong> cliques nos produtos, ONGs e
                    vídeo
                  </p>
                </article>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
                  <div className="flex items-center gap-2.5">
                    <ChartColumn className="size-5 text-brand" />
                    <h2 className="text-base font-semibold text-white sm:text-lg">
                      Indicadores: WhatsApp e Redes Sociais
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-[#8ba0a8]">
                    Cliques em cada um dos 5 ícones principais e botões de WhatsApp
                  </p>
                  <div className="mt-6 space-y-4">
                    {socialRows.map((row) => {
                      const Icon = row.icon;
                      const pct = Math.round((row.count / maxSocial) * 100);
                      return (
                        <div key={row.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="flex items-center gap-2 font-medium text-[#d4e0e5]">
                              <Icon className="size-4 text-brand" />
                              {row.label}
                            </span>
                            <span className="font-bold text-white">
                              {row.count} {row.count === 1 ? "clique" : "cliques"}
                            </span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                              style={{ width: `${row.count > 0 ? Math.max(6, pct) : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
                  <div className="flex items-center gap-2.5">
                    <Compass className="size-5 text-brand" />
                    <h2 className="text-base font-semibold text-white sm:text-lg">
                      Indicadores: Catálogo, ONGs e Conteúdos
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-[#8ba0a8]">
                    Cliques nos produtos indicados, ícones das ONGs e vídeo de Peso Ideal
                  </p>
                  <div className="mt-6 space-y-4">
                    {menuRows.map((row) => {
                      const Icon = row.icon;
                      const pct = Math.round((row.count / maxMenu) * 100);
                      return (
                        <div key={row.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="flex items-center gap-2 font-medium text-[#d4e0e5]">
                              <Icon className="size-4 text-brand" />
                              {row.label}
                            </span>
                            <span className="font-bold text-white">
                              {row.count} {row.count === 1 ? "clique" : "cliques"}
                            </span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                              style={{ width: `${row.count > 0 ? Math.max(6, pct) : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
                  <h2 className="text-base font-semibold text-white">
                    Origem dos acessos e Aparelhos
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#9eb0b7]">
                        <Instagram className="size-3.5 text-[#E1306C]" />
                        Instagram
                      </div>
                      <p className="font-display mt-2 text-2xl text-white">
                        {stats?.sources.instagram ?? 0}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#9eb0b7]">
                        <ExternalLink className="size-3.5 text-brand" />
                        Link Direto
                      </div>
                      <p className="font-display mt-2 text-2xl text-white">
                        {stats?.sources.direct_or_other ?? 0}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#9eb0b7]">
                        <Smartphone className="size-3.5 text-brand" />
                        Celular
                      </div>
                      <p className="font-display mt-2 text-2xl text-white">
                        {stats?.devices.mobile ?? 0}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#9eb0b7]">
                        <Monitor className="size-3.5 text-brand" />
                        Computador
                      </div>
                      <p className="font-display mt-2 text-2xl text-white">
                        {stats?.devices.desktop ?? 0}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
                  <h2 className="text-base font-semibold text-white">Movimento por dia</h2>
                  {dailyRows.length === 0 ? (
                    <p className="mt-4 text-xs text-[#8ba0a8]">
                      Os dados diários aparecerão aqui conforme os acessos acontecerem.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-2.5 text-xs">
                      {dailyRows.map(([dateKey, row]) => (
                        <div
                          key={dateKey}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5"
                        >
                          <span className="font-semibold text-white">
                            {dateKey.split("-").reverse().join("/")}
                          </span>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-brand-soft">{row.views} visitas</span>
                            <span className="text-[#69f09c]">{row.whatsapp} WhatsApp</span>
                            <span className="text-[#ff85b1]">{row.social} cliques</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Activity className="size-5 text-brand" />
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Registro ao vivo de todas as ações
                      </h2>
                      <p className="text-xs text-[#8ba0a8]">
                        Histórico das últimas 40 interações realizadas na página /gibaz4
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={resetting}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-[#9eb0b7] transition hover:border-[#ff5d5d]/50 hover:text-[#ff8080]"
                  >
                    <Trash2 className="size-3.5" />
                    Zerar contadores de teste
                  </button>
                </div>

                {!stats?.recent || stats.recent.length === 0 ? (
                  <p className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-[#8ba0a8]">
                    Nenhuma ação registrada ainda. Abra a página /gibaz4 e clique em algum botão
                    para testar!
                  </p>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[0.68rem] uppercase tracking-wider text-[#7c8e95]">
                          <th className="pb-3 pr-4">Data / Hora</th>
                          <th className="pb-3 pr-4">Ação realizada</th>
                          <th className="pb-3 pr-4">Aparelho</th>
                          <th className="pb-3">Origem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/6">
                        {stats.recent.map((item, idx) => (
                          <tr key={idx} className="text-[#c8d6dc]">
                            <td className="whitespace-nowrap py-2.5 pr-4 text-[#8ba0a8]">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="size-3 text-brand" />
                                {item.time}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4 font-medium text-white">{item.label}</td>
                            <td className="py-2.5 pr-4">{item.device}</td>
                            <td className="py-2.5">{item.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
