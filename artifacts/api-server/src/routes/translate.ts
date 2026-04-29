import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, translationsTable, usersTable } from "@workspace/db";
import { TranslateQuoteBody } from "@workspace/api-zod";
import { requireAuth, FREE_LIMIT, type AuthedRequest } from "../lib/auth";
import { translateMechanicQuote } from "../lib/translator";

const router: IRouter = Router();

router.post("/translate", requireAuth, async (req, res): Promise<void> => {
  const { user } = req as AuthedRequest;

  const parsed = TranslateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Please paste a longer quote so we can translate it (5-8000 characters).",
    });
    return;
  }

  if (
    user.subscriptionTier === "free" &&
    user.translationsUsed >= FREE_LIMIT
  ) {
    res.status(402).json({
      error: "You've used your free translations. Upgrade to Pro to keep going.",
      code: "FREE_QUOTA_EXHAUSTED",
    });
    return;
  }

  let result;
  try {
    result = await translateMechanicQuote(parsed.data.inputText);
  } catch (err) {
    req.log.error({ err }, "Translation failed");
    res.status(502).json({
      error: "Our translator is having a moment. Please try again in a few seconds.",
    });
    return;
  }

  const [saved] = await db
    .insert(translationsTable)
    .values({
      userId: user.id,
      inputText: parsed.data.inputText,
      result,
    })
    .returning();

  await db
    .update(usersTable)
    .set({ translationsUsed: sql`${usersTable.translationsUsed} + 1` })
    .where(eq(usersTable.id, user.id));

  res.json({
    id: saved.id,
    inputText: saved.inputText,
    result,
    createdAt: saved.createdAt.toISOString(),
  });
});

export default router;
