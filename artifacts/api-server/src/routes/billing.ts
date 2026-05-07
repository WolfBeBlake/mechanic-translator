import { Router, type IRouter, type Request } from "express";
import Stripe from "stripe";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-04-22.dahlia" });
}

// POST /billing/checkout — create a Stripe Checkout Session for Pro plan
router.post("/billing/checkout", requireAuth, async (req, res): Promise<void> => {
  const stripe = getStripe();

  if (!stripe || !process.env.STRIPE_PRICE_ID) {
    res.json({
      configured: false,
      url: null,
      message:
        "Pro checkout isn't switched on yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to enable payments.",
    });
    return;
  }

  const user = (req as Request & { user: { id: number; email: string; stripeCustomerId: string | null } }).user;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    customer: user.stripeCustomerId ?? undefined,
    customer_email: user.stripeCustomerId ? undefined : user.email,
    metadata: { userId: String(user.id) },
    success_url: `${req.headers.origin ?? ""}/app?upgraded=1`,
    cancel_url: `${req.headers.origin ?? ""}/pricing?cancelled=1`,
  });

  res.json({ configured: true, url: session.url });
});

// POST /billing/webhook — receive and verify Stripe events
router.post("/billing/webhook", async (req, res): Promise<void> => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    res.status(400).json({ error: "Webhook not configured" });
    return;
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    res.status(400).json({ error: "Missing stripe-signature header" });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.warn({ message }, "Stripe webhook signature verification failed");
    res.status(400).json({ error: `Webhook signature verification failed: ${message}` });
    return;
  }

  logger.info({ type: event.type }, "Stripe webhook received");

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.userId;
        if (!userId) break;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : (session.customer as Stripe.Customer | null)?.id ?? null;

        await db
          .update(usersTable)
          .set({
            subscriptionTier: "pro",
            ...(customerId ? { stripeCustomerId: customerId } : {}),
          })
          .where(eq(usersTable.id, Number(userId)));

        logger.info({ userId, customerId }, "User upgraded to Pro");
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : (subscription.customer as Stripe.Customer).id;

        await db
          .update(usersTable)
          .set({ subscriptionTier: "free" })
          .where(eq(usersTable.stripeCustomerId, customerId));

        logger.info({ customerId }, "User downgraded to Free (subscription deleted)");
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : (subscription.customer as Stripe.Customer).id;

        const tier =
          subscription.status === "active" || subscription.status === "trialing"
            ? "pro"
            : "free";

        await db
          .update(usersTable)
          .set({ subscriptionTier: tier })
          .where(eq(usersTable.stripeCustomerId, customerId));

        logger.info({ customerId, tier, status: subscription.status }, "Subscription updated");
        break;
      }

      default:
        logger.info({ type: event.type }, "Unhandled Stripe event type");
    }
  } catch (err) {
    logger.error({ err, eventType: event.type }, "Error processing Stripe webhook event");
    res.status(500).json({ error: "Internal error processing webhook" });
    return;
  }

  res.json({ received: true });
});

export default router;
