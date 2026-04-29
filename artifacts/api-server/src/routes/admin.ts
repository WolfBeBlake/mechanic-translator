import { Router, type IRouter } from "express";
import { desc, count, eq, gte } from "drizzle-orm";
import { db, usersTable, translationsTable } from "@workspace/db";
import { requireAuth, requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get(
  "/admin/stats",
  requireAuth,
  requireAdmin,
  async (_req, res): Promise<void> => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [[totalUsersRow], [totalTransRow], [freeRow], [proRow], [t7Row], [s7Row]] =
      await Promise.all([
        db.select({ c: count() }).from(usersTable),
        db.select({ c: count() }).from(translationsTable),
        db
          .select({ c: count() })
          .from(usersTable)
          .where(eq(usersTable.subscriptionTier, "free")),
        db
          .select({ c: count() })
          .from(usersTable)
          .where(eq(usersTable.subscriptionTier, "pro")),
        db
          .select({ c: count() })
          .from(translationsTable)
          .where(gte(translationsTable.createdAt, sevenDaysAgo)),
        db
          .select({ c: count() })
          .from(usersTable)
          .where(gte(usersTable.createdAt, sevenDaysAgo)),
      ]);

    res.json({
      totalUsers: Number(totalUsersRow.c),
      totalTranslations: Number(totalTransRow.c),
      freeUsers: Number(freeRow.c),
      proUsers: Number(proRow.c),
      translationsLast7Days: Number(t7Row.c),
      signupsLast7Days: Number(s7Row.c),
    });
  },
);

router.get(
  "/admin/users",
  requireAuth,
  requireAdmin,
  async (_req, res): Promise<void> => {
    const rows = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        subscriptionTier: usersTable.subscriptionTier,
        translationsUsed: usersTable.translationsUsed,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(100);

    res.json(
      rows.map((r) => ({
        id: r.id,
        email: r.email,
        subscriptionTier: r.subscriptionTier,
        translationsUsed: r.translationsUsed,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  },
);

export default router;
