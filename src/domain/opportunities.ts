import type { MatchExplanationKey } from "@/domain/match-explanations";

export type OpportunityCategory =
  | "Hackathon"
  | "Scholarship"
  | "Mentorship"
  | "Internship";

export interface Opportunity {
  id: string;
  category: OpportunityCategory;
  title: string;
  organization: string;
  timing: string;
  matchScore: number;
  matchExplanationKeys: MatchExplanationKey[];
  imageClassName: string;
}

export const dailyStackPreview: Opportunity[] = [
  {
    id: "build-for-good-hack",
    category: "Hackathon",
    title: "Build for Good Hack",
    organization: "Civic Builders Lab",
    timing: "Online - Aug 24-25",
    matchScore: 95,
    matchExplanationKeys: [
      "beginner-friendly",
      "free",
      "remote",
      "mentorship-included",
    ],
    imageClassName: "from-blueberry/80 via-sky-300 to-sunshine",
  },
  {
    id: "jane-street-women-in-tech",
    category: "Scholarship",
    title: "Jane Street Women in Tech",
    organization: "Jane Street",
    timing: "Apply by Sep 10",
    matchScore: 92,
    matchExplanationKeys: ["women-focused", "funding", "undergrad"],
    imageClassName: "from-coral/80 via-orange-200 to-blueberry/70",
  },
];
