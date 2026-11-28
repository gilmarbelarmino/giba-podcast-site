import defaultOngsJson from "@/data/ongs.json";

export interface OngItem {
  id: string;
  instagramUrl: string;
  handle: string;
  fullName: string;
  shortName: string;
  logo: string;
  published: boolean;
  isPlaceholder?: boolean;
}

export interface FetchedInstagramProfile {
  ok: boolean;
  instagramUrl: string;
  handle?: string;
  fullName?: string;
  shortName?: string;
  logo?: string;
  partial?: boolean;
  error?: string;
}

const LOCAL_ONGS_KEY = "gibaz4_ongs_v1";

export const defaultOngs: OngItem[] = defaultOngsJson as OngItem[];

export function extractInstagramHandle(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("@")) {
    return trimmed.replace(/^@+/, "").split(/[\s/?#]/)[0];
  }
  const m = trimmed.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  if (m && !["p", "reel", "reels", "stories", "explore", "accounts"].includes(m[1].toLowerCase())) {
    return m[1];
  }
  return trimmed.replace(/[^A-Za-z0-9._]/g, "");
}

export function normalizeInstagramUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\/(www\.)?instagram\.com\//i.test(trimmed)) return trimmed;
  const handle = extractInstagramHandle(trimmed);
  return handle ? `https://www.instagram.com/${handle}/` : trimmed;
}

export function getFirstOngName(name: string): string {
  const cleaned = name
    .replace(/\(@[^)]+\).*$/i, "")
    .replace(/\s*[•|–—-]\s*Instagram.*$/i, "")
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .trim();
  const first = cleaned.split(/\s+/)[0] || cleaned;
  return first.replace(/[,.:;!?()[\]]+$/g, "");
}

export async function loadOngs(): Promise<OngItem[]> {
  for (const endpoint of ["/api/gibaz4-ongs.php", "/api/gibaz4-ongs"]) {
    try {
      const res = await fetch(`${endpoint}?t=${Date.now()}`, { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data)) {
          try {
            localStorage.setItem(LOCAL_ONGS_KEY, JSON.stringify(data));
          } catch {
            // ignore
          }
          return data as OngItem[];
        }
      }
    } catch {
      // try next
    }
  }

  try {
    const saved = localStorage.getItem(LOCAL_ONGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as OngItem[];
    }
  } catch {
    // ignore
  }

  return defaultOngs;
}

export async function saveOngs(ongs: OngItem[]): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_ONGS_KEY, JSON.stringify(ongs));
  } catch {
    // ignore
  }

  for (const endpoint of ["/api/gibaz4-ongs.php", "/api/gibaz4-ongs"]) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ongs }),
      });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (data?.ok) return true;
      }
    } catch {
      // try next
    }
  }

  return false;
}

export async function fetchOngFromInstagram(urlOrHandle: string): Promise<FetchedInstagramProfile> {
  for (const endpoint of ["/api/fetch-instagram.php", "/api/fetch-instagram"]) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlOrHandle }),
      });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        return (await res.json()) as FetchedInstagramProfile;
      }
    } catch {
      // try next
    }
  }

  const handle = extractInstagramHandle(urlOrHandle);
  return {
    ok: false,
    instagramUrl: normalizeInstagramUrl(urlOrHandle),
    handle: handle ? `@${handle}` : "",
    shortName: handle ? getFirstOngName(handle) : "",
    error: "Não foi possível consultar o Instagram automaticamente. Preencha manualmente.",
  };
}
