import app from "./app";
import { logger } from "./lib/logger";
import { checkDatabaseConnection } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  logger.fatal("PORT environment variable is required but was not provided.");
  process.exit(1);
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  logger.fatal({ value: rawPort }, "Invalid PORT value — must be a positive integer.");
  process.exit(1);
}

async function start() {
  // --- Database ---
  try {
    await checkDatabaseConnection();
    logger.info("Database connection verified");
  } catch (err) {
    logger.error(
      { err },
      "Database connection failed. Check DATABASE_URL and, for Supabase/Neon, " +
        "ensure SSL is enabled (DATABASE_SSL=true) or the connection string includes sslmode=require. " +
        "The server will start but all DB-backed routes will return errors.",
    );
    // Do not exit — static files and healthz still work, which helps diagnose
    // deployment issues without a full restart loop.
  }

  // --- Anthropic ---
  const hasAnthropicKey = !!(
    process.env.ANTHROPIC_API_KEY ||
    process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY
  );
  if (!hasAnthropicKey) {
    logger.warn(
      "ANTHROPIC_API_KEY is not set — POST /api/translate will return 502 until this is configured.",
    );
  }

  // --- Clerk ---
  if (!process.env.CLERK_SECRET_KEY) {
    logger.warn(
      "CLERK_SECRET_KEY is not set — authentication will not work.",
    );
  }

  // --- Start listening ---
  const server = app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      logger.fatal({ port }, "Port is already in use — cannot start server.");
    } else {
      logger.fatal({ err }, "Server failed to start.");
    }
    process.exit(1);
  });
}

start().catch((err) => {
  logger.fatal({ err }, "Unhandled startup error");
  process.exit(1);
});
