import { createClerkClient } from "@clerk/backend";
import type { Context, Next } from "hono";

import type { Env } from "./types";

type AppContext = Context<{
  Bindings: Env;
  Variables: {
    clerkUserId: string;
  };
}>;

export async function requireUser(c: AppContext, next: Next) {
  const clerkClient = createClerkClient({
    secretKey: c.env.CLERK_SECRET_KEY,
  });

  const authorizedParties = c.env.FRONTEND_ORIGIN
    ? [c.env.FRONTEND_ORIGIN]
    : undefined;

  const authResult = await clerkClient.authenticateRequest(c.req.raw, {
    authorizedParties,
  });

  if (!authResult.isAuthenticated) {
    return c.json({ error: "Authentication required" }, 401);
  }

  const auth = authResult.toAuth();

  if (!auth.userId) {
    return c.json({ error: "Authentication required" }, 401);
  }

  c.set("clerkUserId", auth.userId);
  await next();
}
