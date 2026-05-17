import { apiUrl } from "./url";

const PROFILE_REQUEST_TIMEOUT_MS = 15_000;

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

export async function fetchProfile(token: string, signal?: AbortSignal) {
  return withTimeout(signal, async (requestSignal) => {
    const response = await fetch(apiUrl("/api/profile"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: requestSignal,
    });

    if (!response.ok) {
      throw new Error(`Profile request failed: ${response.status}`);
    }

    return response.json() as Promise<ProfileResponse>;
  });
}

export async function saveProfile(
  token: string,
  profile: ProfilePayload,
  signal?: AbortSignal,
) {
  return withTimeout(signal, async (requestSignal) => {
    const response = await fetch(apiUrl("/api/profile"), {
      body: JSON.stringify(profile),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      signal: requestSignal,
    });

    if (!response.ok) {
      const detail = await response.text();

      throw new Error(
        `Profile save failed: ${response.status}${detail ? ` ${detail}` : ""}`,
      );
    }

    return response.json() as Promise<ProfileResponse>;
  });
}

async function withTimeout<T>(
  signal: AbortSignal | undefined,
  request: (signal: AbortSignal) => Promise<T>,
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), PROFILE_REQUEST_TIMEOUT_MS);

  function abortFromParent() {
    controller.abort();
  }

  signal?.addEventListener("abort", abortFromParent, { once: true });

  try {
    return await request(controller.signal);
  } catch (cause) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new Error("Profile request timed out. Check that the local Worker is running.");
    }

    throw cause;
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortFromParent);
  }
}
