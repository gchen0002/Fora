import { parseJsonList } from "./serialization";
import type { Opportunity, Profile, StackOpportunity } from "./types";

const WHY_LABELS: Record<string, string> = {
  "beginner-friendly": "beginner-friendly",
  free: "free",
  remote: "remote",
  "mentorship-included": "includes mentorship",
  "women-focused": "designed for women in tech",
  "first-gen-friendly": "first-gen friendly",
  "no-experience-required": "no experience required",
  "travel-support": "offers travel support",
  "scholarship-eligible": "has funding available",
  nearby: "near you",
};

export function scoreDailyStack(
  opportunities: Opportunity[],
  profile: Profile | null,
): StackOpportunity[] {
  const identityTags = parseJsonList(profile?.identity_tags);
  const accessNeedTags = parseJsonList(profile?.access_need_tags);
  const interestTags = parseJsonList(profile?.interest_tags);
  const goalTags = parseJsonList(profile?.goal_tags);
  const remotePreference = profile?.remote_preference;
  const costSensitive = Boolean(profile?.cost_sensitivity);

  return opportunities
    .map((opportunity) => {
      const allTags = new Set([
        ...opportunity.eligibilityTags,
        ...opportunity.accessibilityTags,
        ...opportunity.topicTags,
        ...opportunity.experienceLevelTags,
        opportunity.category.toLowerCase(),
      ]);

      let score = 50;
      const reasons = new Set<string>();

      for (const tag of identityTags) {
        if (allTags.has(tag)) {
          score += 3;
          reasons.add(tag);
        }
      }

      for (const tag of accessNeedTags) {
        if (allTags.has(tag)) {
          score += 4;
          reasons.add(tag);
        }
      }

      for (const tag of interestTags) {
        if (allTags.has(tag)) {
          score += 2;
          reasons.add(tag);
        }
      }

      for (const tag of goalTags) {
        if (allTags.has(tag)) {
          score += 2;
          reasons.add(tag);
        }
      }

      if (opportunity.experienceLevelTags.includes("beginner-friendly")) {
        score += 2;
        reasons.add("beginner-friendly");
      }

      if (opportunity.isRemote && remotePreference === "remote") {
        score += 3;
        reasons.add("remote");
      }

      if (costSensitive && opportunity.cost?.toLowerCase().includes("free")) {
        score += 2;
        reasons.add("free");
      }

      if (opportunity.deadline) {
        score += deadlineBoost(opportunity.deadline);
      }

      return {
        ...opportunity,
        fitScore: Math.min(score, 99),
        matchReasons: [...reasons].map((reason) => WHY_LABELS[reason] ?? reason),
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore);
}

function deadlineBoost(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();

  if (Number.isNaN(deadlineDate.getTime())) return 0;

  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / 86_400_000,
  );

  if (daysUntilDeadline < 0) return -8;
  if (daysUntilDeadline <= 7) return 3;
  if (daysUntilDeadline <= 21) return 2;
  return 1;
}
