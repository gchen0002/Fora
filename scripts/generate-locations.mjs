import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const { getAllCitiesOfCountry, getStatesOfCountry } = await import(
  "@countrystatecity/countries"
);

const states = await getStatesOfCountry("US");
const stateMap = new Map(states.map((s) => [s.iso2, s.name]));

const cities = await getAllCitiesOfCountry("US");

const entries = cities.map((c) => ({
  l: `${c.name}, ${c.state_code}`,
  la: parseFloat(c.latitude),
  lo: parseFloat(c.longitude),
}));

const output = `// Generated from @countrystatecity/countries — do not edit directly
// ${cities.length} US cities across ${states.length} states/territories

export interface CityEntry {
  l: string;
  la: number;
  lo: number;
}

export const US_CITIES: CityEntry[] = ${JSON.stringify(entries)};\n`;

const outPath = resolve("src/data/generated/us-cities.ts");
await writeFile(outPath, output);

console.log(`Wrote ${entries.length} cities to ${outPath}`);
