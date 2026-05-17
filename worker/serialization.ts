import type { Opportunity, OpportunityRow } from "./types";

export function parseJsonList(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function stringifyList(value: string[] | undefined): string {
  return JSON.stringify(value ?? []);
}

export function toOpportunity(row: OpportunityRow): Opportunity {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    description: row.description,
    url: row.url,
    source: row.source,
    category: row.category,
    locationText: row.location_text,
    latitude: row.latitude,
    longitude: row.longitude,
    isRemote: row.is_remote === 1,
    deadline: row.deadline,
    cost: row.cost,
    eligibilityTags: parseJsonList(row.eligibility_tags),
    accessibilityTags: parseJsonList(row.accessibility_tags),
    topicTags: parseJsonList(row.topic_tags),
    experienceLevelTags: parseJsonList(row.experience_level_tags),
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
