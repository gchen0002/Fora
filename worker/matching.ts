import { parseJsonList } from "./serialization";
import type { Opportunity, Profile, StackOpportunity } from "./types";

const DEFAULT_STACK_LIMIT = 10;
const DAILY_INTENT_RATIO = 0.8;

const WHY_LABELS: Record<string, string> = {
  "access-fit": "matches your support needs",
  "beginner-friendly": "beginner-friendly",
  "different-focus": "different focus",
  "evening-weekend": "evening/weekend friendly",
  "fee-waived": "fee waived",
  "first-gen-friendly": "first-gen friendly",
  free: "free",
  "goal-fit": "matches your goals",
  "identity-fit": "designed for you",
  "location-unknown": "location unclear",
  "low-income-friendly": "cost-conscious friendly",
  "mentorship-included": "includes mentorship",
  nearby: "near you",
  "no-experience-required": "no experience required",
  "out-of-range": "farther away",
  remote: "remote",
  "scholarship-eligible": "has funding available",
  "stretch-fit": "stretch fit",
  "time-sensitive": "deadline soon",
  "topic-fit": "matches your interests",
  "travel-support": "offers travel support",
  "women-focused": "designed for women in tech",
};

const HARD_ACCESS_TAGS = new Set(["free", "remote", "beginner-friendly"]);
const BEGINNER_TAGS = new Set(["beginner-friendly", "no-experience-required"]);
const ADVANCED_ONLY_TAGS = new Set([
  "advanced",
  "advanced-only",
  "senior",
  "senior-only",
  "professional",
  "professional-only",
]);

interface MatchContext {
  accessNeedTags: string[];
  costSensitive: boolean;
  experienceLevel: string | null | undefined;
  goalTags: string[];
  identityTags: string[];
  interestTags: string[];
  mileageRange: number | null;
  profileLatitude: number | null | undefined;
  profileLongitude: number | null | undefined;
  remotePreference: string | null | undefined;
}

interface ScoredOpportunity extends StackOpportunity {
  selectedGoalFit: boolean;
}

export function buildDailyStack(
  opportunities: Opportunity[],
  profile: Profile | null,
  limit = DEFAULT_STACK_LIMIT,
): StackOpportunity[] {
  const context = getMatchContext(profile);
  const scored = scoreOpportunities(opportunities, context);
  const selectedGoals = new Set(context.goalTags);

  if (selectedGoals.size === 0) {
    return sortForDisplay(scored.slice(0, limit)).map(toStackOpportunity);
  }

  const selectedGoalLimit = Math.max(1, Math.round(limit * DAILY_INTENT_RATIO));
  const selectedGoalCandidates = scored.filter((item) => item.selectedGoalFit);
  const serendipityCandidates = scored.filter((item) => !item.selectedGoalFit);
  const selectedGoalTarget = Math.min(selectedGoalLimit, selectedGoalCandidates.length);
  const stack: ScoredOpportunity[] = [];
  const usedIds = new Set<string>();

  for (const candidate of pickBalancedByCategory(
    selectedGoalCandidates,
    context.goalTags,
    selectedGoalTarget,
  )) {
    addCandidate(stack, usedIds, candidate, limit);
  }

  for (const candidate of selectedGoalCandidates) {
    if (stack.length >= selectedGoalTarget) break;
    addCandidate(stack, usedIds, candidate, limit);
  }

  const serendipityTarget = Math.min(limit - stack.length, limit - selectedGoalTarget);
  let addedSerendipity = 0;
  for (const candidate of serendipityCandidates) {
    if (addedSerendipity >= serendipityTarget) break;
    if (candidate.fitScore < 45) continue;

    addCandidate(stack, usedIds, candidate, limit);
    addedSerendipity += 1;
  }

  for (const candidate of scored) {
    if (stack.length >= limit) break;
    addCandidate(stack, usedIds, candidate, limit);
  }

  return sortForDisplay(stack).map(toStackOpportunity);
}

export function buildExploreMore(
  opportunities: Opportunity[],
  profile: Profile | null,
  limit = 25,
): StackOpportunity[] {
  const context = getMatchContext(profile);
  const dailyIds = new Set(
    buildDailyStack(opportunities, profile, DEFAULT_STACK_LIMIT).map((item) => item.id),
  );

  return scoreOpportunities(opportunities, context)
    .filter((item) => !dailyIds.has(item.id))
    .sort((a, b) => getExplorePriority(b, context) - getExplorePriority(a, context))
    .slice(0, limit)
    .map(toStackOpportunity);
}

export function scoreDailyStack(
  opportunities: Opportunity[],
  profile: Profile | null,
): StackOpportunity[] {
  return scoreOpportunities(opportunities, getMatchContext(profile)).map(toStackOpportunity);
}

