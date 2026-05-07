import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));

// Stripe webhooks need the raw body for signature verification — must come before express.json()
app.use("/api/billing/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

// Serve the bundled React frontend in production.
// The build:full script copies mechanic-translator/dist/public → dist/public.
// On Replit the directory won't exist (frontend runs as a separate service), so this is a no-op.
const publicDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "public",
);

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // SPA fallback — any non-API path serves index.html so client-side routing works
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

export default app;
