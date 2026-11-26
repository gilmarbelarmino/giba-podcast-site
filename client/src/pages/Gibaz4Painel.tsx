import {
  fetchGibaz4Stats,
  resetGibaz4Stats,
  type Gibaz4StatsData,
} from "@/lib/gibaz4Analytics";
import { GIBAZ4_CONTENT } from "@shared/gibaz4";
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  Clock,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  HeartHandshake,
  Instagram,
  Compass,
  Lock,
  Mail,
  MessageCircle,
  Mic,
  Monitor,
  MousePointerClick,
  Play,
  RefreshCw,
  Share2,
  ShoppingBag,
  Smartphone,
  Trash2,
  Youtube,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

const PIN_STORAGE_KEY = "gibaz4_painel_unlocked_v1";
const VALID_PINS = ["giba2026", "1234"];

export default function Gibaz4Painel() {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [stats, setStats] = useState<Gibaz4StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGibaz4Stats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Painel de Métricas @gibaz4 — Gilmar";
    if (!unlocked) return;
    loadData();
    const timer = window.setInterval(() => {
      fetchGibaz4Stats()
        .then(data => setStats(data))
        .catch(() => {
          /* silent background refresh */
        });
    }, 4000);
    return () => window.clearInterval(timer);
  }, [unlocked, loadData]);

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = pinInput.trim().toLowerCase();
    if (VALID_PINS.includes(cleaned)) {
      try {
        localStorage.setItem(PIN_STORAGE_KEY, "1");
      } catch {
        /* ignore */
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
            className="mx-auto h-20 w-auto rounded-2xl border-2 border-brand/40 bg-white p-2 object-contain"
          />
          <h1 className="display-title mt-5 text-2xl text-white sm:text-3xl">
            Painel de Métricas • @gibaz4
          </h1>
          <p className="mt-2 text-sm text-[#9eb0b7]">
            Acesso exclusivo de Gilmar para acompanhar visitas no link da bio, cliques no WhatsApp,
            redes sociais e menus da página.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-3 text-left">
            <div>
              <label htmlFor="pin-input" className="text-xs font-semibold uppercase tracking-wider text-brand">
                Senha de acesso
              </label>
              <input
                id="pin-input"
                type="password"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
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

  const totalViews = t.page_view;
  const totalWhatsapp = t.whatsapp_floating + t.whatsapp_hero + t.whatsapp_contact;
  const youtubeGibaz4Count = t.youtube_gibaz4 ?? 0;
  const menuCanaisCount = t.menu_canais ?? 0;
  const menuSobreCount = t.menu_sobre ?? 0;
  const menuSocialCount = t.menu_social ?? 0;
  const menuRecomendacoesCount = t.menu_recomendacoes ?? 0;
  const menuMateriaisCount = t.menu_materiais ?? 0;

  const totalSocialIcons = t.instagram + t.tiktok + youtubeGibaz4Count + t.youtube_podcast;
  const totalMenusAndContent =
    t.video_peso_ideal +
    menuCanaisCount +
    menuSobreCount +
    menuSocialCount +
    menuRecomendacoesCount +
    menuMateriaisCount +
    t.site_podcast +
    t.email +
    t.other_clicks;
  const totalAllClicks = totalWhatsapp + totalSocialIcons + totalMenusAndContent;

  const whatsappCtr = totalViews > 0 ? ((totalWhatsapp / totalViews) * 100).toFixed(1) : "0.0";
  const socialCtr = totalViews > 0 ? ((totalSocialIcons / totalViews) * 100).toFixed(1) : "0.0";

  const socialAndWhatsappItems = [
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
      label: "WhatsApp — Botão Seção de Contato",
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
      count: youtubeGibaz4Count,
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

  const menuAndContentItems = [
    {
      id: "video_peso_ideal",
      label: "Vídeo: Calcular Peso Ideal",
      count: t.video_peso_ideal,
      color: "bg-brand",
      icon: Play,
    },
    {
      id: "menu_sobre",
      label: "Menu / Logo: Conheça o Giba (Minha História)",
      count: menuSobreCount,
      color: "bg-[#38bdf8]",
      icon: Award,
    },
    {
      id: "menu_canais",
      label: "Menu Rápido: Meus Canais",
      count: menuCanaisCount,
      color: "bg-[#fb923c]",
      icon: Youtube,
    },
    {
      id: "menu_social",
      label: "Menu Rápido: Projetos Sociais",
      count: menuSocialCount,
      color: "bg-[#34d399]",
      icon: HeartHandshake,
    },
    {
      id: "menu_recomendacoes",
      label: "Menu Rápido: Indicações de Produtos",
      count: menuRecomendacoesCount,
      color: "bg-[#facc15]",
      icon: ShoppingBag,
    },
    {
      id: "menu_materiais",
      label: "Menu Rápido: Materiais e Planilhas",
      count: menuMateriaisCount,
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
      id: "email",
      label: "Clique no E-mail de Contato",
      count: t.email,
      color: "bg-[#a78bfa]",
      icon: Mail,
    },
  ];

  const maxSocial = Math.max(1, ...socialAndWhatsappItems.map(item => item.count));
  const maxMenu = Math.max(1, ...menuAndContentItems.map(item => item.count));
  const dailyEntries = Object.entries(stats?.byDate ?? {})
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 14);

  return (
    <div className="min-h-screen bg-[#050708] pb-20 text-[#e9eef1]">
      {/* Cabeçalho do Painel */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050708]/90 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={GIBAZ4_CONTENT.profile.logoImage}
              alt="Logo Gilmar"
              className="size-10 rounded-xl border border-brand/40 bg-white p-0.5 object-contain"
            />
            <div>
              <h1 className="text-sm font-bold text-white sm:text-base">
                Painel de Monitoramento • @gibaz4
              </h1>
              <p className="text-[0.7rem] text-[#8ba0a8]">
                Indicadores de todas as ações do link na bio (atualiza a cada 4s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3.5 text-xs font-semibold text-brand-soft transition hover:bg-brand hover:text-[#031110]"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Atualizar</span>
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

      <main className="container-x pt-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {error ? (
            <div className="rounded-2xl border border-[#ff5d5d]/40 bg-[#ff5d5d]/10 p-4 text-sm text-[#ffb3b3]">
              {error}
            </div>
          ) : null}

          {/* 4 Indicadores Principais no Topo */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Acessos no Link */}
            <article className="rounded-2xl border border-brand/35 bg-gradient-to-br from-brand/[0.12] via-[#0b1215] to-[#080c0e] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-soft">
                  1. Acessos no Link
                </span>
                <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
                  <Eye className="size-5" />
                </span>
              </div>
              <p className="font-display mt-3 text-4xl text-white sm:text-5xl">{totalViews}</p>
              <p className="mt-2 text-xs text-[#9eb0b7]">
                Visitas em <strong className="text-white">/gibaz4</strong> ({t.unique_view} únicos)
              </p>
            </article>

            {/* 2. Cliques no WhatsApp */}
            <article className="rounded-2xl border border-[#25D366]/40 bg-gradient-to-br from-[#25D366]/[0.14] via-[#0b1410] to-[#080c0e] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#69f09c]">
                  2. Cliques WhatsApp
                </span>
                <span className="grid size-10 place-items-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
                  <MessageCircle className="size-5" />
                </span>
              </div>
              <p className="font-display mt-3 text-4xl text-white sm:text-5xl">{totalWhatsapp}</p>
              <p className="mt-2 text-xs text-[#9eb0b7]">
                <strong className="text-[#69f09c]">{t.whatsapp_floating}</strong> pulsante ·{" "}
                <strong className="text-[#69f09c]">{t.whatsapp_hero}</strong> topo · Taxa:{" "}
                <strong className="text-white">{whatsappCtr}%</strong>
              </p>
            </article>

            {/* 3. Cliques nas Redes Sociais */}
            <article className="rounded-2xl border border-[#E1306C]/35 bg-gradient-to-br from-[#E1306C]/[0.12] via-[#130b12] to-[#080c0e] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#ff85b1]">
                  3. Redes Sociais
                </span>
                <span className="grid size-10 place-items-center rounded-xl bg-[#E1306C]/20 text-[#ff6b9d]">
                  <Share2 className="size-5" />
                </span>
              </div>
              <p className="font-display mt-3 text-4xl text-white sm:text-5xl">
                {totalSocialIcons}
              </p>
              <p className="mt-2 text-xs text-[#9eb0b7]">
                Instagram, TikTok e 2 canais YouTube · Taxa:{" "}
                <strong className="text-white">{socialCtr}%</strong>
              </p>
            </article>

            {/* 4. Menus Rápidos, Vídeo & Ações */}
            <article className="rounded-2xl border border-white/12 bg-[#0b1114] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#a8b8be]">
                  4. Menus & Todas Ações
                </span>
                <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-brand">
                  <MousePointerClick className="size-5" />
                </span>
              </div>
              <p className="font-display mt-3 text-4xl text-white sm:text-5xl">{totalAllClicks}</p>
              <p className="mt-2 text-xs text-[#9eb0b7]">
                <strong className="text-white">{totalMenusAndContent}</strong> cliques nos menus e
                vídeo
              </p>
            </article>
          </div>

          {/* 2 Paineis Lado a Lado: Redes Sociais + WhatsApp  E  Menus Rápidos + Conteúdos */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bloco 1: Redes Sociais e WhatsApp */}
            <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="size-5 text-brand" />
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Indicadores: WhatsApp e Redes Sociais
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#8ba0a8]">
                Cliques em cada um dos 5 ícones principais e botões de WhatsApp
              </p>

              <div className="mt-6 space-y-4">
                {socialAndWhatsappItems.map(item => {
                  const Icon = item.icon;
                  const widthPct = Math.round((item.count / maxSocial) * 100);
                  return (
                    <div key={item.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="flex items-center gap-2 font-medium text-[#d4e0e5]">
                          <Icon className="size-4 text-brand" />
                          {item.label}
                        </span>
                        <span className="font-bold text-white">
                          {item.count} {item.count === 1 ? "clique" : "cliques"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${item.count > 0 ? Math.max(6, widthPct) : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bloco 2: Menu de Acesso Rápido, Vídeo Peso Ideal e Seções da Página */}
            <section className="rounded-2xl border border-white/10 bg-[#0b1114] p-6">
              <div className="flex items-center gap-2.5">
                <Compass className="size-5 text-brand" />
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Indicadores: Menu de Acesso Rápido e Conteúdos
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#8ba0a8]">
                Cliques no vídeo de Peso Ideal, logo Minha História, menus e seções
              </p>

              <div className="mt-6 space-y-4">
                {menuAndContentItems.map(item => {
                  const Icon = item.icon;
                  const widthPct = Math.round((item.count / maxMenu) * 100);
                  return (
                    <div key={item.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="flex items-center gap-2 font-medium text-[#d4e0e5]">
                          <Icon className="size-4 text-brand" />
                          {item.label}
                        </span>
                        <span className="font-bold text-white">
                          {item.count} {item.count === 1 ? "clique" : "cliques"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${item.count > 0 ? Math.max(6, widthPct) : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Origem dos visitantes, Aparelhos e Movimento por Dia */}
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
              {dailyEntries.length === 0 ? (
                <p className="mt-4 text-xs text-[#8ba0a8]">
                  Os dados diários aparecerão aqui conforme os acessos acontecerem.
                </p>
              ) : (
                <div className="mt-4 space-y-2.5 text-xs">
                  {dailyEntries.map(([date, counts]) => (
                    <div
                      key={date}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5"
                    >
                      <span className="font-semibold text-white">
                        {date.split("-").reverse().join("/")}
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-brand-soft">{counts.views} visitas</span>
                        <span className="text-[#69f09c]">{counts.whatsapp} WhatsApp</span>
                        <span className="text-[#ff85b1]">{counts.social} cliques</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Últimas ações em tempo real */}
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
                Nenhuma ação registrada ainda. Abra a página /gibaz4 e clique em algum botão para
                testar!
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
      </main>
    </div>
  );
}