function scoreOpportunities(
  opportunities: Opportunity[],
  context: MatchContext,
): ScoredOpportunity[] {
  return opportunities
    .filter((opportunity) => !isExpired(opportunity.deadline))
    .map((opportunity) => scoreOpportunity(opportunity, context))
    .sort((a, b) => {
      if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
      return getDeadlineTime(a.deadline) - getDeadlineTime(b.deadline);
    });
}

function sortForDisplay(opportunities: ScoredOpportunity[]) {
  return [...opportunities].sort((a, b) => {
    if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
    return getDeadlineTime(a.deadline) - getDeadlineTime(b.deadline);
  });
}

function scoreOpportunity(
  opportunity: Opportunity,
  context: MatchContext,
): ScoredOpportunity {
  const allTags = getAllTags(opportunity);
  const selectedGoalFit =
    context.goalTags.length === 0 ||
    context.goalTags.some((tag) => allTags.has(tag));
  const distanceMiles = getDistanceMiles(
    context.profileLatitude,
    context.profileLongitude,
    opportunity.latitude,
    opportunity.longitude,
  );

  const reasons = new Set<string>();
  let score = 42;

  score += scoreIntentFit(allTags, context.goalTags, selectedGoalFit, reasons);
  score += scoreAccessFit(opportunity, allTags, context, reasons);
  score += scoreIdentityFit(allTags, context.identityTags, reasons);
  score += scoreTopicFit(allTags, context.interestTags, reasons);
  score += scoreLocationFit(opportunity, context, distanceMiles, reasons);
  score += scoreUrgency(opportunity.deadline, reasons);
  score += scoreExperienceFit(allTags, context, reasons);

  if (isExpired(opportunity.deadline)) {
    score -= 60;
  }

  const fitScore = clamp(Math.round(score), 5, 99);
  if (fitScore >= 40 && fitScore <= 72) {
    reasons.add("stretch-fit");
  }

  return {
    ...opportunity,
    distanceMiles,
    fitScore,
    matchReasons: getReasonLabels(reasons, selectedGoalFit),
    selectedGoalFit,
  };
}

function getMatchContext(profile: Profile | null): MatchContext {
  return {
    accessNeedTags: parseJsonList(profile?.access_need_tags),
    costSensitive: Boolean(profile?.cost_sensitivity),
    experienceLevel: profile?.experience_level,
    goalTags: parseJsonList(profile?.goal_tags),
    identityTags: parseJsonList(profile?.identity_tags),
    interestTags: parseJsonList(profile?.interest_tags),
    mileageRange: profile?.mileage_range ?? null,
    profileLatitude: profile?.latitude,
    profileLongitude: profile?.longitude,
    remotePreference: profile?.remote_preference,
  };
}

function scoreIntentFit(
  allTags: Set<string>,
  goalTags: string[],
  selectedGoalFit: boolean,
  reasons: Set<string>,
) {
  if (goalTags.length === 0) return 8;
  if (!selectedGoalFit) return -8;

  let score = 14;
  let directMatches = 0;
  for (const tag of goalTags) {
    if (allTags.has(tag)) directMatches += 1;
  }

  score += Math.min(directMatches * 2, 4);
  reasons.add("goal-fit");

  return score;
}

function scoreAccessFit(
  opportunity: Opportunity,
  allTags: Set<string>,
  context: MatchContext,
  reasons: Set<string>,
) {
  let score = 0;
  let supportMatches = 0;

  for (const tag of context.accessNeedTags) {
    if (allTags.has(tag)) {
      supportMatches += 1;
      reasons.add(tag);
    }
  }

  score += Math.min(supportMatches * 4, 14);

  if (context.accessNeedTags.some((tag) => HARD_ACCESS_TAGS.has(tag)) && supportMatches > 0) {
    reasons.add("access-fit");
  }

  if (allTags.has("beginner-friendly")) {
    score += 3;
    reasons.add("beginner-friendly");
  }

  if (context.costSensitive) {
    if (isFreeOpportunity(opportunity)) {
      score += 8;
      reasons.add("free");
    } else if (hasClearUserCost(opportunity.cost)) {
      score -= 24;
    }
  } else if (isFreeOpportunity(opportunity)) {
    score += 2;
    reasons.add("free");
  }

  if (context.remotePreference === "remote") {
    if (opportunity.isRemote || allTags.has("remote")) {
      score += 8;
      reasons.add("remote");
    } else {
      score -= 3;
    }
  }

  return score;
}

function scoreIdentityFit(
  allTags: Set<string>,
  identityTags: string[],
  reasons: Set<string>,
) {
  let matches = 0;

  for (const tag of identityTags) {
    if (allTags.has(tag)) {
      matches += 1;
      reasons.add(tag);
    }
  }

  if (matches > 0) reasons.add("identity-fit");

  return Math.min(matches * 3, 8);
}

