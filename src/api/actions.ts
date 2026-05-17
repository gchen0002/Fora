import { apiUrl } from "./url";
import { fetchWithTimeout } from "./request";

type OpportunityAction = "save" | "dismiss" | "share" | "applied";

export async function fetchSavedOpportunityIds(token: string) {
  const response = await fetchWithTimeout(
    apiUrl("/api/actions/saved"),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    "Saved opportunities request timed out.",
  );

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Saved opportunities request failed: ${response.status}${
        detail ? ` ${detail}` : ""
      }`,
    );
  }

  return response.json() as Promise<{ opportunityIds: string[] }>;
}

export async function recordOpportunityAction(
  token: string,
  opportunityId: string,
  action: OpportunityAction,
) {
  const response = await fetchWithTimeout(
    apiUrl("/api/actions"),
    {
      body: JSON.stringify({ opportunityId, action }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
    "Opportunity action request timed out.",
  );

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Opportunity action failed: ${response.status}${detail ? ` ${detail}` : ""}`,
    );
  }

  return response.json() as Promise<{ id: string }>;
}

export async function deleteOpportunityAction(
  token: string,
  opportunityId: string,
  action: OpportunityAction,
) {
  const response = await fetchWithTimeout(
    apiUrl("/api/actions"),
    {
      body: JSON.stringify({ opportunityId, action }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    },
    "Opportunity action delete request timed out.",
  );

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Opportunity action delete failed: ${response.status}${
        detail ? ` ${detail}` : ""
      }`,
    );
  }

  return response.json() as Promise<{ deleted: number }>;
}
