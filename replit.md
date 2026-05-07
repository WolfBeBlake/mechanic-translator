# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

Currently houses **MechanicTranslator** — a full-stack web app that decodes
mechanic quotes into plain English with urgency ratings, fair-price ranges
(EUR, Ireland/UK), red flags, and ready-to-use negotiation scripts.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React 19 + Vite + Tailwind v4 + shadcn UI + Wouter routing
- **Auth**: Clerk (whitelabel, proxied through `/api/__clerk` in production)
- **AI**: Anthropic Claude Sonnet 4.5 via Replit AI Integrations proxy (no API key required)

## Artifacts

- `artifacts/mechanic-translator` — React + Vite frontend (path `/`)
- `artifacts/api-server` — Express API (path `/api`)
- `artifacts/mockup-sandbox` — design preview sandbox (path `/__mockup`)

## MechanicTranslator pages

- `/` — Marketing landing for signed-out users; redirects signed-in users to `/app`
- `/sign-in/*?` and `/sign-up/*?` — Clerk auth pages (custom branded theme)
- `/app` — Translator (paste quote → AI breakdown)
- `/history`, `/history/:id` — User's past translations
- `/pricing` — Free vs Pro plans (Pro €4.99/mo)
- `/admin` — Admin dashboard, gated by `ADMIN_EMAIL` env var

## Freemium model

- Free users: 2 translations total, then `POST /api/translate` returns 402 with `code: "FREE_QUOTA_EXHAUSTED"` → frontend shows paywall modal.
- Pro users: unlimited.
- Stripe is intentionally stubbed in this build (free tier blocks third-party connectors). `POST /api/billing/checkout` returns `{ configured: false, message: "..." }` until `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` env vars are set, after which the route should be wired to `stripe.checkout.sessions.create(...)`.

## Database schema (lib/db)

- `users` — { id, clerkUserId (unique), email, subscriptionTier (free|pro), translationsUsed, stripeCustomerId, createdAt }
- `translations` — { id, userId fk, inputText, result jsonb, createdAt }

User rows are auto-created on first authenticated `/api/me` call.

## Environment variables

Auto-provisioned on Replit (do not set manually):
- `DATABASE_URL` — Replit Postgres
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`, `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic via Replit proxy
- `SESSION_SECRET`

Required when deploying outside Replit (e.g. Render.com):
- `ANTHROPIC_API_KEY` — standard Anthropic API key (uses api.anthropic.com directly; takes priority over Replit proxy vars)
- `DATABASE_URL` — Postgres connection string
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` — from Clerk dashboard
- `VITE_CLERK_PUBLISHABLE_KEY` — same value as `CLERK_PUBLISHABLE_KEY` (needed at Vite build time)
- `SESSION_SECRET` — any long random string

Optional (set when ready):
- `ADMIN_EMAIL` — comma-separated emails granted access to `/admin`
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` — to enable real Pro checkout (stubbed by default)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db exec drizzle-kit push --force` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
