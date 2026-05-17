import { apiUrl } from "./url";

export interface ApiStackOpportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  url: string;
  source: string;
  category: string;
  locationText: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceMiles: number | null;
  isRemote: boolean;
  deadline: string | null;
  cost: string | null;
  eligibilityTags: string[];
  accessibilityTags: string[];
  topicTags: string[];
  experienceLevelTags: string[];
  imageUrl: string | null;
  imageKind: "logo" | "poster" | "banner" | "photo" | "unknown";
  fitScore: number;
  matchReasons: string[];
}

export interface DailyStackResponse {
  stack: ApiStackOpportunity[];
  profileComplete: boolean;
}

export interface ExploreMoreResponse {
  opportunities: ApiStackOpportunity[];
  profileComplete: boolean;
}

export async function fetchDailyStack(token: string) {
  const response = await fetch(apiUrl("/api/daily-stack"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Daily Stack request failed: ${response.status}${
        detail ? ` ${detail}` : ""
      }`,
    );
  }

  return response.json() as Promise<DailyStackResponse>;
}

export async function fetchExploreMore(token: string) {
  const response = await fetch(apiUrl("/api/explore-more"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Explore More request failed: ${response.status}${
        detail ? ` ${detail}` : ""
      }`,
    );
  }

  return response.json() as Promise<ExploreMoreResponse>;
}
