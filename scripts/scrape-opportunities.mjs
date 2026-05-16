import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import * as cheerio from "cheerio";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const defaultSourcesPath = "data/ingest-sources.json";
const defaultOutputPath = "data/opportunities.scraped.json";

const args = new Set(process.argv.slice(2));
const shouldPush = args.has("--push");
const sourcesPath = getArgValue("--sources") ?? defaultSourcesPath;
const outputPath = getArgValue("--out") ?? defaultOutputPath;
const apiUrl =
  getArgValue("--api-url") ??
  process.env.INGEST_API_URL ??
  "http://127.0.0.1:8787/api/admin/ingest";

const sources = JSON.parse(await readFile(resolve(sourcesPath), "utf8"));
const opportunities = [];

for (const source of sources) {
  if (source.type === "mlh-season") {
    opportunities.push(...(await scrapeMlhSeason(source)));
    continue;
  }

  if (source.type === "generic-page") {
    opportunities.push(await scrapeGenericPage(source));
    continue;
  }

  throw new Error(`Unsupported source type: ${source.type}`);
}

const uniqueOpportunities = dedupeByUrl(opportunities);

await writeFile(
  resolve(outputPath),
  `${JSON.stringify(uniqueOpportunities, null, 2)}\n`,
);

console.log(
  `Scraped ${uniqueOpportunities.length} opportunities into ${outputPath}`,
);

if (shouldPush) {
  await pushToIngestEndpoint(apiUrl, uniqueOpportunities);
}

async function scrapeMlhSeason(source) {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const pageData = $("[data-page]").attr("data-page");

  if (pageData) {
    const page = JSON.parse(pageData);
    const events = page.props?.upcomingEvents ?? [];

    return events.map((event) => {
      const underservedTypes = event.customFields?.underserved_types ?? [];
      const isRemote = event.formatType === "digital";
      const tags = [
        isRemote ? "remote" : null,
        underservedTypes.length > 0 ? "women-focused" : null,
        event.name.toLowerCase().includes("design") ? "design" : null,
      ].filter(Boolean);

      return {
        id: slugify(`${source.source}-${event.slug ?? event.id}`),
        title: event.name,
        organization: "Major League Hacking",
        description: `MLH-listed hackathon for builders and early-career technologists. ${event.location ? `Location: ${event.location}.` : ""}`,
        url: event.websiteUrl ?? new URL(event.url, source.url).toString(),
        source: source.source,
        category: "hackathon",
        location_text: event.location ?? null,
        is_remote: isRemote,
        deadline: event.startsAt ?? null,
        cost: "Free or low-cost",
        eligibility_tags: [...new Set(tags)],
        accessibility_tags: [
          isRemote ? "remote" : "in-person",
          "code-of-conduct",
        ],
        topic_tags: ["hackathon", "community", "portfolio"],
        experience_level_tags: ["beginner-friendly"],
        image_url: event.logoUrl ?? event.backgroundUrl ?? null,
      };
    });
  }

  const opportunities = [];

  $("a[href]").each((_, element) => {
    const text = normalizeWhitespace($(element).text());
    const href = $(element).attr("href");

    if (!href || !looksLikeMlhEvent(text)) return;

    const url = new URL(href, source.url).toString();
    const event = parseMlhEventText(text);

    opportunities.push({
      id: slugify(`${source.source}-${event.title}-${event.dateText}`),
      title: event.title,
      organization: "Major League Hacking",
      description: `MLH-listed hackathon for builders and early-career technologists. ${event.locationText ? `Location: ${event.locationText}.` : ""}`,
      url,
      source: source.source,
      category: "hackathon",
      location_text: event.locationText,
      is_remote: event.isRemote,
      deadline: null,
      cost: "Free or low-cost",
      eligibility_tags: event.tags,
      accessibility_tags: [
        event.isRemote ? "remote" : "in-person",
        "code-of-conduct",
      ],
      topic_tags: ["hackathon", "community", "portfolio"],
      experience_level_tags: event.tags.includes("high-school")
        ? ["beginner-friendly", "high-school"]
        : ["beginner-friendly"],
      image_url: null,
    });
  });

  return opportunities;
}

