import { geocodeLocation } from "@/data/locations";

export async function geocodeKnownLocation(value: string | null | undefined) {
  return (await geocodeLocation(value ?? "")) ?? null;
}
