# GIBA Podcast — site oficial

Site do podcast **GIBA Podcast** (Gilmar Belarmino · produção CETUSG), feito com React + Vite, servidor Express/tRPC e banco de dados MySQL gerenciado.

## Como editar o site

### 1. Painel do produtor (recomendado)

Acesse **`/admin`** e clique em **Entrar para editar**. Depois do login, o proprietário do projeto vê as abas:

| Aba | O que muda |
| --- | --- |
| Textos | Marca, abertura (hero), faixa de temas, sobre, patrocínio, contato, newsletter e rodapé |
| Episódios | Título, convidado, data, pilar, tipo (episódio/corte/ao vivo), ID do YouTube, descrição e destaque |
| Convidados | Nome, descrição curta, foto e episódio relacionado |
| Números | Indicadores do hero e da faixa de estatísticas (ex.: `1,11 mi`) |
| Redes | Links de YouTube, Instagram, Spotify, TikTok, LinkedIn etc. |
| Mensagens | Tudo o que chega pelo formulário de contato (com exportação CSV) |
| Inscritos | E-mails da newsletter (com exportação CSV) |

As alterações aparecem no site assim que você clica em **Salvar alterações**.

> Para que o player funcione, cole apenas o **ID do vídeo** do YouTube (o trecho depois de `watch?v=`), por exemplo `_TjWFs-ZnjM`.

### 2. Arquivo de conteúdo (sem abrir o painel)

Todos os textos, episódios e convidados padrão ficam em **`shared/content.ts`**. Se o banco estiver vazio, o site usa exatamente esse arquivo. Editar aqui exige um novo deploy, então prefira o painel para o dia a dia.

### 3. Imagens

As imagens ficam em `client/public/assets/` e podem ser trocadas mantendo o mesmo nome de arquivo, ou referenciadas por URL no painel.

## Estrutura

```
client/                 Front-end React
  src/components/site/  Seções do site público (hero, episódios, contato…)
  src/components/admin/ Painel: formulários, abas e caixa de entrada
  src/pages/Home.tsx    Página inicial
  src/pages/Admin.tsx   Painel do produtor (/admin)
  public/assets/        Logo, fotos do estúdio e favicon
shared/content.ts       Tipos e conteúdo padrão do site
server/routers.ts       API tRPC (conteúdo, contato, newsletter, admin)
server/db.ts            Consultas ao banco
drizzle/schema.ts       Tabelas: site_content, contact_messages, newsletter_subscribers
```

## Comandos

```bash
pnpm dev        # desenvolvimento
pnpm build      # build de produção
pnpm check      # checagem de tipos
pnpm db:push    # aplica mudanças de esquema no banco
```

## Formulários

As mensagens de contato e as inscrições na newsletter são gravadas no banco gerenciado e ficam disponíveis no painel, com exportação em CSV. Nenhum serviço externo é necessário.
