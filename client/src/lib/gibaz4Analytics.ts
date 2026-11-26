export type Gibaz4EventKey =
  | "page_view"
  | "whatsapp_floating"
  | "whatsapp_hero"
  | "whatsapp_contact"
  | "instagram"
  | "youtube_gibaz4"
  | "youtube_podcast"
  | "video_peso_ideal"
  | "tiktok"
  | "site_podcast"
  | "email"
  | "other_clicks";

export type Gibaz4StatsData = {
  updatedAt: string;
  totals: {
    page_view: number;
    unique_view: number;
    whatsapp_floating: number;
    whatsapp_hero: number;
    whatsapp_contact: number;
    instagram: number;
    youtube_gibaz4?: number;
    youtube_podcast: number;
    video_peso_ideal: number;
    tiktok: number;
    site_podcast: number;
    email: number;
    other_clicks: number;
  };
  devices: {
    mobile: number;
    desktop: number;
  };
  sources: {
    instagram: number;
    direct_or_other: number;
  };
  byDate: Record<
    string,
    {
      views: number;
      whatsapp: number;
      social: number;
    }
  >;
  recent: Array<{
    time: string;
    event: string;
    label: string;
    device: string;
    source: string;
  }>;
};

const ENDPOINT = "/api/gibaz4-analytics.php";
const SESSION_KEY = "gibaz4_session_viewed_v1";

export function trackGibaz4Event(
  event: Gibaz4EventKey,
  label: string,
  extra?: { isUnique?: boolean },
) {
  try {
    const payload = JSON.stringify({
      action: "track",
      event,
      label,
      isUnique: Boolean(extra?.isUnique),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });
      const queued = navigator.sendBeacon(ENDPOINT, blob);
      if (queued) return;
    }

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* ignore network errors */
    });
  } catch {
    /* ignore tracking errors */
  }
}

export function trackGibaz4PageView() {
  try {
    let isUnique = true;
    if (typeof sessionStorage !== "undefined") {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        isUnique = false;
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    }
    trackGibaz4Event("page_view", "Acesso à página /gibaz4 (Link da Bio)", { isUnique });
  } catch {
    trackGibaz4Event("page_view", "Acesso à página /gibaz4 (Link da Bio)", { isUnique: true });
  }
}

export async function fetchGibaz4Stats(): Promise<Gibaz4StatsData> {
  const response = await fetch(`${ENDPOINT}?t=${Date.now()}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Não foi possível carregar as estatísticas.");
  }
  return (await response.json()) as Gibaz4StatsData;
}

export async function resetGibaz4Stats(pin: string): Promise<Gibaz4StatsData> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reset", pin }),
  });
  const data = await response.json();
  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || "Não foi possível zerar os contadores.");
  }
  return data.stats as Gibaz4StatsData;
}
