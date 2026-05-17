export const acceptedDecision = "accept";
export const quarantineDecision = "quarantine";
export const rejectedDecision = "reject";

const trustedDomainHints = [
  ".edu",
  ".gov",
  "mlh.com",
  "github.com",
  "lu.ma",
  "eventbrite.com",
  "meetup.com",
  "devpost.com",
  "hackclub.com",
  "acm.org",
  "swe.org",
  "nsbe.org",
  "shpe.org",
  "anitab.org",
  "codepath.org",
  "girlswhocode.com",
  "mlt.org",
  "rewritingthecode.org",
  "recurse.com",
  "code2040.org",
  "colorstack.org",
  "outreachy.org",
  "ncwit.org",
  "persevere.org",
  "perscholas.org",
  "generation.org",
  "djangogirls.org",
  "blackgirlscode.com",
  "technolochicas.org",
  "latinasintech.org",
  "lesbianswhotech.org",
  "o4u.org",
  "ada-developers-academy.org",
  "yearup.org",
  "hackclub.com",
  "bitwiseindustries.com",
  "codethedream.org",
  "roadtohire.org",
  "breakthroughtech.org",
  "girlsintech.org",
  "womenwhocode.com",
  "ai-4-all.org",
  "kodewithklossy.com",
];

const opportunityKeywords = [
  "hackathon",
  "scholarship",
  "fellowship",
  "internship",
  "apprenticeship",
  "mentorship",
  "mentor",
  "workshop",
  "bootcamp",
  "coding",
  "developer",
  "software",
  "engineering",
  "computer science",
  "data science",
  "cybersecurity",
  "artificial intelligence",
  "machine learning",
  "women in tech",
  "student",
  "university",
  "apply",
  "career fair",
  "community",
  "conference",
  "tech talk",
  "startup",
  "beginner",
  "beginner-friendly",
  "portfolio",
];

const unrelatedKeywords = [
  "casino",
  "betting",
  "gambling",
  "forex",
  "crypto giveaway",
  "adult content",
  "miracle cure",
  "weight loss",
  "essay writing service",
];

export function createEvaluation({ opportunity, source, pageText = "", parseNotes = [] }) {
  const normalizedText = normalizeWhitespace(
    [
      opportunity.title,
      opportunity.organization,
      opportunity.description,
      opportunity.category,
      opportunity.cost,
      ...(opportunity.eligibility_tags ?? []),
      ...(opportunity.accessibility_tags ?? []),
      ...(opportunity.topic_tags ?? []),
      ...(opportunity.experience_level_tags ?? []),
      pageText,
    ].join(" "),
  ).toLowerCase();
  const relevanceScore = scoreRelevance(normalizedText);
  const sourceTrustScore = scoreSourceTrust(opportunity.url, source);
  const parseConfidence = scoreParseConfidence(opportunity);
  const riskFlags = detectRiskFlags({
    opportunity,
    normalizedText,
    relevanceScore,
    sourceTrustScore,
    parseConfidence,
  });
  const decision = decide({ relevanceScore, sourceTrustScore, parseConfidence, riskFlags });

  return {
    opportunity,
    review: {
      id: slugify(`${source.source}-${opportunity.url}-${decision}`),
      submitted_url: source.submittedUrl ?? source.url ?? opportunity.url,
      canonical_url: opportunity.url,
      source: source.source,
      title: opportunity.title,
      decision,
      relevance_score: relevanceScore,
      source_trust_score: sourceTrustScore,
      parse_confidence: parseConfidence,
      risk_flags: riskFlags,
      notes: [...parseNotes, ...explainDecision(decision, riskFlags)].join(" "),
      raw_summary: opportunity.description.slice(0, 500),
    },
  };
}

export function splitByDecision(results) {
  return results.reduce(
    (accumulator, result) => {
      accumulator.reviews.push(result.review);

      if (result.review.decision === acceptedDecision) {
        accumulator.accepted.push(result.opportunity);
      } else if (result.review.decision === quarantineDecision) {
        accumulator.quarantined.push(result.opportunity);
      } else {
        accumulator.rejected.push(result.opportunity);
      }

      return accumulator;
    },
    {
      accepted: [],
      quarantined: [],
      rejected: [],
      reviews: [],
    },
  );
}

export function dedupeByUrl(opportunities) {
  return [...new Map(opportunities.map((item) => [item.url, item])).values()];
}

