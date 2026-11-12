import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@shared/content";
import {
  EpisodesTab,
  GuestsTab,
  SocialTab,
  StatsTab,
  TextsTab,
} from "@/components/admin/ContentTabs";
import { MessagesPanel, SubscribersPanel } from "@/components/admin/Inbox";
import { DEFAULT_CONTENT } from "@shared/content";
import {
  ArrowLeft,
  Check,
  Loader2,
  LogOut,
  Lock,
  RotateCcw,
  Save,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const TABS = [
  { id: "textos", label: "Textos" },
  { id: "episodios", label: "Episódios" },
  { id: "convidados", label: "Convidados" },
  { id: "numeros", label: "Números" },
  { id: "redes", label: "Redes" },
  { id: "mensagens", label: "Mensagens" },
  { id: "inscritos", label: "Inscritos" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050708]">
      <div className="pointer-events-none fixed inset-0 grid-lines opacity-40" aria-hidden="true" />
      <div className="pointer-events-none fixed -right-40 -top-40 size-[500px] rounded-full bg-brand/10 blur-[140px]" aria-hidden="true" />
      {children}
    </div>
  );
}

function AccessCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Shell>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
        <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
          <img
            src={DEFAULT_CONTENT.brand.logoUrl}
            alt="Logotipo GIBA Podcast"
            className="mx-auto size-20 rounded-full border border-white/15 object-cover"
          />
          <h1 className="display-title mt-6 text-3xl text-white">{title}</h1>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-7">{children}</div>
          <a href="/" className="mt-6 inline-flex items-center gap-2 text-[0.8rem] text-[#8fa0a6] hover:text-brand">
            <ArrowLeft className="size-3.5" />
            Voltar para o site
          </a>
        </div>
      </div>
    </Shell>
  );
}