function scoreTopicFit(
  allTags: Set<string>,
  interestTags: string[],
  reasons: Set<string>,
) {
  let matches = 0;

  for (const tag of interestTags) {
    if (allTags.has(tag)) matches += 1;
  }

  if (matches > 0) reasons.add("topic-fit");

  return Math.min(matches * 4, 12);
}

function scoreLocationFit(
  opportunity: Opportunity,
  context: MatchContext,
  distanceMiles: number | null,
  reasons: Set<string>,
) {
  const wantsRemote = context.remotePreference === "remote";

  if (opportunity.isRemote) {
    reasons.add("remote");
    return wantsRemote ? 12 : 5;
  }

  if (wantsRemote) {
    if (distanceMiles === null || context.mileageRange === null) {
      reasons.add("location-unknown");
      return -6;
    }
  }

  if (distanceMiles === null) {
    if (!opportunity.locationText) reasons.add("location-unknown");
    return opportunity.locationText ? -1 : -4;
  }

  if (context.mileageRange === null) {
    if (distanceMiles <= 25) {
      reasons.add("nearby");
      return 8;
    }

    if (distanceMiles <= 75) {
      reasons.add("nearby");
      return 4;
    }

    return wantsRemote ? -12 : -4;
  }

  if (distanceMiles <= context.mileageRange) {
    reasons.add("nearby");
    if (distanceMiles <= 10) return 16;
    if (distanceMiles <= 25) return 14;
    return 12;
  }

  const overage = distanceMiles - context.mileageRange;
  reasons.add("out-of-range");
  if (overage <= 15) return -10;
  if (overage <= 50) return -18;
  if (overage <= 150) return -28;
  return -36;
}

function scoreUrgency(deadline: string | null, reasons: Set<string>): number {
  if (!deadline) return 0;

  const daysUntilDeadline = getDaysUntilDeadline(deadline);
  if (daysUntilDeadline === null) return 0;
  if (daysUntilDeadline < 0) return 0;
  if (daysUntilDeadline <= 7) {
    reasons.add("time-sensitive");
    return 6;
  }
  if (daysUntilDeadline <= 21) {
    reasons.add("time-sensitive");
    return 4;
  }
  if (daysUntilDeadline <= 45) return 2;

  return 0;
}

function scoreExperienceFit(
  allTags: Set<string>,
  context: MatchContext,
  reasons: Set<string>,
) {
  if (context.experienceLevel !== "beginner-friendly") return 0;

  const hasBeginnerFit = [...BEGINNER_TAGS].some((tag) => allTags.has(tag));
  const isAdvancedOnly = [...ADVANCED_ONLY_TAGS].some((tag) => allTags.has(tag));

  if (hasBeginnerFit) return 6;
  if (isAdvancedOnly) {
    reasons.add("stretch-fit");
    return -22;
  }

  return -2;
}

function getAllTags(opportunity: Opportunity) {
  return new Set(
    [
      ...opportunity.eligibilityTags,
      ...opportunity.accessibilityTags,
      ...opportunity.topicTags,
      ...opportunity.experienceLevelTags,
      opportunity.category,
    ].map(normalizeTag),
  );
}

function pickBalancedByCategory(
  candidates: ScoredOpportunity[],
  goalTags: string[],
  limit: number,
) {
  const selectedCategories = goalTags.filter((tag) =>
    candidates.some((candidate) => candidate.category.toLowerCase() === tag),
  );

  if (selectedCategories.length <= 1) return candidates.slice(0, limit);

  const byCategory = new Map<string, ScoredOpportunity[]>();
  for (const category of selectedCategories) {
    byCategory.set(
      category,
      candidates.filter((candidate) => candidate.category.toLowerCase() === category),
    );
  }

  const picked: ScoredOpportunity[] = [];
  let cursor = 0;

  while (picked.length < limit && byCategory.size > 0) {
    const category = selectedCategories[cursor % selectedCategories.length];
    const queue = byCategory.get(category);

    if (queue && queue.length > 0) {
      picked.push(queue.shift()!);
    }

    for (const [key, value] of byCategory) {
      if (value.length === 0) byCategory.delete(key);
    }

    cursor += 1;
    if (cursor > candidates.length * selectedCategories.length) break;
  }

  return picked;
}

function addCandidate(
  stack: ScoredOpportunity[],
  usedIds: Set<string>,
  candidate: ScoredOpportunity,
  limit: number,
) {
  if (stack.length >= limit || usedIds.has(candidate.id)) return;

  stack.push(candidate);
  usedIds.add(candidate.id);
}

