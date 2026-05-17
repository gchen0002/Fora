export const opportunityImageRecipes = {
  "build-for-good-hack": "from-blueberry/80 via-sky-300 to-sunshine",
  "jane-street-women-in-tech": "from-coral/80 via-orange-200 to-blueberry/70",
} as const;

export const categoryColorRecipes = {
  blueberry: {
    text: "text-blueberry",
    bg: "bg-blueberry/10",
    ring: "ring-blueberry/15",
  },
  mint: {
    text: "text-mint",
    bg: "bg-mint/10",
    ring: "ring-mint/15",
  },
  sunshine: {
    text: "text-sunshine",
    bg: "bg-sunshine/20",
    ring: "ring-sunshine/25",
  },
  coral: {
    text: "text-coral",
    bg: "bg-coral/10",
    ring: "ring-coral/15",
  },
} as const;

export const socialProofAvatarRecipes = [
  "bg-blueberry",
  "bg-mint",
  "bg-sunshine text-ink",
  "bg-coral",
] as const;
