import { geocodeLocation } from "@/data/locations";

export async function geocodeKnownLocation(value: string | null | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  if (!normalized || ["remote", "virtual", "online", "anywhere"].includes(normalized)) {
    return null;
  }

  return (await geocodeLocation(value ?? "")) ?? null;
}
