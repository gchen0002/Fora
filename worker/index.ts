import { Hono } from "hono";
import { cors } from "hono/cors";

import { requireUser } from "./auth";
import {
  getCandidateOpportunities,
  getExploreOpportunities,
  getProfile,
  recordSourceReview,
  recordUserAction,
  upsertOpportunity,
} from "./db";
import { scoreDailyStack } from "./matching";
import type { Env, IngestOpportunity, IngestSourceReview } from "./types";

const app = new Hono<{
  Bindings: Env;
  Variables: {
    clerkUserId: string;
  };
}>();

app.use(
  "/api/*",
  cors({
    origin: (origin, c) => {
      if (c.env.FRONTEND_ORIGIN) return c.env.FRONTEND_ORIGIN;
      if (origin && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return origin;
      }

      return origin;
    },
    allowHeaders: ["Authorization", "Content-Type", "x-admin-ingest-secret"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "fora-api",
  }),
);

app.get("/api/daily-stack", requireUser, async (c) => {
  const clerkUserId = c.get("clerkUserId");
  const [profile, opportunities] = await Promise.all([
    getProfile(c.env, clerkUserId),
    getCandidateOpportunities(c.env, clerkUserId),
  ]);

  const stack = scoreDailyStack(opportunities, profile).slice(0, 10);

  return c.json({
    stack,
    profileComplete: Boolean(profile),
  });
});

app.get("/api/explore-more", requireUser, async (c) => {
  const clerkUserId = c.get("clerkUserId");
  const [profile, opportunities] = await Promise.all([
    getProfile(c.env, clerkUserId),
    getExploreOpportunities(c.env, clerkUserId),
  ]);

  const stack = scoreDailyStack(opportunities, profile).slice(10, 35);

  return c.json({
    opportunities: stack,
    profileComplete: Boolean(profile),
  });
});

app.post("/api/actions", requireUser, async (c) => {
  const clerkUserId = c.get("clerkUserId");
  const body = await c.req.json<{
    opportunityId?: string;
    action?: "save" | "dismiss" | "share" | "applied";
    playlistName?: string | null;
  }>();

  if (!body.opportunityId || !body.action) {
    return c.json({ error: "opportunityId and action are required" }, 400);
  }

  const actionId = await recordUserAction(
    c.env,
    clerkUserId,
    body.opportunityId,
    body.action,
    body.playlistName ?? null,
  );

  return c.json({
    id: actionId,
  });
});

app.post("/api/admin/ingest", async (c) => {
  const secret = c.req.header("x-admin-ingest-secret");

  if (!secret || secret !== c.env.ADMIN_INGEST_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json<{
    opportunities?: IngestOpportunity[];
    reviews?: IngestSourceReview[];
  }>();
  const opportunities = body.opportunities ?? [];
  const reviews = body.reviews ?? [];

  if (!Array.isArray(opportunities) || !Array.isArray(reviews)) {
    return c.json({ error: "opportunities and reviews must be arrays" }, 400);
  }

  if (opportunities.length === 0 && reviews.length === 0) {
    return c.json(
      { error: "opportunities or reviews must be a non-empty array" },
      400,
    );
  }

  const ids: string[] = [];
  const reviewIds: string[] = [];

  for (const review of reviews) {
    if (!isValidIngestSourceReview(review)) {
      return c.json({ error: "Invalid source review payload" }, 400);
    }

    reviewIds.push(await recordSourceReview(c.env, review));
  }

  for (const opportunity of opportunities) {
    if (!isValidIngestOpportunity(opportunity)) {
      return c.json({ error: "Invalid opportunity payload" }, 400);
    }

    ids.push(await upsertOpportunity(c.env, opportunity));
  }

  return c.json({
    ingested: ids.length,
    reviewed: reviewIds.length,
    ids,
    reviewIds,
  });
});

export default app;

function isValidIngestOpportunity(
  opportunity: IngestOpportunity,
): opportunity is IngestOpportunity {
  return Boolean(
    opportunity.title &&
      opportunity.organization &&
      opportunity.description &&
      opportunity.url &&
      opportunity.source &&
      opportunity.category,
  );
}

function isValidIngestSourceReview(
  review: IngestSourceReview,
): review is IngestSourceReview {
  return Boolean(
    review.submitted_url &&
      review.source &&
      ["accept", "quarantine", "reject"].includes(review.decision),
  );
}
