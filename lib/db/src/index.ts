import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Log clearly but do not throw — let the server start so health checks can
  // still respond. Every DB query will fail with a clear error message.
  console.error(
    "[db] DATABASE_URL is not set — all database queries will fail. " +
      "Set this environment variable and restart the server.",
  );
}

// Enable SSL for hosted Postgres providers (Supabase session pooler, Neon, etc.).
// Supabase's session pooler requires SSL but does not need certificate verification.
// Override with DATABASE_SSL=false if your provider does not require SSL.
function shouldUseSSL(): boolean {
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.DATABASE_SSL === "true") return true;
  // Auto-detect common hosted providers from the connection string
  if (!connectionString) return false;
  return (
    connectionString.includes("supabase.com") ||
    connectionString.includes("neon.tech") ||
    connectionString.includes("pooler.supabase") ||
    connectionString.includes("render.com") ||
    // If the URL already includes sslmode=require, pg handles it natively
    // but we add the ssl option too for compatibility with session poolers
    connectionString.includes("sslmode=require")
  );
}

export const pool = new Pool({
  connectionString,
  ...(shouldUseSSL() && { ssl: { rejectUnauthorized: false } }),
});

export const db = drizzle(pool, { schema });

export * from "./schema";

/** Verifies the database is reachable. Call once at startup. */
export async function checkDatabaseConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}
