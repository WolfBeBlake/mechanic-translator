import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, translationsTable } from "@workspace/db";
import { GetTranslationParams, DeleteTranslationParams } from "@workspace/api-zod";
import { requireAuth, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/translations", requireAuth, async (req, res): Promise<void> => {
  const { user } = req as AuthedRequest;
  const rows = await db
    .select()
    .from(translationsTable)
    .where(eq(translationsTable.userId, user.id))
    .orderBy(desc(translationsTable.createdAt));

  res.json(
    rows.map((r) => ({
      id: r.id,
      inputText: r.inputText,
      result: r.result,
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.get("/translations/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetTranslationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { user } = req as AuthedRequest;

  const [row] = await db
    .select()
    .from(translationsTable)
    .where(
      and(
        eq(translationsTable.id, params.data.id),
        eq(translationsTable.userId, user.id),
      ),
    );

  if (!row) {
    res.status(404).json({ error: "Translation not found" });
    return;
  }

  res.json({
    id: row.id,
    inputText: row.inputText,
    result: row.result,
    createdAt: row.createdAt.toISOString(),
  });
});

router.delete("/translations/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteTranslationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const { user } = req as AuthedRequest;

  const [deleted] = await db
    .delete(translationsTable)
    .where(
      and(
        eq(translationsTable.id, params.data.id),
        eq(translationsTable.userId, user.id),
      ),
    )
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Translation not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
