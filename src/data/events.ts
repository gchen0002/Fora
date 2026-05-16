/**
 * Shared hardcoded event data for all feed variations.
 */
export interface EventItem {
  id: number;
  type: "hackathon" | "scholarship" | "internship" | "conference" | "workshop";
  title: string;
  org: string;
  handle: string;
  location: string;
  date: string;
  match: number;
  attendees: number;
  description: string;
  tags: string[];
  color: string;
  gradient: string;
}

const G = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
};

export const events: EventItem[] = [
  {
    id: 1, type: "hackathon", title: "VenusHacks 2026", org: "UCI Venus", handle: "@venushacks",
    location: "Irvine, CA", date: "Aug 24–25", match: 98, attendees: 420,
    description: "A 24-hour hackathon celebrating women and non-binary individuals in tech. Build, learn, and connect with 400+ hackers.",
    tags: ["React", "AI/ML", "Beginner Friendly"], color: G.blue,
    gradient: `linear-gradient(135deg, ${G.blue}, #6C63FF)`,
  },
  {
    id: 2, type: "scholarship", title: "Women in Tech Fund", org: "TechBridge Foundation", handle: "@techbridge",
    location: "Online", date: "Sep 10 Deadline", match: 94, attendees: 1200,
    description: "Up to $10,000 for underrepresented women pursuing CS degrees. No GPA minimum — portfolio-based selection.",
    tags: ["$10K Award", "Portfolio", "No GPA Min"], color: G.red,
    gradient: `linear-gradient(135deg, ${G.red}, #FF6B6B)`,
  },
  {
    id: 3, type: "internship", title: "Frontend Intern @ Figma", org: "Figma", handle: "@figma",
    location: "San Francisco, CA", date: "Rolling Applications", match: 89, attendees: 3400,
    description: "Join Figma's design systems team. Work on real features used by millions. Paid internship with housing stipend.",
    tags: ["React", "TypeScript", "Design Systems"], color: G.green,
    gradient: `linear-gradient(135deg, ${G.green}, #00C853)`,
  },
  {
    id: 4, type: "conference", title: "React Summit 2026", org: "GitNation", handle: "@reactsummit",
    location: "Amsterdam + Remote", date: "Oct 14–16", match: 85, attendees: 8000,
    description: "The biggest React conference in the world. 3 days of talks, workshops, and networking with core team members.",
    tags: ["React", "Next.js", "Remote Option"], color: G.yellow,
    gradient: `linear-gradient(135deg, ${G.yellow}, #FFD93D)`,
  },
  {
    id: 5, type: "hackathon", title: "HackMIT 2026", org: "MIT", handle: "@hackmit",
    location: "Cambridge, MA", date: "Sep 14–15", match: 82, attendees: 1000,
    description: "One of the most prestigious collegiate hackathons. Travel reimbursement available for selected applicants.",
    tags: ["AI", "Hardware", "Travel Covered"], color: G.blue,
    gradient: `linear-gradient(135deg, #6C63FF, ${G.blue})`,
  },
  {
    id: 6, type: "workshop", title: "Intro to System Design", org: "CodePath", handle: "@codepath",
    location: "Virtual", date: "Aug 5–Sep 2", match: 91, attendees: 300,
    description: "A 4-week cohort-based workshop covering system design fundamentals. Perfect prep for technical interviews.",
    tags: ["System Design", "Free", "Certificate"], color: G.green,
    gradient: `linear-gradient(135deg, #00C853, ${G.green})`,
  },
  {
    id: 7, type: "scholarship", title: "Google Generation Scholarship", org: "Google", handle: "@google",
    location: "Global", date: "Dec 1 Deadline", match: 88, attendees: 5000,
    description: "$10,000 scholarship for students in CS who are passionate about diversity in tech. Open to all underrepresented groups.",
    tags: ["$10K", "Google", "Diversity"], color: G.red,
    gradient: `linear-gradient(135deg, #FF6B6B, ${G.red})`,
  },
  {
    id: 8, type: "internship", title: "Product Design @ Notion", org: "Notion", handle: "@notionhq",
    location: "New York, NY", date: "Rolling", match: 86, attendees: 2100,
    description: "Shape the future of productivity tools. Work directly with the design team on new features. Relocation package included.",
    tags: ["Figma", "UX Research", "NYC"], color: G.yellow,
    gradient: `linear-gradient(135deg, #FFD93D, ${G.yellow})`,
  },
  {
    id: 9, type: "hackathon", title: "TreeHacks 2026", org: "Stanford", handle: "@treehacks",
    location: "Stanford, CA", date: "Feb 14–16", match: 79, attendees: 1500,
    description: "Stanford's flagship hackathon. Build projects that matter. $50K+ in prizes. All skill levels welcome.",
    tags: ["Health", "Education", "Sustainability"], color: G.green,
    gradient: `linear-gradient(135deg, ${G.green}, #2E7D32)`,
  },
  {
    id: 10, type: "conference", title: "AfroTech 2026", org: "Blavity", handle: "@aflotech",
    location: "Austin, TX", date: "Nov 13–16", match: 93, attendees: 25000,
    description: "The largest Black tech conference in the world. Recruiting, talks, networking, and culture. 25,000+ attendees.",
    tags: ["Networking", "Recruiting", "Culture"], color: G.blue,
    gradient: `linear-gradient(135deg, ${G.blue}, #1565C0)`,
  },
  {
    id: 11, type: "workshop", title: "AI for Everyone", org: "fast.ai", handle: "@fastdotai",
    location: "Virtual", date: "Self-paced", match: 87, attendees: 12000,
    description: "Jeremy Howard's legendary course. No prerequisites. Build real AI applications from day one. Completely free.",
    tags: ["AI/ML", "Free", "Self-Paced"], color: G.red,
    gradient: `linear-gradient(135deg, ${G.red}, #C62828)`,
  },
  {
    id: 12, type: "internship", title: "SWE Intern @ Stripe", org: "Stripe", handle: "@stripe",
    location: "Remote (US)", date: "Jan 15 Deadline", match: 81, attendees: 4200,
    description: "Build infrastructure that powers the internet economy. Competitive pay, mentorship, and real impact from day one.",
    tags: ["Backend", "Payments", "Remote"], color: G.yellow,
    gradient: `linear-gradient(135deg, #FFD93D, #F9A825)`,
  },
];

export const typeEmoji: Record<EventItem["type"], string> = {
  hackathon: "🚀",
  scholarship: "🎓",
  internship: "💼",
  conference: "🎤",
  workshop: "🛠️",
};
