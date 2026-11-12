import { trpc } from "@/lib/trpc";
import { Download, Inbox as InboxIcon, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import { AdminSection } from "./FormFields";

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  toast.success("Arquivo exportado.");
}

function formatDate(value: Date | string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function MessagesPanel() {
  const query = trpc.admin.messages.useQuery(undefined, { refetchOnWindowFocus: false });

  return (
    <AdminSection
      title="Mensagens de contato"
      description="Tudo o que chega pelo formulário do site fica registrado aqui."
      action={
        <button
          type="button"
          disabled={!query.data?.length}
          onClick={() =>
            downloadCsv("mensagens-giba-podcast.csv", [
              ["Data", "Nome", "E-mail", "Assunto", "Mensagem"],
              ...(query.data ?? []).map(item => [
                formatDate(item.createdAt),
                item.name,
                item.email,
                item.subject,
                item.message,
              ]),
            ])
          }
          className="btn btn-ghost h-10 px-4 text-[0.8rem] disabled:opacity-40"
        >
          <Download className="size-4" />
          Exportar CSV
        </button>
      }
    >
      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando mensagens...</p>
      ) : query.error ? (
        <p className="text-sm text-red-400">{query.error.message}</p>
      ) : query.data && query.data.length > 0 ? (
        <div className="flex flex-col gap-3">
          {query.data.map(message => (
            <article key={message.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-full bg-brand/12 text-[0.8rem] font-semibold text-brand">
                    {message.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-[0.9rem] font-medium text-white">{message.name}</p>
                    <a href={`mailto:${message.email}`} className="text-[0.76rem] text-brand hover:underline">
                      {message.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="chip border-white/10 text-[0.64rem]">{message.subject}</span>
                  <span className="text-[0.72rem] text-[#6f8088]">{formatDate(message.createdAt)}</span>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-[0.86rem] leading-relaxed text-[#b8c5ca]">
                {message.message}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <InboxIcon className="size-8 text-brand/50" />
          <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
        </div>
      )}
    </AdminSection>
  );
}

export function SubscribersPanel() {
  const query = trpc.admin.subscribers.useQuery(undefined, { refetchOnWindowFocus: false });

  return (
    <AdminSection
      title="Newsletter"
      description="Pessoas que pediram para receber os próximos episódios."
      action={
        <button
          type="button"
          disabled={!query.data?.length}
          onClick={() =>
            downloadCsv("inscritos-giba-podcast.csv", [
              ["Data", "E-mail"],
              ...(query.data ?? []).map(item => [formatDate(item.createdAt), item.email]),
            ])
          }
          className="btn btn-ghost h-10 px-4 text-[0.8rem] disabled:opacity-40"
        >
          <Download className="size-4" />
          Exportar CSV
        </button>
      }
    >
      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando inscritos...</p>
      ) : query.error ? (
        <p className="text-sm text-red-400">{query.error.message}</p>
      ) : query.data && query.data.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-[0.85rem]">
            <thead className="bg-white/[0.04] text-[0.68rem] uppercase tracking-[0.14em] text-[#8fa0a6]">
              <tr>
                <th className="px-4 py-3 font-semibold">E-mail</th>
                <th className="px-4 py-3 font-semibold">Inscrição</th>
              </tr>
            </thead>
            <tbody>
              {query.data.map(item => (
                <tr key={item.id} className="border-t border-white/8">
                  <td className="px-4 py-3">
                    <a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 text-white hover:text-brand">
                      <Mail className="size-3.5 text-brand/70" />
                      {item.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[#8fa0a6]">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Users className="size-8 text-brand/50" />
          <p className="text-sm text-muted-foreground">Nenhum inscrito ainda.</p>
        </div>
      )}
    </AdminSection>
  );
}