export function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function slugify(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36 ForaOpportunityBot/0.1",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function scoreRelevance(text) {
  const matches = opportunityKeywords.filter((keyword) => text.includes(keyword));
  const unrelatedMatches = unrelatedKeywords.filter((keyword) => text.includes(keyword));
  return clamp(matches.length * 12 - unrelatedMatches.length * 25, 0, 100);
}

function scoreSourceTrust(url, source) {
  const host = safeHost(url);
  const sourceTrust = source.trustLevel === "trusted" ? 25 : 0;
  const domainTrust = trustedDomainHints.some((hint) => host.includes(hint))
    ? 45
    : 20;
  const protocolTrust = url.startsWith("https://") ? 15 : 0;
  const submittedPenalty = source.type === "submitted-url" ? -10 : 0;

  return clamp(sourceTrust + domainTrust + protocolTrust + submittedPenalty, 0, 100);
}

function scoreParseConfidence(opportunity) {
  const requiredFields = [
    opportunity.title,
    opportunity.organization,
    opportunity.description,
    opportunity.url,
    opportunity.category,
  ];
  const optionalSignals = [
    opportunity.deadline,
    opportunity.location_text,
    opportunity.cost,
    opportunity.topic_tags?.length > 0,
    opportunity.accessibility_tags?.length > 0,
    opportunity.experience_level_tags?.length > 0,
  ];

  const requiredScore = requiredFields.filter(Boolean).length * 12;
  const optionalScore = optionalSignals.filter(Boolean).length * 6;
  return clamp(requiredScore + optionalScore, 0, 100);
}

function detectRiskFlags({
  opportunity,
  normalizedText,
  relevanceScore,
  sourceTrustScore,
  parseConfidence,
}) {
  const flags = [];

  if (relevanceScore < 25) flags.push("low-relevance");
  if (sourceTrustScore < 35) flags.push("low-source-trust");
  if (parseConfidence < 55) flags.push("low-parse-confidence");
  if (unrelatedKeywords.some((keyword) => normalizedText.includes(keyword))) {
    flags.push("spam-or-unrelated-keywords");
  }
  if (!opportunity.deadline && !mentionsEventTiming(normalizedText)) {
    flags.push("missing-date-or-deadline");
  }
  if (!opportunity.organization || opportunity.organization === "Unknown") {
    flags.push("missing-organizer");
  }
  if (looksExpired(opportunity.deadline)) flags.push("expired");
  if (
    /pay\s*\$?\d+|application fee|registration fee/i.test(normalizedText) &&
    !mentionsCoveredFunding(normalizedText)
  ) {
    flags.push("possible-pay-to-play");
  }

  return [...new Set(flags)];
}

function decide({ relevanceScore, sourceTrustScore, parseConfidence, riskFlags }) {
  if (
    riskFlags.includes("spam-or-unrelated-keywords") ||
    riskFlags.includes("expired") ||
    relevanceScore < 20
  ) {
    return rejectedDecision;
  }

  if (
    relevanceScore >= 30 &&
    sourceTrustScore >= 45 &&
    parseConfidence >= 55 &&
    !riskFlags.includes("possible-pay-to-play")
  ) {
    return acceptedDecision;
  }

  return quarantineDecision;
}

function explainDecision(decision, riskFlags) {
  if (decision === acceptedDecision) return ["Accepted by automated source evaluation."];
  if (decision === rejectedDecision) return ["Rejected by automated source evaluation."];

  return [
    "Quarantined for review by automated source evaluation.",
    riskFlags.length > 0 ? `Risk flags: ${riskFlags.join(", ")}.` : "",
  ].filter(Boolean);
}

function safeHost(url) {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return "";
  }
}

function mentionsEventTiming(text) {
  return /\b(today|tomorrow|tonight|deadline|apply by|register by|rolling|ongoing|year-round|open application|applications open|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})\b/i.test(
    text,
  );
}

function looksExpired(deadline) {
  if (!deadline) return false;

  const parsed = Date.parse(deadline);
  if (Number.isNaN(parsed)) return false;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return parsed < thirtyDaysAgo;
}

function mentionsCoveredFunding(text) {
  return /\b(scholarship|scholars|funded|covered|provided|travel support|lodging|transportation|grant)\b/i.test(
    text,
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
