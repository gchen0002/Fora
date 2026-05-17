import { apiUrl } from "./url";

type OpportunityAction = "save" | "dismiss" | "share" | "applied";

export async function fetchSavedOpportunityIds(token: string) {
  const response = await fetch(apiUrl("/api/actions/saved"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  const response = await fetch(apiUrl("/api/actions"), {
    body: JSON.stringify({ opportunityId, action }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

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
  const response = await fetch(apiUrl("/api/actions"), {
    body: JSON.stringify({ opportunityId, action }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

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
