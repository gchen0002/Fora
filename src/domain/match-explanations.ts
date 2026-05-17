export const MATCH_EXPLANATION_LABELS = {
  "beginner-friendly": "beginner-friendly",
  free: "free",
  remote: "remote",
  "mentorship-included": "includes mentorship",
  "women-focused": "designed for women in tech",
  funding: "has funding available",
  undergrad: "for undergrad learners",
} as const;

export type MatchExplanationKey = keyof typeof MATCH_EXPLANATION_LABELS;

export function getMatchExplanationLabels(keys: MatchExplanationKey[]) {
  return keys.map((key) => MATCH_EXPLANATION_LABELS[key]);
}
