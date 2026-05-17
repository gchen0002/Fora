import { verifyToken } from "@clerk/backend";
import type { Context, Next } from "hono";

import type { Env } from "./types";

type AppContext = Context<{
  Bindings: Env;
  Variables: {
    clerkUserId: string;
  };
}>;

export async function requireUser(c: AppContext, next: Next) {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return c.json({ error: "Authentication required" }, 401);
  }

  const token = authorization.slice("Bearer ".length);
  const payload = await verifyToken(token, {
    secretKey: c.env.CLERK_SECRET_KEY,
  }).catch(() => null);

  if (!payload?.sub) {
    return c.json({ error: "Authentication required" }, 401);
  }

  c.set("clerkUserId", payload.sub);
  await next();
}
