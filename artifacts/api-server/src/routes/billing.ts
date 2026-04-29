import { Router, type IRouter } from "express";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.post("/billing/checkout", requireAuth, async (_req, res): Promise<void> => {
  const hasStripe =
    !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PRICE_ID;

  if (!hasStripe) {
    res.json({
      configured: false,
      url: null,
      message:
        "Pro checkout isn't switched on yet in this preview build. Add your Stripe keys (STRIPE_SECRET_KEY and STRIPE_PRICE_ID) to enable payments.",
    });
    return;
  }

  // Stripe is intentionally stubbed in this build. Once you add the Stripe
  // integration, replace this with stripe.checkout.sessions.create(...).
  res.json({
    configured: true,
    url: null,
    message:
      "Stripe keys detected but checkout integration is not wired in this build yet.",
  });
});

export default router;