export default function Admin() {
  const { user, loading, logout, refresh } = useAuth();
  const utils = trpc.useUtils();
  const contentQuery = trpc.content.get.useQuery(undefined, { refetchOnWindowFocus: false });
  const [tab, setTab] = useState<TabId>("textos");
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [baseline, setBaseline] = useState("");

  useEffect(() => {
    document.title = "Painel do produtor — GIBA Podcast";
  }, []);

  useEffect(() => {
    if (contentQuery.data && !draft) {
      setDraft(contentQuery.data.content);
      setBaseline(JSON.stringify(contentQuery.data.content));
    }
  }, [contentQuery.data, draft]);

  const save = trpc.content.update.useMutation({
    onSuccess: result => {
      setDraft(result.content);
      setBaseline(JSON.stringify(result.content));
      utils.content.get.setData(undefined, previous =>
        previous ? { ...previous, content: result.content, isDefault: false } : previous,
      );
      toast.success("Conteúdo salvo. O site já mostra as alterações.");
    },
    onError: error => toast.error(error.message || "Não foi possível salvar."),
  });

  const claim = trpc.admin.claim.useMutation({
    onSuccess: async () => {
      toast.success("Acesso liberado! Você agora é administrador do site.");
      await refresh();
    },
    onError: error => toast.error(error.message || "Não foi possível liberar o acesso."),
  });

  const dirty = useMemo(
    () => Boolean(draft) && JSON.stringify(draft) !== baseline,
    [draft, baseline],
  );

  if (loading) {
    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <AccessCard
        title="Área do produtor"
        description="Entre com sua conta para editar textos, episódios, convidados e acompanhar as mensagens do site."
      >
        <button
          type="button"
          onClick={() => startLogin()}
          className="btn btn-primary w-full"
        >
          <Lock className="size-4" />
          Entrar para editar
        </button>
        <p className="mt-4 text-[0.72rem] leading-relaxed text-[#6f8088]">
          Apenas o proprietário do projeto tem permissão de edição. Visitantes continuam vendo o site normalmente.
        </p>
      </AccessCard>
    );
  }

  if (user.role !== "admin") {
    return (
      <AccessCard
        title="Acesso restrito"
        description="Sua conta está conectada, mas ainda não tem permissão para editar o site."
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => claim.mutate()}
            disabled={claim.isPending}
            className="btn btn-primary w-full disabled:opacity-60"
          >
            {claim.isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldAlert className="size-4" />}
            Reivindicar acesso de administrador
          </button>
          <button type="button" onClick={() => logout()} className="btn btn-ghost w-full">
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
        <p className="mt-4 text-[0.72rem] leading-relaxed text-[#6f8088]">
          A reivindicação só funciona se ainda não houver administrador cadastrado.
        </p>
      </AccessCard>
    );
  }

  if (!draft) {
    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      </Shell>
    );
  }

  const updateDraft = (updater: React.SetStateAction<SiteContent>) =>
    setDraft(previous => {
      if (!previous) return previous;
      return typeof updater === "function"
        ? (updater as (value: SiteContent) => SiteContent)(previous)
        : updater;
    });

  return (
    <Shell>
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#050708]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={draft.brand.logoUrl}
              alt="Logotipo"
              className="size-9 rounded-full border border-white/15 object-cover"
            />
            <div>
              <p className="font-display text-[0.95rem] uppercase tracking-[0.14em] text-white">
                Painel do produtor
              </p>
              <p className="text-[0.68rem] text-[#6f8088]">{user.email ?? user.name ?? "administrador"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="btn btn-ghost h-9 px-4 text-[0.78rem]">
              <ArrowLeft className="size-3.5" />
              Ver site
            </a>
            <button type="button" onClick={() => logout()} className="btn btn-ghost h-9 px-4 text-[0.78rem]">
              <LogOut className="size-3.5" />
              Sair
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {TABS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[0.8rem] font-medium transition",
                tab === item.id
                  ? "bg-brand text-[#04100f]"
                  : "text-[#9fb0b6] hover:bg-white/5 hover:text-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8 pb-32 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl uppercase text-white">
              {TABS.find(item => item.id === tab)?.label}
            </h1>
            <p className="mt-1 text-[0.8rem] text-muted-foreground">
              {contentQuery.data?.isDefault
                ? "O site está usando o conteúdo padrão. Salve para gravar sua primeira versão."
                : "As alterações valem para o site publicado assim que você salvar."}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[0.7rem] text-[#8fa0a6]">
            <Sparkles className="size-3.5 text-brand" />
            {draft.episodes.length} episódios · {draft.guests.length} convidados
          </span>
        </div>

        {tab === "textos" ? <TextsTab draft={draft} setDraft={updateDraft} /> : null}
        {tab === "episodios" ? <EpisodesTab draft={draft} setDraft={updateDraft} /> : null}
        {tab === "convidados" ? <GuestsTab draft={draft} setDraft={updateDraft} /> : null}
        {tab === "numeros" ? <StatsTab draft={draft} setDraft={updateDraft} /> : null}
        {tab === "redes" ? <SocialTab draft={draft} setDraft={updateDraft} /> : null}
        {tab === "mensagens" ? <MessagesPanel /> : null}
        {tab === "inscritos" ? <SubscribersPanel /> : null}
      </main>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070b0c]/95 backdrop-blur-xl transition-transform duration-300",
          dirty || save.isPending ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-[0.8rem] text-[#c3ced3]">
            <span className="size-2 rounded-full bg-amber-400" />
            Alterações não salvas
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDraft(JSON.parse(baseline) as SiteContent)}
              className="btn btn-ghost h-10 px-4 text-[0.8rem]"
            >
              <RotateCcw className="size-3.5" />
              Descartar
            </button>
            <button
              type="button"
              onClick={() => save.mutate(draft)}
              disabled={save.isPending}
              className="btn btn-primary h-10 px-5 text-[0.8rem] disabled:opacity-60"
            >
              {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Salvar alterações
            </button>
          </div>
        </div>
      </div>

      {!dirty && !save.isPending ? (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-30 -translate-x-1/2">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-[#071010]/90 px-3 py-1.5 text-[0.7rem] text-brand-soft opacity-70 backdrop-blur">
            <Check className="size-3.5" />
            Tudo salvo
          </span>
        </div>
      ) : null}
    </Shell>
  );
}
