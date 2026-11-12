import { desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  contactMessages,
  InsertUser,
  newsletterSubscribers,
  siteContent,
  users,
} from "../drizzle/schema";
import type { SiteContent } from "../shared/content";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/* ------------------------------------------------------------------ */
/* Conteúdo do site                                                    */
/* ------------------------------------------------------------------ */

export async function getSavedContent(): Promise<{ data: SiteContent; updatedAt: Date } | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const rows = await db.select().from(siteContent).where(eq(siteContent.id, 1)).limit(1);
    if (rows.length === 0) return null;
    return { data: JSON.parse(rows[0].data) as SiteContent, updatedAt: rows[0].updatedAt };
  } catch (error) {
    console.warn("[Database] Failed to load site content:", error);
    return null;
  }
}

export async function saveContent(content: SiteContent, updatedBy: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const payload = JSON.stringify(content);
  await db
    .insert(siteContent)
    .values({ id: 1, data: payload, updatedBy })
    .onDuplicateKeyUpdate({ set: { data: payload, updatedBy } });
  return true;
}

/* ------------------------------------------------------------------ */
/* Mensagens de contato                                                */
/* ------------------------------------------------------------------ */

export type NewContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function createContactMessage(input: NewContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(contactMessages).values(input);
}

export async function listContactMessages(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(limit);
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */

export async function addNewsletterSubscriber(email: string, source = "site") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db
    .insert(newsletterSubscribers)
    .values({ email, source })
    .onDuplicateKeyUpdate({ set: { email } });
}

export async function listNewsletterSubscribers(limit = 500) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt))
    .limit(limit);
}

/* ------------------------------------------------------------------ */
/* Administração                                                       */
/* ------------------------------------------------------------------ */

export async function hasAdminUser(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select({ total: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.role, "admin"));
  return Number(rows[0]?.total ?? 0) > 0;
}

export async function promoteUserToAdmin(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));
}
