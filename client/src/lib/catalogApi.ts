import defaultProductsJson from "@/data/catalogProducts.json";

export type CatalogCategory = "naturais" | "suplementos" | "bikes" | "acessorios";

export const CATALOG_CATEGORIES: Array<{ id: CatalogCategory; label: string }> = [
  { id: "naturais", label: "Naturais" },
  { id: "suplementos", label: "Suplementos" },
  { id: "bikes", label: "Bikes" },
  { id: "acessorios", label: "Acessórios" },
];

export function getCategoryLabel(category?: string): string {
  const found = CATALOG_CATEGORIES.find((c) => c.id === category);
  return found ? found.label : "Acessórios";
}

export interface CatalogProduct {
  id: string;
  category: CatalogCategory;
  url: string;
  fullName: string;
  shortName: string;
  price: string;
  image: string;
  published: boolean;
  isPlaceholder?: boolean;
}

export interface FetchedProductMetadata {
  ok: boolean;
  url: string;
  resolvedUrl?: string;
  fullName?: string;
  shortName?: string;
  price?: string;
  image?: string;
  partial?: boolean;
  error?: string;
}

const LOCAL_CATALOG_KEY = "gibaz4_catalog_products_v2";

function normalizeProducts(raw: unknown[]): CatalogProduct[] {
  const validCats = new Set<string>(CATALOG_CATEGORIES.map((c) => c.id));
  return raw.map((item) => {
    const p = item as Partial<CatalogProduct>;
    const cat: CatalogCategory =
      p.category && validCats.has(p.category) ? (p.category as CatalogCategory) : "acessorios";
    return {
      id: p.id || `prod-${Math.random().toString(36).slice(2, 8)}`,
      category: cat,
      url: p.url || "",
      fullName: p.fullName || p.shortName || "Produto",
      shortName: p.shortName || getFirstProductName(p.fullName || "Produto"),
      price: p.price || "",
      image: p.image || "",
      published: p.published !== false,
      isPlaceholder: !!p.isPlaceholder,
    };
  });
}

export const defaultCatalogProducts: CatalogProduct[] = normalizeProducts(
  defaultProductsJson as unknown[]
);

export function getFirstProductName(name: string): string {
  const cleaned = name
    .replace(
      /\s*[-|–—]\s*(Mercado\s*Livre.*|Amazon.*|Shopee.*|Magalu.*|Magazine Luiza.*)$/i,
      ""
    )
    .trim();
  const first = cleaned.split(/\s+/)[0] || cleaned;
  return first.replace(/[,.:;!?()[\]]+$/g, "");
}

export async function loadCatalogProducts(): Promise<CatalogProduct[]> {
  for (const endpoint of ["/api/gibaz4-products.php", "/api/gibaz4-products"]) {
    try {
      const res = await fetch(`${endpoint}?t=${Date.now()}`, { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = normalizeProducts(data);
          try {
            localStorage.setItem(LOCAL_CATALOG_KEY, JSON.stringify(normalized));
          } catch {
            // ignore
          }
          return normalized;
        }
      }
    } catch {
      // try next
    }
  }

  try {
    const saved = localStorage.getItem(LOCAL_CATALOG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return normalizeProducts(parsed);
    }
  } catch {
    // ignore
  }

  return defaultCatalogProducts;
}

export async function saveCatalogProducts(products: CatalogProduct[]): Promise<boolean> {
  const normalized = normalizeProducts(products);
  try {
    localStorage.setItem(LOCAL_CATALOG_KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }

  for (const endpoint of ["/api/gibaz4-products.php", "/api/gibaz4-products"]) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: normalized }),
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

export async function fetchProductFromLink(url: string): Promise<FetchedProductMetadata> {
  for (const endpoint of ["/api/fetch-product.php", "/api/fetch-product"]) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        return (await res.json()) as FetchedProductMetadata;
      }
    } catch {
      // try next
    }
  }

  return {
    ok: false,
    url,
    error: "Não foi possível consultar o link automaticamente. Preencha manualmente.",
  };
}
