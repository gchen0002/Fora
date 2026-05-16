export interface ApiStackOpportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  url: string;
  source: string;
  category: string;
  locationText: string | null;
  isRemote: boolean;
  deadline: string | null;
  cost: string | null;
  eligibilityTags: string[];
  accessibilityTags: string[];
  topicTags: string[];
  experienceLevelTags: string[];
  imageUrl: string | null;
  fitScore: number;
  matchReasons: string[];
}

export interface DailyStackResponse {
  stack: ApiStackOpportunity[];
  profileComplete: boolean;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchDailyStack(token: string) {
  const response = await fetch(`${apiBaseUrl}/api/daily-stack`, {
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
