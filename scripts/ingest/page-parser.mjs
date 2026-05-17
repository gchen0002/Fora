import * as cheerio from "cheerio";

import {
  fetchHtml,
  normalizeWhitespace,
  slugify,
} from "./core.mjs";

export async function parseGenericPageOpportunity(source) {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const title =
    source.name ??
    $("meta[property='og:title']").attr("content") ??
    $("title").first().text() ??
    source.name;
  const description =
    source.description ??
    $("meta[property='og:description']").attr("content") ??
    $("meta[name='description']").attr("content") ??
    $("p").first().text() ??
    `Opportunity scraped from ${source.name}.`;
  const imageUrl = getGenericImageUrl($, source);
  const pageText = normalizeWhitespace($("body").text());
  const lowerPageText = pageText.toLowerCase();

  return {
    opportunity: {
      id: slugify(`${source.source}-${source.url}`),
      title: normalizeWhitespace(title),
      organization: source.organization ?? inferOrganization($, source),
      description: normalizeWhitespace(description).slice(0, 420),
      url: source.url,
      source: source.source,
      category: source.category ?? inferCategory(lowerPageText),
      location_text: source.location_text ?? inferLocation(lowerPageText),
      latitude: source.latitude ?? null,
      longitude: source.longitude ?? null,
      is_remote:
        source.is_remote ??
        (lowerPageText.includes("remote") || lowerPageText.includes("online")),
      deadline: source.deadline ?? inferDateLikeValue(lowerPageText),
      cost: lowerPageText.includes("free") ? "Free" : null,
      eligibility_tags: compactUnique([
        ...(source.eligibility_tags ?? []),
        ...inferEligibilityTags(lowerPageText),
      ]),
      accessibility_tags: compactUnique([
        ...(source.accessibility_tags ?? []),
        ...inferAccessTags(lowerPageText),
      ]),
      topic_tags: compactUnique([
        ...(source.topic_tags ?? []),
        ...inferTopicTags(lowerPageText),
      ]),
      experience_level_tags: compactUnique([
        ...(source.experience_level_tags ?? []),
        ...inferExperienceTags(lowerPageText),
      ]),
      image_url: imageUrl,
      image_kind: source.image_kind ?? (imageUrl ? "unknown" : "unknown"),
    },
    pageText,
    parseNotes: ["Parsed from generic page metadata and body text."],
  };
}

function inferOrganization($, source) {
  const siteName =
    $("meta[property='og:site_name']").attr("content") ??
    source.organization ??
    source.name;

  return normalizeWhitespace(siteName || "Unknown");
}

function inferCategory(text) {
  if (text.includes("scholarship") || text.includes("grant")) {
    return "scholarship";
  }
  if (text.includes("mentor")) return "mentorship";
  if (text.includes("intern")) return "internship";
  if (text.includes("workshop") || text.includes("webinar")) return "workshop";
  if (text.includes("conference") || text.includes("meetup")) return "community";
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
    text.includes("student") ? "students" : null,
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
    text.includes("data") ? "data" : null,
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

function inferDateLikeValue(text) {
  const isoMatch = text.match(/\b20\d{2}-\d{2}-\d{2}\b/);
  if (isoMatch) return isoMatch[0];

  return null;
}

function absolutizeUrl(value, baseUrl) {
  if (!value) return null;

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function compactUnique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getGenericImageUrl($, source) {
  if (source.image_url) return absolutizeUrl(source.image_url, source.url);

  const metaImage = absolutizeUrl(
    $("meta[property='og:image']").attr("content") ??
      $("meta[name='twitter:image']").attr("content") ??
      null,
    source.url,
  );

  if (isUsableImageUrl(metaImage)) return metaImage;

  const images = [];

  $("img").each((index, element) => {
    const src =
      $(element).attr("src") ??
      $(element).attr("data-src") ??
      $(element).attr("data-lazy-src") ??
      null;
    const alt = normalizeWhitespace($(element).attr("alt") ?? "");
    const imageUrl = absolutizeUrl(src, source.url);

    if (!isUsableImageUrl(imageUrl)) return;
    if (index === 0 && source.image_kind === "photo") return;

    const descriptor = `${alt} ${imageUrl}`.toLowerCase();
    if (descriptor.includes("logo") || descriptor.endsWith(".svg")) return;

    images.push(imageUrl);
  });

  return images[0] ?? null;
}

function isUsableImageUrl(value) {
  return Boolean(value && !/\$\{|placeholder|no-avatar/i.test(value));
}
