import * as cheerio from "cheerio";

import {
  createEvaluation,
  fetchHtml,
  normalizeWhitespace,
  slugify,
} from "./core.mjs";
import { parseGenericPageOpportunity } from "./page-parser.mjs";

export async function runSourceAdapter(source) {
  if (source.type === "mlh-season") {
    return scrapeMlhSeason(source);
  }

  if (source.type === "generic-page") {
    return evaluateParsedOpportunity(source, await parseGenericPageOpportunity(source));
  }

  if (source.type === "submitted-url") {
    return evaluateSubmittedUrl(source);
  }

  throw new Error(`Unsupported source type: ${source.type}`);
}

async function scrapeMlhSeason(source) {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const pageData = $("[data-page]").attr("data-page");
  const parsed = [];

  if (pageData) {
    const page = JSON.parse(pageData);
    const events = page.props?.upcomingEvents ?? [];

    for (const event of events) {
      const underservedTypes = event.customFields?.underserved_types ?? [];
      const isRemote = event.formatType === "digital";
      const tags = [
        isRemote ? "remote" : null,
        underservedTypes.length > 0 ? "women-focused" : null,
        event.name.toLowerCase().includes("design") ? "design" : null,
      ].filter(Boolean);

      const image = getMlhImage(event);

      parsed.push({
        opportunity: {
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
          image_url: image.url,
          image_kind: image.kind,
        },
        pageText: `${event.name} ${event.location ?? ""} ${event.description ?? ""}`,
        parseNotes: ["Parsed from MLH structured season payload."],
      });
    }

    return parsed.map((item) => createEvaluation({ ...item, source }));
  }

  $("a[href]").each((_, element) => {
    const text = normalizeWhitespace($(element).text());
    const href = $(element).attr("href");

    if (!href || !looksLikeMlhEvent(text)) return;

    const url = new URL(href, source.url).toString();
    const event = parseMlhEventText(text);

    parsed.push({
      opportunity: {
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
        image_kind: "unknown",
      },
      pageText: text,
      parseNotes: ["Parsed from MLH event link fallback."],
    });
  });

  return parsed.map((item) => createEvaluation({ ...item, source }));
}

function getMlhImage(event) {
  if (event.backgroundUrl) {
    return {
      url: event.backgroundUrl,
      kind: "banner",
    };
  }

  if (event.logoUrl) {
    return {
      url: event.logoUrl,
      kind: "logo",
    };
  }

  return {
    url: null,
    kind: "unknown",
  };
}

async function evaluateSubmittedUrl(source) {
  const parsed = await parseGenericPageOpportunity({
    ...source,
    source: source.source ?? "user-submitted",
    submittedUrl: source.submittedUrl ?? source.url,
  });

  return evaluateParsedOpportunity(source, parsed);
}

function evaluateParsedOpportunity(source, parsed) {
  return [
    createEvaluation({
      ...parsed,
      source,
    }),
  ];
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
  const locationText = afterDate
    .replace(/\b(In-Person|Digital|DIVERSITY|HIGH SCHOOL)\b/gi, "")
    .trim();

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
