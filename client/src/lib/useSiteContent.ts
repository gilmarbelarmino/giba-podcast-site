import { DEFAULT_CONTENT, type SiteContent } from "@shared/content";
import { trpc } from "@/lib/trpc";

/**
 * Conteúdo do site. Usa o que foi salvo no painel e, se o banco ainda estiver
 * vazio (ou indisponível), mostra os padrões definidos em shared/content.ts.
 */
export function useSiteContent() {
  const query = trpc.content.get.useQuery(undefined, {
    staleTime: 60_000,
    retry: 1,
  });

  const content: SiteContent = query.data?.content ?? DEFAULT_CONTENT;

  return {
    content,
    isLoading: query.isLoading,
    isDefault: query.data?.isDefault ?? true,
    savedAt: query.data?.savedAt ?? null,
    refetch: query.refetch,
  };
}
