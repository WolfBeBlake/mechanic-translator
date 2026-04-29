import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";

export interface AuthedRequest extends Request {
  clerkUserId: string;
  user: User;
}

export const FREE_LIMIT = 2;

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAIL ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

/**
 * Resolves the Clerk user, creates a local user row if missing,
 * and attaches { clerkUserId, user } to the request.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, clerkUserId));

    let user = existing;
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const email =
        clerkUser.primaryEmailAddress?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        "";
      const [inserted] = await db
        .insert(usersTable)
        .values({ clerkUserId, email })
        .returning();
      user = inserted;
    }

    (req as AuthedRequest).clerkUserId = clerkUserId;
    (req as AuthedRequest).user = user;
    next();
  } catch (err) {
    req.log.error({ err }, "requireAuth failed");
    res.status(500).json({ error: "Failed to resolve user" });
  }
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = (req as AuthedRequest).user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (!isAdminEmail(user.email)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
