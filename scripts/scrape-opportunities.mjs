import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { config as loadEnv } from "dotenv";

import { runSourceAdapter } from "./ingest/adapters.mjs";
import { dedupeByUrl, splitByDecision } from "./ingest/core.mjs";

loadEnv({ path: ".env.local" });

const defaultSourcesPath = "data/ingest-sources.json";
const defaultOutputPath = "data/opportunities.scraped.json";
const defaultReviewOutputPath = "data/ingestion-reviews.json";

const args = new Set(process.argv.slice(2));
const shouldPush = args.has("--push");
const sourcesPath = getArgValue("--sources") ?? defaultSourcesPath;
const outputPath = getArgValue("--out") ?? defaultOutputPath;
const reviewOutputPath = getArgValue("--reviews-out") ?? defaultReviewOutputPath;
const apiUrl =
  getArgValue("--api-url") ??
  process.env.INGEST_API_URL ??
  "http://127.0.0.1:8787/api/admin/ingest";

const sources = JSON.parse(await readFile(resolve(sourcesPath), "utf8"));
const results = [];

for (const source of expandSources(sources)) {
  try {
    results.push(...(await runSourceAdapter(source)));
  } catch (error) {
    console.warn(
      `Skipped ${source.name ?? source.url}: ${
        error instanceof Error ? error.message : "unknown source error"
      }`,
    );
  }
}

const decisions = splitByDecision(results);
const acceptedOpportunities = dedupeByUrl(decisions.accepted);

await writeJson(outputPath, acceptedOpportunities);
await writeJson(reviewOutputPath, decisions.reviews);

console.log(
  [
    `Accepted ${acceptedOpportunities.length} opportunities into ${outputPath}`,
    `Quarantined ${decisions.quarantined.length}`,
    `Rejected ${decisions.rejected.length}`,
    `Wrote ${decisions.reviews.length} reviews into ${reviewOutputPath}`,
  ].join("\n"),
);

if (shouldPush) {
  await pushToIngestEndpoint(
    apiUrl,
    acceptedOpportunities,
    decisions.reviews,
    getReplaceSources(acceptedOpportunities),
  );
}

async function pushToIngestEndpoint(url, opportunities, reviews, replaceSources) {
  const secret = process.env.ADMIN_INGEST_SECRET;

  if (!secret) {
    throw new Error("ADMIN_INGEST_SECRET is required when using --push");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-ingest-secret": secret,
    },
    body: JSON.stringify({ opportunities, reviews, replaceSources }),
  });

  if (!response.ok) {
    throw new Error(
      `Ingest failed with ${response.status}: ${await response.text()}`,
    );
  }

  console.log(
    `Pushed ${opportunities.length} opportunities and ${reviews.length} reviews to ${url}`,
  );
}

function expandSources(sources) {
  return sources.flatMap((source) => {
    if (source.type !== "submitted-links") return [source];

    return (source.urls ?? []).map((url, index) => ({
      ...source,
      type: "submitted-url",
      name: source.name ?? `Submitted URL ${index + 1}`,
      url,
      submittedUrl: url,
      source: source.source ?? "user-submitted",
    }));
  });
}

async function writeJson(path, value) {
  await writeFile(resolve(path), `${JSON.stringify(value, null, 2)}\n`);
}

function getArgValue(name) {
  const arg = process.argv.find((item) => item.startsWith(`${name}=`));
  return arg?.split("=").slice(1).join("=");
}

function getReplaceSources(opportunities) {
  return [...new Set(opportunities.map((opportunity) => opportunity.source))];
}
