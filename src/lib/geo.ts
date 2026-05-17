const knownLocations = [
  { aliases: ["san francisco", "sf"], latitude: 37.7749, longitude: -122.4194 },
  { aliases: ["san jose"], latitude: 37.3382, longitude: -121.8863 },
  { aliases: ["sunnyvale"], latitude: 37.3688, longitude: -122.0363 },
  { aliases: ["mountain view"], latitude: 37.3861, longitude: -122.0839 },
  { aliases: ["palo alto"], latitude: 37.4419, longitude: -122.143 },
  { aliases: ["berkeley"], latitude: 37.8715, longitude: -122.273 },
  { aliases: ["los angeles", "la"], latitude: 34.0522, longitude: -118.2437 },
  { aliases: ["new york", "nyc", "new york city"], latitude: 40.7128, longitude: -74.006 },
  { aliases: ["boston"], latitude: 42.3601, longitude: -71.0589 },
  { aliases: ["chicago"], latitude: 41.8781, longitude: -87.6298 },
  { aliases: ["seattle"], latitude: 47.6062, longitude: -122.3321 },
  { aliases: ["austin"], latitude: 30.2672, longitude: -97.7431 },
  { aliases: ["atlanta"], latitude: 33.749, longitude: -84.388 },
  { aliases: ["toronto"], latitude: 43.6532, longitude: -79.3832 },
  { aliases: ["vancouver"], latitude: 49.2827, longitude: -123.1207 },
  { aliases: ["sydney"], latitude: -33.8688, longitude: 151.2093 },
  { aliases: ["singapore"], latitude: 1.3521, longitude: 103.8198 },
];

export function geocodeKnownLocation(value: string | null | undefined) {
  const normalized = normalizeLocation(value);
  if (!normalized) return null;

  return (
    knownLocations.find((location) =>
      location.aliases.some((alias) => normalized.includes(alias)),
    ) ?? null
  );
}

function normalizeLocation(value: string | null | undefined) {
  return value
    ?.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
