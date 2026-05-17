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

  if (source.type === "devpost-page") {
    return evaluateParsedOpportunity(source, await parseDevpostPage(source));
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

async function parseDevpostPage(source) {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const pageText = normalizeWhitespace($("body").text());
  const title = source.name || firstNonEmptyText($, "h1");
  const subtitle = firstNonEmptyText($, "h3");
  const image = getDevpostImage($, source.url);
  const meta = parseDevpostMeta(pageText);
  const tags = parseDevpostTags(pageText);

  return {
    opportunity: {
      id: slugify(`${source.source}-${source.url}`),
      title,
      organization: meta.organization || source.organization || "Devpost",
      description: `Devpost-listed hackathon for students, builders, and early-career technologists. ${subtitle || meta.description || title}`,
      url: source.url,
      source: source.source,
      category: source.category ?? "hackathon",
      location_text: source.location_text ?? meta.location,
      latitude: source.latitude ?? null,
      longitude: source.longitude ?? null,
      is_remote: source.is_remote ?? isRemoteDevpostHackathon(meta, pageText),
      deadline: source.deadline ?? meta.deadline,
      cost: "Free or low-cost",
      eligibility_tags: tags.eligibility,
      accessibility_tags: tags.accessibility,
      topic_tags: tags.topics,
      experience_level_tags: tags.experience,
      image_url: image.url,
      image_kind: image.kind,
    },
    pageText,
    parseNotes: ["Parsed from Devpost hackathon page."],
  };
}

function firstNonEmptyText($, selector) {
  const values = [];

  $(selector).each((_, element) => {
    const value = normalizeWhitespace($(element).text());
    if (value) values.push(value);
  });

  return values[0] ?? "";
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

function getDevpostImage($, baseUrl) {
  const imageUrl =
    $("meta[property='og:image']").attr("content") ??
    $("meta[name='twitter:image']").attr("content") ??
    $("img").first().attr("src") ??
    null;

  if (!imageUrl) {
    return {
      url: null,
      kind: "unknown",
    };
  }

  return {
    url: new URL(imageUrl, baseUrl).toString(),
    kind: "banner",
  };
}

function parseDevpostMeta(text) {
  const deadlineMatch = text.match(
    /Deadline:\s*([A-Z][a-z]{2,8}\s+\d{1,2},\s+20\d{2}(?:\s+@\s+\d{1,2}:\d{2}(?:am|pm)?\s+[A-Z]{2,4})?)/,
  );
  const rangeMatch = text.match(
    /\b([A-Z][a-z]{2,8}\s+\d{1,2}\s+[\u2013-]\s+\d{1,2},\s+20\d{2})\b/,
  );
  const dateMatch = text.match(/\b([A-Z][a-z]{2,8}\s+\d{1,2},\s+20\d{2})\b/);
  const locationMatch = text.match(
    /(?:Outlook|Google|Apple)\s+([^|]{3,80})\s+\|\s+Public/,
  );
  const labeledLocationMatch = text.match(
    /\bLocation\s+([^<]{3,140}?)(?:Prize Categories|Prizes|Rules|Requirements|Judging|$)/i,
  );
  const organizationMatch = text.match(/\|\s+\d[\d,]* participants\s+([^#]{2,80})/);

  return {
    deadline: parseDate(deadlineMatch?.[1] ?? rangeMatch?.[1] ?? dateMatch?.[1]),
    location: normalizeWhitespace(
      locationMatch?.[1] ?? cleanDevpostLocation(labeledLocationMatch?.[1] ?? ""),
    ),
    organization: normalizeWhitespace(organizationMatch?.[1] ?? ""),
    description: normalizeWhitespace(
      text.match(/About (?:the Challenge|the challenge)\s+(.{80,420}?)(?:Requirements|What to Build|Hackathon Sponsors)/i)?.[1] ??
        "",
    ),
  };
}

function cleanDevpostLocation(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isRemoteDevpostHackathon(meta, text) {
  const normalizedText = text.toLowerCase();
  const normalizedLocation = meta.location.toLowerCase();

  return (
    normalizedLocation.includes("online") ||
    normalizedLocation.includes("remote") ||
    /\b(online event|virtual event|fully remote|participate online)\b/.test(normalizedText)
  );
}

function parseDevpostTags(text) {
  const lowerText = text.toLowerCase();
  const topics = [
    lowerText.includes("machine learning") || lowerText.includes("ai") ? "ai" : null,
    lowerText.includes("social good") ? "social-good" : null,
    lowerText.includes("web") ? "web" : null,
    lowerText.includes("design") ? "design" : null,
    lowerText.includes("cybersecurity") ? "cybersecurity" : null,
    "hackathon",
    "community",
  ].filter(Boolean);

  return {
    accessibility: [
      lowerText.includes("online") ? "remote" : "in-person",
      lowerText.includes("free") ? "free" : null,
    ].filter(Boolean),
    eligibility: [
      lowerText.includes("student") ? "students" : null,
      lowerText.includes("high school") || lowerText.includes("ages 13") ? "high-school" : null,
    ].filter(Boolean),
    experience: [
      lowerText.includes("beginner") || lowerText.includes("no prior experience")
        ? "beginner-friendly"
        : null,
    ].filter(Boolean),
    topics: [...new Set(topics)],
  };
}

function parseDate(value) {
  if (!value) return null;

  const cleaned = value.split("@")[0].replace(/\s+[\u2013-]\s+\d{1,2}/, "").trim();
  const parsed = Date.parse(cleaned);

  if (Number.isNaN(parsed)) return null;

  return new Date(parsed).toISOString();
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
