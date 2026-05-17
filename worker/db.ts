import { stringifyList, toOpportunity } from "./serialization";
import type {
  Env,
  IngestOpportunity,
  IngestSourceReview,
  OpportunityRow,
  Profile,
} from "./types";

export async function getProfile(env: Env, clerkUserId: string) {
  return env.DB.prepare(
    "SELECT * FROM profiles WHERE clerk_user_id = ? LIMIT 1",
  )
    .bind(clerkUserId)
    .first<Profile>();
}

export async function upsertProfile(
  env: Env,
  clerkUserId: string,
  profile: {
    display_name?: string | null;
    location_text?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    mileage_range?: number | null;
    experience_level?: string | null;
    remote_preference?: string | null;
    cost_sensitivity?: boolean;
    identity_tags?: string[];
    access_need_tags?: string[];
    interest_tags?: string[];
    goal_tags?: string[];
  },
) {
  const id = crypto.randomUUID();

  await env.DB.prepare(
    `
      INSERT INTO profiles (
        id,
        clerk_user_id,
        display_name,
        location_text,
        latitude,
        longitude,
        mileage_range,
        experience_level,
        remote_preference,
        cost_sensitivity,
        identity_tags,
        access_need_tags,
        interest_tags,
        goal_tags,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(clerk_user_id) DO UPDATE SET
        display_name = excluded.display_name,
        location_text = excluded.location_text,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        mileage_range = excluded.mileage_range,
        experience_level = excluded.experience_level,
        remote_preference = excluded.remote_preference,
        cost_sensitivity = excluded.cost_sensitivity,
        identity_tags = excluded.identity_tags,
        access_need_tags = excluded.access_need_tags,
        interest_tags = excluded.interest_tags,
        goal_tags = excluded.goal_tags,
        updated_at = CURRENT_TIMESTAMP
    `,
  )
    .bind(
      id,
      clerkUserId,
      profile.display_name ?? null,
      profile.location_text ?? null,
      profile.latitude ?? null,
      profile.longitude ?? null,
      profile.mileage_range ?? null,
      profile.experience_level ?? null,
      profile.remote_preference ?? null,
      profile.cost_sensitivity ? 1 : 0,
      stringifyList(profile.identity_tags),
      stringifyList(profile.access_need_tags),
      stringifyList(profile.interest_tags),
      stringifyList(profile.goal_tags),
    )
    .run();

  return getProfile(env, clerkUserId);
}

export async function getCandidateOpportunities(env: Env, clerkUserId: string) {
  const result = await env.DB.prepare(
    `
      SELECT *
      FROM opportunities
      WHERE id NOT IN (
        SELECT opportunity_id
        FROM user_opportunity_actions
        WHERE clerk_user_id = ? AND action = 'dismiss'
      )
        AND (deadline IS NULL OR datetime(deadline) >= datetime('now'))
      ORDER BY deadline IS NULL, deadline ASC, updated_at DESC
      LIMIT 100
    `,
  )
    .bind(clerkUserId)
    .all<OpportunityRow>();

  return result.results.map(toOpportunity);
}

export async function getExploreOpportunities(env: Env, clerkUserId: string) {
  const result = await env.DB.prepare(
    `
      SELECT *
      FROM opportunities
      WHERE id NOT IN (
        SELECT opportunity_id
        FROM user_opportunity_actions
        WHERE clerk_user_id = ? AND action = 'dismiss'
      )
        AND (deadline IS NULL OR datetime(deadline) >= datetime('now'))
      ORDER BY updated_at DESC
      LIMIT 50
    `,
  )
    .bind(clerkUserId)
    .all<OpportunityRow>();

  return result.results.map(toOpportunity);
}

export async function getFeaturedOpportunities(env: Env, limit = 8) {
  const result = await env.DB.prepare(
    `
      SELECT *
      FROM opportunities
      WHERE image_url IS NOT NULL
        AND image_url != ''
        AND (deadline IS NULL OR datetime(deadline) >= datetime('now'))
      ORDER BY
        CASE category
          WHEN 'hackathon' THEN 1
          WHEN 'scholarship' THEN 2
          WHEN 'internship' THEN 3
          WHEN 'workshop' THEN 4
          WHEN 'mentorship' THEN 5
          WHEN 'community' THEN 6
          ELSE 7
        END,
        deadline IS NULL,
        deadline ASC,
        updated_at DESC
      LIMIT ?
    `,
  )
    .bind(limit)
    .all<OpportunityRow>();

  return result.results.map(toOpportunity);
}

export async function recordUserAction(
  env: Env,
  clerkUserId: string,
  opportunityId: string,
  action: "save" | "dismiss" | "share" | "applied",
  playlistName: string | null,
) {
  const id = crypto.randomUUID();

  await env.DB.prepare(
    `
      DELETE FROM user_opportunity_actions
      WHERE clerk_user_id = ?
        AND opportunity_id = ?
        AND action = ?
    `,
  )
    .bind(clerkUserId, opportunityId, action)
    .run();

  await env.DB.prepare(
    `
      INSERT INTO user_opportunity_actions (
        id,
        clerk_user_id,
        opportunity_id,
        action,
        playlist_name
      )
      VALUES (?, ?, ?, ?, ?)
    `,
  )
    .bind(id, clerkUserId, opportunityId, action, playlistName)
    .run();

  return id;
}

