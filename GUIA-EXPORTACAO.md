# GIBA Podcast — pacote completo do site

Este arquivo contém **todo o site** do GIBA Podcast: o código-fonte, as imagens, o conteúdo dos textos, o banco de dados (estrutura) e uma versão já compilada pronta para subir em hospedagem.

## O que tem dentro

| Pasta / arquivo | O que é |
| --- | --- |
| `client/` | O site (React + Vite). `client/public/assets/` tem o logo, fotos do estúdio e favicon. |
| `client/src/components/site/` | Cada seção do site: hero, episódios, temas, sobre, convidados, patrocínio, contato, newsletter, rodapé. |
| `client/src/components/admin/` e `client/src/pages/Admin.tsx` | O painel de edição (`/admin`). |
| `shared/content.ts` | **Todo o conteúdo do site**: textos, episódios, convidados, números, redes. É aqui que se edita sem o painel. |
| `server/` | O servidor (Express + tRPC): API de conteúdo, formulário de contato, newsletter e administração. |
| `drizzle/` | Estrutura do banco MySQL (tabelas `site_content`, `contact_messages`, `newsletter_subscribers`). |
| `Dockerfile` | Imagem pronta para servidor com Docker (VPS). |
| `build-publico/` | **Versão já compilada do site** (HTML/CSS/JS). É a pasta que se sobe em hospedagem estática. |
| `README.md` | Guia de edição e comandos do projeto. |

## Rodar no seu computador

Pré-requisitos: **Node.js 22** e **pnpm**.

```bash
pnpm install
pnpm dev          # abre em http://localhost:3000
pnpm build        # gera a versão de produção em dist/
```

Para o painel de edição e os formulários funcionarem localmente, é preciso um banco MySQL e as variáveis de ambiente (veja a seção "Hospedagem").

## Editar o conteúdo

- **Com o site rodando:** acesse `/admin`, entre e edite pelas abas (Textos, Episódios, Convidados, Números, Redes).
- **Direto no arquivo:** edite `shared/content.ts` — todos os textos, episódios e convidados estão lá, em português e fáceis de localizar.

As imagens ficam em `client/public/assets/`. Para trocar uma foto, substitua o arquivo mantendo o mesmo nome.

## Subir para a Hostinger

### Opção 1 — Hospedagem estática (hospedagem compartilhada)

Funciona para exibir o site, **sem** o painel de edição e **sem** formulários que gravam no banco.

1. Envie todo o conteúdo de `build-publico/` para a pasta `public_html` do seu domínio (Gerenciador de Arquivos ou FTP).
2. Pronto: o site abre no seu domínio.

> Os botões de contato e newsletter precisariam de um serviço externo (ex.: Formspree) ou apontar para um e-mail.

### Opção 2 — Site completo (Node.js + MySQL)

Necessário para manter painel de edição, mensagens e inscritos.

- **Hostinger Node.js / Web Apps:** crie o site como Web App, conecte o repositório com este código, defina o comando de build `pnpm install && pnpm build`, o comando de start `node dist/index.js` e a porta `3000`.
- **VPS com Docker:** use o `Dockerfile` incluído (`docker build -t gibapod . && docker run -p 3000:3000 gibapod`) e um MySQL no VPS.
- Crie o banco MySQL na Hostinger e configure a variável de ambiente `DATABASE_URL` (formato `mysql://usuario:senha@host:3306/banco`).
- Aplique a estrutura do banco com `pnpm db:push`.

**Atenção:** o login do painel `/admin` hoje usa a conta Manus. Fora da Manus, ele precisa ser trocado por um login próprio (e-mail e senha) — ajuste pequeno no `server/`, que posso preparar quando você definir o plano.

## Domínio e HTTPS

Depois de publicar, aponte o domínio da Hostinger para a pasta/serviço escolhido e ative o SSL (Let's Encrypt), que a Hostinger oferece gratuitamente no painel.
