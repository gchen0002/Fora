import { apiUrl } from "./url";

export interface FeaturedOpportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string;
  locationText: string | null;
  isRemote: boolean;
  deadline: string | null;
  accessibilityTags: string[];
  topicTags: string[];
  experienceLevelTags: string[];
  imageUrl: string | null;
  imageKind: "logo" | "poster" | "banner" | "photo" | "unknown";
  match: number;
  url: string;
}

export async function fetchFeaturedOpportunities(signal?: AbortSignal) {
  const response = await fetch(apiUrl("/api/featured-opportunities"), {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Featured opportunities request failed: ${response.status}`);
  }

  return response.json() as Promise<{ opportunities: FeaturedOpportunity[] }>;
}