export async function deleteUserAction(
  env: Env,
  clerkUserId: string,
  opportunityId: string,
  action: "save" | "dismiss" | "share" | "applied",
) {
  const result = await env.DB.prepare(
    `
      DELETE FROM user_opportunity_actions
      WHERE clerk_user_id = ?
        AND opportunity_id = ?
        AND action = ?
    `,
  )
    .bind(clerkUserId, opportunityId, action)
    .run();

  return result.meta.changes ?? 0;
}

export async function getSavedOpportunityIds(env: Env, clerkUserId: string) {
  const result = await env.DB.prepare(
    `
      SELECT opportunity_id
      FROM user_opportunity_actions
      WHERE clerk_user_id = ? AND action = 'save'
      ORDER BY created_at DESC
    `,
  )
    .bind(clerkUserId)
    .all<{ opportunity_id: string }>();

  return result.results.map((row) => row.opportunity_id);
}

export async function deleteStaleSourceOpportunities(
  env: Env,
  sources: string[],
  activeUrls: string[],
) {
  const uniqueSources = [...new Set(sources.filter(Boolean))];
  const uniqueUrls = [...new Set(activeUrls.filter(Boolean))];

  if (uniqueSources.length === 0 || uniqueUrls.length === 0) return 0;

  const sourcePlaceholders = uniqueSources.map(() => "?").join(", ");
  const urlPlaceholders = uniqueUrls.map(() => "?").join(", ");
  const result = await env.DB.prepare(
    `
      DELETE FROM opportunities
      WHERE source IN (${sourcePlaceholders})
        AND url NOT IN (${urlPlaceholders})
        AND id NOT IN (
          SELECT opportunity_id
          FROM user_opportunity_actions
        )
    `,
  )
    .bind(...uniqueSources, ...uniqueUrls)
    .run();

  return result.meta.changes ?? 0;
}

export async function upsertOpportunity(env: Env, opportunity: IngestOpportunity) {
  const id = opportunity.id ?? slugify(`${opportunity.source}-${opportunity.url}`);

  await env.DB.prepare(
    `
      INSERT INTO opportunities (
        id,
        title,
        organization,
        description,
        url,
        source,
        category,
        location_text,
        latitude,
        longitude,
        is_remote,
        deadline,
        cost,
        eligibility_tags,
        accessibility_tags,
        topic_tags,
        experience_level_tags,
        image_url,
        image_kind,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(url) DO UPDATE SET
        title = excluded.title,
        organization = excluded.organization,
        description = excluded.description,
        source = excluded.source,
        category = excluded.category,
        location_text = excluded.location_text,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        is_remote = excluded.is_remote,
        deadline = excluded.deadline,
        cost = excluded.cost,
        eligibility_tags = excluded.eligibility_tags,
        accessibility_tags = excluded.accessibility_tags,
        topic_tags = excluded.topic_tags,
        experience_level_tags = excluded.experience_level_tags,
        image_url = excluded.image_url,
        image_kind = excluded.image_kind,
        updated_at = CURRENT_TIMESTAMP
    `,
  )
    .bind(
      id,
      opportunity.title,
      opportunity.organization,
      opportunity.description,
      opportunity.url,
      opportunity.source,
      opportunity.category,
      opportunity.location_text ?? null,
      opportunity.latitude ?? null,
      opportunity.longitude ?? null,
      opportunity.is_remote ? 1 : 0,
      opportunity.deadline ?? null,
      opportunity.cost ?? null,
      stringifyList(opportunity.eligibility_tags),
      stringifyList(opportunity.accessibility_tags),
      stringifyList(opportunity.topic_tags),
      stringifyList(opportunity.experience_level_tags),
      opportunity.image_url ?? null,
      opportunity.image_kind ?? "unknown",
    )
    .run();

  return id;
}

export async function recordSourceReview(env: Env, review: IngestSourceReview) {
  const id = review.id ?? slugify(`${review.source}-${review.submitted_url}`);

  await env.DB.prepare(
    `
      INSERT INTO opportunity_source_reviews (
        id,
        submitted_url,
        canonical_url,
        source,
        title,
        decision,
        relevance_score,
        source_trust_score,
        parse_confidence,
        risk_flags,
        notes,
        raw_summary,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        submitted_url = excluded.submitted_url,
        canonical_url = excluded.canonical_url,
        source = excluded.source,
        title = excluded.title,
        decision = excluded.decision,
        relevance_score = excluded.relevance_score,
        source_trust_score = excluded.source_trust_score,
        parse_confidence = excluded.parse_confidence,
        risk_flags = excluded.risk_flags,
        notes = excluded.notes,
        raw_summary = excluded.raw_summary,
        updated_at = CURRENT_TIMESTAMP
    `,
  )
    .bind(
      id,
      review.submitted_url,
      review.canonical_url ?? null,
      review.source,
      review.title ?? null,
      review.decision,
      review.relevance_score ?? 0,
      review.source_trust_score ?? 0,
      review.parse_confidence ?? 0,
      stringifyList(review.risk_flags),
      review.notes ?? null,
      review.raw_summary ?? null,
    )
    .run();

  return id;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
