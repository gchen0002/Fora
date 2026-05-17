import { fetchWithTimeout } from "./request";
import { apiUrl } from "./url";

export async function submitOpportunityUrl(
  token: string,
  payload: { url: string; note?: string | null },
) {
  const response = await fetchWithTimeout(
    apiUrl("/api/submitted-sources"),
    {
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
    "Opportunity URL submission timed out.",
  );

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Opportunity URL submission failed: ${response.status}${
        detail ? ` ${detail}` : ""
      }`,
    );
  }

  return response.json() as Promise<{ id: string; url: string }>;
}
