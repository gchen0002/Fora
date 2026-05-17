import { Hono } from "hono";
import { cors } from "hono/cors";

import { requireUser } from "./auth";
import {
  deleteStaleSourceOpportunities,
  deleteUserAction,
  getCandidateOpportunities,
  getExploreOpportunities,
  getProfile,
  getSavedOpportunityIds,
  recordSourceReview,
  recordUserAction,
  upsertOpportunity,
  upsertProfile,
} from "./db";
import { buildDailyStack, buildExploreMore } from "./matching";
import type { Env, IngestOpportunity, IngestSourceReview, Profile } from "./types";
import { parseJsonList } from "./serialization";

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
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "fora-api",
  }),
);

app.get("/api/profile", requireUser, async (c) => {
  const profile = await getProfile(c.env, c.get("clerkUserId"));

  return c.json({
    profile: profile ? toProfileResponse(profile) : null,
    profileComplete: Boolean(profile),
  });
});

app.put("/api/profile", requireUser, async (c) => {
  const body = await c.req.json<ProfilePayload>();

  if (!isValidProfilePayload(body)) {
    return c.json({ error: "Invalid profile payload" }, 400);
  }

  const profile = await upsertProfile(c.env, c.get("clerkUserId"), {
    display_name: emptyToNull(body.displayName),
    location_text: emptyToNull(body.locationText),
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    mileage_range: body.mileageRange ?? null,
    experience_level: emptyToNull(body.experienceLevel),
    remote_preference: emptyToNull(body.remotePreference),
    cost_sensitivity: Boolean(body.costSensitive),
    identity_tags: body.identityTags,
    access_need_tags: body.accessNeedTags,
    interest_tags: body.interestTags,
    goal_tags: body.goalTags,
  });

  return c.json({
    profile: profile ? toProfileResponse(profile) : null,
    profileComplete: Boolean(profile),
  });
});

app.get("/api/daily-stack", requireUser, async (c) => {
  const clerkUserId = c.get("clerkUserId");
  const [profile, opportunities] = await Promise.all([
    getProfile(c.env, clerkUserId),
    getCandidateOpportunities(c.env, clerkUserId),
  ]);

  const stack = buildDailyStack(opportunities, profile);

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

  const stack = buildExploreMore(opportunities, profile);

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

app.get("/api/actions/saved", requireUser, async (c) => {
  const opportunityIds = await getSavedOpportunityIds(c.env, c.get("clerkUserId"));

  return c.json({
    opportunityIds,
  });
});

app.delete("/api/actions", requireUser, async (c) => {
  const clerkUserId = c.get("clerkUserId");
  const body = await c.req.json<{
    opportunityId?: string;
    action?: "save" | "dismiss" | "share" | "applied";
  }>();

  if (!body.opportunityId || !body.action) {
    return c.json({ error: "opportunityId and action are required" }, 400);
  }

  const deleted = await deleteUserAction(
    c.env,
    clerkUserId,
    body.opportunityId,
    body.action,
  );

  return c.json({
    deleted,
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
    replaceSources?: string[];
  }>();
  const opportunities = body.opportunities ?? [];
  const reviews = body.reviews ?? [];
  const replaceSources = body.replaceSources ?? [];

  if (
    !Array.isArray(opportunities) ||
    !Array.isArray(reviews) ||
    !Array.isArray(replaceSources)
  ) {
    return c.json(
      { error: "opportunities, reviews, and replaceSources must be arrays" },
      400,
    );
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

  const deleted = await deleteStaleSourceOpportunities(
    c.env,
    replaceSources,
    opportunities.map((opportunity) => opportunity.url),
  );

  return c.json({
    ingested: ids.length,
    reviewed: reviewIds.length,
    deleted,
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

interface ProfilePayload {
  displayName?: string | null;
  locationText?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mileageRange?: number | null;
  experienceLevel?: string | null;
  remotePreference?: string | null;
  costSensitive?: boolean;
  identityTags?: string[];
  accessNeedTags?: string[];
  interestTags?: string[];
  goalTags?: string[];
}

function isValidProfilePayload(payload: ProfilePayload) {
  return (
    isOptionalString(payload.displayName) &&
    isOptionalString(payload.locationText) &&
    isOptionalNumber(payload.latitude) &&
    isOptionalNumber(payload.longitude) &&
    isOptionalNumber(payload.mileageRange) &&
    isOptionalString(payload.experienceLevel) &&
    isOptionalString(payload.remotePreference) &&
    isOptionalStringList(payload.identityTags) &&
    isOptionalStringList(payload.accessNeedTags) &&
    isOptionalStringList(payload.interestTags) &&
    isOptionalStringList(payload.goalTags)
  );
}

function toProfileResponse(profile: Profile) {
  return {
    displayName: profile.display_name,
    locationText: profile.location_text,
    latitude: profile.latitude,
    longitude: profile.longitude,
    mileageRange: profile.mileage_range,
    experienceLevel: profile.experience_level,
    remotePreference: profile.remote_preference,
    costSensitive: Boolean(profile.cost_sensitivity),
    identityTags: parseJsonList(profile.identity_tags),
    accessNeedTags: parseJsonList(profile.access_need_tags),
    interestTags: parseJsonList(profile.interest_tags),
    goalTags: parseJsonList(profile.goal_tags),
  };
}

function emptyToNull(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isOptionalString(value: unknown) {
  return value === undefined || value === null || typeof value === "string";
}

function isOptionalNumber(value: unknown) {
  return value === undefined || value === null || typeof value === "number";
}

function isOptionalStringList(value: unknown) {
  return (
    value === undefined ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}