async function scrapeGenericPage(source) {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const title =
    $("meta[property='og:title']").attr("content") ??
    $("title").first().text() ??
    source.name;
  const description =
    $("meta[property='og:description']").attr("content") ??
    $("meta[name='description']").attr("content") ??
    $("p").first().text() ??
    `Opportunity scraped from ${source.name}.`;
  const imageUrl = $("meta[property='og:image']").attr("content") ?? null;
  const pageText = normalizeWhitespace($("body").text()).toLowerCase();

  return {
    id: slugify(`${source.source}-${source.url}`),
    title: normalizeWhitespace(title),
    organization: source.organization ?? source.name,
    description: normalizeWhitespace(description).slice(0, 420),
    url: source.url,
    source: source.source,
    category: source.category ?? inferCategory(pageText),
    location_text: source.location_text ?? inferLocation(pageText),
    is_remote: pageText.includes("remote") || pageText.includes("online"),
    deadline: source.deadline ?? null,
    cost: pageText.includes("free") ? "Free" : null,
    eligibility_tags: inferEligibilityTags(pageText),
    accessibility_tags: inferAccessTags(pageText),
    topic_tags: inferTopicTags(pageText),
    experience_level_tags: inferExperienceTags(pageText),
    image_url: imageUrl,
  };
}

async function pushToIngestEndpoint(url, opportunities) {
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
    body: JSON.stringify({ opportunities }),
  });

  if (!response.ok) {
    throw new Error(
      `Ingest failed with ${response.status}: ${await response.text()}`,
    );
  }

  console.log(`Pushed ${opportunities.length} opportunities to ${url}`);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Fora hackathon opportunity discovery prototype (contact: local demo)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function parseMlhEventText(text) {
  const tags = [];
  const isRemote = /digital|online|everywhere/i.test(text);

  if (/diversity/i.test(text)) tags.push("women-focused");
  if (/high school/i.test(text)) tags.push("high-school");
  if (isRemote) tags.push("remote");

  const dateMatch = text.match(
    /\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{1,2}(?:\s*-\s*\d{1,2})?/i,
  );
  const dateText = dateMatch?.[0] ?? "";
  const beforeDate = dateMatch ? text.slice(0, dateMatch.index).trim() : text;
  const afterDate = dateMatch
    ? text.slice((dateMatch.index ?? 0) + dateText.length).trim()
    : "";
  const chunks = beforeDate.split(/\s{2,}|,\s+(?=[A-Z])/).filter(Boolean);
  const title = chunks[chunks.length - 1] ?? beforeDate;
  const locationText = afterDate.replace(/\b(In-Person|Digital|DIVERSITY|HIGH SCHOOL)\b/gi, "").trim();

  return {
    title: normalizeWhitespace(title),
    dateText,
    locationText: normalizeWhitespace(locationText || "Everywhere, Worldwide"),
    isRemote,
    tags: [...new Set(tags)],
  };
}

function looksLikeMlhEvent(text) {
  return (
    /\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{1,2}/i.test(
      text,
    ) && /\b(In-Person|Digital|DIVERSITY|HIGH SCHOOL)\b/i.test(text)
  );
}

function inferCategory(text) {
  if (text.includes("scholarship") || text.includes("grant")) {
    return "scholarship";
  }
  if (text.includes("mentor")) return "mentorship";
  if (text.includes("intern")) return "internship";
  return "hackathon";
}

function inferLocation(text) {
  if (text.includes("remote") || text.includes("online")) {
    return "Remote";
  }

  return null;
}

function inferEligibilityTags(text) {
  return [
    text.includes("women") || text.includes("nonbinary")
      ? "women-focused"
      : null,
    text.includes("first-gen") ? "first-gen-friendly" : null,
  ].filter(Boolean);
}

function inferAccessTags(text) {
  return [
    text.includes("free") ? "free" : null,
    text.includes("remote") || text.includes("online") ? "remote" : null,
    text.includes("travel") ? "travel-support" : null,
    text.includes("childcare") ? "childcare-support" : null,
  ].filter(Boolean);
}

function inferTopicTags(text) {
  return [
    text.includes("ai") || text.includes("machine learning") ? "ai" : null,
    text.includes("design") ? "design" : null,
    text.includes("security") || text.includes("cyber") ? "cybersecurity" : null,
    "community",
  ].filter(Boolean);
}

function inferExperienceTags(text) {
  return [
    text.includes("beginner") || text.includes("no experience")
      ? "beginner-friendly"
      : null,
  ].filter(Boolean);
}

function dedupeByUrl(opportunities) {
  return [...new Map(opportunities.map((item) => [item.url, item])).values()];
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function getArgValue(name) {
  const arg = process.argv.find((item) => item.startsWith(`${name}=`));
  return arg?.split("=").slice(1).join("=");
}
