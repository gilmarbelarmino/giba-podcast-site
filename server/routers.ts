import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@shared/content";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import {
  addNewsletterSubscriber,
  createContactMessage,
  getSavedContent,
  hasAdminUser,
  listContactMessages,
  listNewsletterSubscribers,
  promoteUserToAdmin,
  saveContent,
} from "./db";

const MAX_CONTENT_BYTES = 400_000;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(160),
  email: z.string().trim().email("Informe um e-mail válido").max(320),
  subject: z.string().trim().min(1, "Escolha um assunto").max(120),
  message: z.string().trim().min(10, "Escreva pelo menos 10 caracteres").max(5000),
});

const newsletterSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido").max(320),
});

/** Validação leve do documento de conteúdo: objeto JSON dentro do tamanho permitido. */
const contentSchema = z.custom<SiteContent>(
  value => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    try {
      return JSON.stringify(value).length <= MAX_CONTENT_BYTES;
    } catch {
      return false;
    }
  },
  { message: "Conteúdo inválido" },
);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  content: router({
    /** Conteúdo público: o que foi salvo no painel, ou os padrões do código. */
    get: publicProcedure.query(async () => {
      const saved = await getSavedContent();
      return {
        content: mergeContent(saved?.data),
        savedAt: saved?.updatedAt ?? null,
        isDefault: !saved,
      };
    }),
    update: adminProcedure.input(contentSchema).mutation(async ({ input, ctx }) => {
      const merged = mergeContent(input);
      const ok = await saveContent(merged, ctx.user.email ?? ctx.user.name ?? "admin");
      if (!ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar: banco de dados indisponível.",
        });
      }
      return { content: merged };
    }),
    defaults: publicProcedure.query(() => DEFAULT_CONTENT),
  }),

  contact: router({
    submit: publicProcedure.input(contactSchema).mutation(async ({ input }) => {
      try {
        await createContactMessage(input);
      } catch (error) {
        console.error("[contact.submit]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não conseguimos registrar sua mensagem agora. Tente novamente em instantes.",
        });
      }
      return { success: true } as const;
    }),
  }),

  newsletter: router({
    subscribe: publicProcedure.input(newsletterSchema).mutation(async ({ input }) => {
      try {
        await addNewsletterSubscriber(input.email.toLowerCase());
      } catch (error) {
        console.error("[newsletter.subscribe]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não conseguimos concluir a inscrição agora. Tente novamente em instantes.",
        });
      }
      return { success: true } as const;
    }),
  }),

  admin: router({
    /** Primeiro administrador do site: liberado apenas se nenhum admin existir. */
    claim: protectedProcedure.mutation(async ({ ctx }) => {
      if (ENV.ownerOpenId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "O acesso administrativo já está vinculado ao proprietário do projeto.",
        });
      }
      const alreadyHasAdmin = await hasAdminUser();
      if (alreadyHasAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Já existe um administrador para este site.",
        });
      }
      await promoteUserToAdmin(ctx.user.id);
      return { success: true } as const;
    }),
    messages: adminProcedure.query(async () => listContactMessages(200)),
    subscribers: adminProcedure.query(async () => listNewsletterSubscribers(1000)),
  }),
});

export type AppRouter = typeof appRouter;
