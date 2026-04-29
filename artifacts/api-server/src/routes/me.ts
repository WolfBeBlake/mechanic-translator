import { Router, type IRouter } from "express";
import { requireAuth, isAdminEmail, FREE_LIMIT, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req, res): Promise<void> => {
  const { user } = req as AuthedRequest;
  const isPro = user.subscriptionTier === "pro";
  const remaining = isPro ? null : Math.max(0, FREE_LIMIT - user.translationsUsed);
  res.json({
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: user.email,
    subscriptionTier: user.subscriptionTier,
    translationsUsed: user.translationsUsed,
    freeLimit: FREE_LIMIT,
    translationsRemaining: remaining,
    isAdmin: isAdminEmail(user.email),
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
