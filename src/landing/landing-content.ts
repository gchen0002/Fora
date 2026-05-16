import {
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Heart,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { categoryColorRecipes } from "@/landing/visual-recipes";

export const navItems = ["How it works", "For you", "Categories", "About"];

export interface CategoryCardContent {
  title: string;
  copy: string;
  icon: LucideIcon;
  colorRecipe: keyof typeof categoryColorRecipes;
}

export const categoryCards: CategoryCardContent[] = [
  {
    title: "Hackathons",
    copy: "Build, learn, and launch together.",
    icon: Zap,
    colorRecipe: "blueberry",
  },
  {
    title: "Scholarships",
    copy: "Funding to fuel your future.",
    icon: GraduationCap,
    colorRecipe: "mint",
  },
  {
    title: "Mentorship",
    copy: "Guidance from people who have been there.",
    icon: Handshake,
    colorRecipe: "sunshine",
  },
  {
    title: "Internships",
    copy: "Real experience. Real impact.",
    icon: BriefcaseBusiness,
    colorRecipe: "coral",
  },
];

export const benefits = [
  {
    title: "Personalized daily stack",
    copy: "We match opportunities to your goals, needs, and interests.",
    icon: BadgeCheck,
  },
  {
    title: "Save time, stay focused",
    copy: "Only the most relevant opportunities, updated daily.",
    icon: Heart,
  },
  {
    title: "Built for every path",
    copy: "For underrepresented and nontraditional tech learners.",
    icon: ShieldCheck,
  },
];