function getExplorePriority(opportunity: ScoredOpportunity, context: MatchContext) {
  let priority = opportunity.fitScore;

  if (!opportunity.selectedGoalFit && context.goalTags.length > 0) {
    priority += 10;
  }

  if (
    opportunity.distanceMiles !== null &&
    context.mileageRange !== null &&
    !opportunity.isRemote &&
    opportunity.distanceMiles > context.mileageRange
  ) {
    priority += 6;
  }

  if (opportunity.fitScore >= 40 && opportunity.fitScore <= 72) {
    priority += 4;
  }

  return priority;
}

function getReasonLabels(reasons: Set<string>, selectedGoalFit: boolean) {
  const orderedReasons = [
    "goal-fit",
    "access-fit",
    "nearby",
    "remote",
    "topic-fit",
    "identity-fit",
    "time-sensitive",
    "free",
    "beginner-friendly",
    "out-of-range",
    "location-unknown",
    "stretch-fit",
    ...reasons,
  ];
  const labels = [...new Set(orderedReasons.filter((reason) => reasons.has(reason)))]
    .slice(0, 5)
    .map((reason) => WHY_LABELS[reason] ?? reason);

  if (!selectedGoalFit && labels.length < 5) {
    labels.push(WHY_LABELS["different-focus"]);
  }

  return labels;
}

function toStackOpportunity(opportunity: ScoredOpportunity): StackOpportunity {
  const { selectedGoalFit, ...stackOpportunity } = opportunity;
  return stackOpportunity;
}

function isFreeOpportunity(opportunity: Opportunity) {
  if (opportunity.accessibilityTags.map(normalizeTag).includes("free")) return true;
  const cost = opportunity.cost?.toLowerCase() ?? "";

  return cost.includes("free") || cost.includes("fee waived");
}

function hasClearUserCost(cost: string | null) {
  if (!cost) return false;

  const normalized = cost.toLowerCase();
  if (
    normalized.includes("free") ||
    normalized.includes("fee waived") ||
    normalized.includes("scholarship") ||
    normalized.includes("funded") ||
    normalized.includes("stipend") ||
    normalized.includes("paid internship") ||
    normalized.includes("paid role")
  ) {
    return false;
  }

  return (
    normalized.includes("$") ||
    normalized.includes("tuition") ||
    normalized.includes("registration fee") ||
    normalized.includes("application fee") ||
    normalized.includes("paid")
  );
}

function isExpired(deadline: string | null) {
  const daysUntilDeadline = getDaysUntilDeadline(deadline);

  return daysUntilDeadline !== null && daysUntilDeadline < 0;
}

function getDaysUntilDeadline(deadline: string | null) {
  const deadlineDate = parseOpportunityDate(deadline);
  if (!deadlineDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  return Math.ceil((deadlineDate.getTime() - today.getTime()) / 86_400_000);
}

function getDeadlineTime(deadline: string | null) {
  const date = parseOpportunityDate(deadline);

  return date ? date.getTime() : Number.POSITIVE_INFINITY;
}

function parseOpportunityDate(value: string | null) {
  if (!value) return null;

  const input = value.trim();
  if (!input) return null;

  const withExplicitTime = /^\d{4}-\d{2}-\d{2}$/.test(input)
    ? `${input}T00:00:00`
    : input;
  let parsed = new Date(withExplicitTime);

  if (Number.isNaN(parsed.getTime())) return null;

  if (!/\d{4}/.test(input)) {
    const today = new Date();
    const inferred = new Date(today.getFullYear(), parsed.getMonth(), parsed.getDate());
    inferred.setHours(0, 0, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (inferred.getTime() < todayStart.getTime()) {
      inferred.setFullYear(inferred.getFullYear() + 1);
    }

    parsed = inferred;
  }

  return parsed;
}

function getDistanceMiles(
  fromLatitude: number | null | undefined,
  fromLongitude: number | null | undefined,
  toLatitude: number | null | undefined,
  toLongitude: number | null | undefined,
) {
  if (
    fromLatitude === null ||
    fromLatitude === undefined ||
    fromLongitude === null ||
    fromLongitude === undefined ||
    toLatitude === null ||
    toLatitude === undefined ||
    toLongitude === null ||
    toLongitude === undefined
  ) {
    return null;
  }

  const earthRadiusMiles = 3958.8;
  const deltaLatitude = toRadians(toLatitude - fromLatitude);
  const deltaLongitude = toRadians(toLongitude - fromLongitude);
  const lat1 = toRadians(fromLatitude);
  const lat2 = toRadians(toLatitude);
  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLongitude / 2) ** 2;

  return Math.round(
    earthRadiusMiles * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)),
  );
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(value, maximum));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
