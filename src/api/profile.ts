import { apiUrl } from "./url";

export interface UserProfile {
  displayName: string | null;
  locationText: string | null;
  latitude: number | null;
  longitude: number | null;
  mileageRange: number | null;
  experienceLevel: string | null;
  remotePreference: string | null;
  costSensitive: boolean;
  identityTags: string[];
  accessNeedTags: string[];
  interestTags: string[];
  goalTags: string[];
}

export interface ProfileResponse {
  profile: UserProfile | null;
  profileComplete: boolean;
}

export type ProfilePayload = Partial<UserProfile>;

export async function fetchProfile(token: string) {
  const response = await fetch(apiUrl("/api/profile"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Profile request failed: ${response.status}`);
  }

  return response.json() as Promise<ProfileResponse>;
}

export async function saveProfile(token: string, profile: ProfilePayload) {
  const response = await fetch(apiUrl("/api/profile"), {
    body: JSON.stringify(profile),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
  });

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Profile save failed: ${response.status}${detail ? ` ${detail}` : ""}`,
    );
  }

  return response.json() as Promise<ProfileResponse>;
}
