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
      ORDER BY updated_at DESC
      LIMIT 50
    `,
  )
    .bind(clerkUserId)
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
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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
