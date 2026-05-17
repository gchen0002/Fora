import { AnimatePresence, motion } from "framer-motion";
import { SignInButton, useAuth, UserButton } from "@clerk/react";
import { Sparkles, ArrowUpRight, Bookmark, CalendarDays, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchFeaturedOpportunities,
  type FeaturedOpportunity,
} from "@/api/featured-opportunities";
import { cn } from "@/lib/utils";

/* ── Spectrum animation keyframes (injected once) ── */
const SPECTRUM_STYLE_ID = "fora-spectrum-styles";
if (typeof document !== "undefined" && !document.getElementById(SPECTRUM_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = SPECTRUM_STYLE_ID;
  style.textContent = `
    @keyframes spectrumShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes spectrumShiftReverse {
      0%   { background-position: 100% 50%; }
      50%  { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    .fora-spectrum-text {
      background: linear-gradient(
        90deg,
        #CDB4DB, #FFB5A7, #F4F1DE, #B2C9AB,
        #CDB4DB, #FFB5A7, #F4F1DE, #B2C9AB
      );
      background-size: 300% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: spectrumShift 4s ease infinite;
    }
    .fora-spectrum-btn-nav {
      border: 1px solid rgba(255,255,255,0.72) !important;
      background: linear-gradient(
        100deg,
        #CDB4DB 0%,
        #FFB5A7 34%,
        #F4F1DE 66%,
        #B2C9AB 100%
      ) !important;
      box-shadow: 0 10px 28px rgba(205,180,219,0.32), 0 1px 0 rgba(255,255,255,0.85) inset;
    }
    .fora-spectrum-btn-nav:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 36px rgba(255,181,167,0.28), 0 1px 0 rgba(255,255,255,0.85) inset !important;
    }
    .fora-spectrum-btn-nav .spectrum-label {
      color: #202124;
      -webkit-text-fill-color: #202124;
    }
    .fora-spectrum-btn-landing-hero {
      border: 1px solid rgba(255,255,255,0.72) !important;
      background: linear-gradient(
        100deg,
        #CDB4DB 0%,
        #FFB5A7 34%,
        #F4F1DE 66%,
        #B2C9AB 100%
      ) !important;
      box-shadow: 0 16px 42px rgba(178,201,171,0.28), 0 1px 0 rgba(255,255,255,0.9) inset;
    }
    .fora-spectrum-btn-landing-hero:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 52px rgba(205,180,219,0.3), 0 1px 0 rgba(255,255,255,0.9) inset !important;
    }
    .fora-spectrum-btn-landing-hero .spectrum-label {
      color: #202124;
      -webkit-text-fill-color: #202124;
    }
    .fora-spectrum-btn-landing-hero svg,
    .fora-spectrum-btn-nav svg {
      color: #CDB4DB;
    }
  `;
  document.head.appendChild(style);
}

const G = {
  blue: "#CDB4DB", // Lavender
  red: "#FFB5A7", // Warm Peach
  yellow: "#F4F1DE", // Soft Cream
  green: "#B2C9AB", // Sage Green
} as const;

const ease = [0.32, 0.72, 0, 1] as const;

const categoryStyles: Record<
  string,
  {
    marker: string;
    label: string;
    accent: string;
    gradient: string;
    focusLabel: string;
  }
> = {
  hackathon: {
    marker: "Hack",
    label: "Hackathon",
    accent: "#4f8cff",
    gradient:
      "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.35), transparent 22%), linear-gradient(135deg, #1e40af 0%, #059669 48%, #ca8a04 100%)",
    focusLabel: "Build window",
  },
  scholarship: {
    marker: "Fund",
    label: "Scholarship",
    accent: "#f59e0b",
    gradient:
      "radial-gradient(circle at 30% 80%, rgba(255,255,255,0.18), transparent 22%), linear-gradient(150deg, #b45309 0%, #dc2626 40%, #9f1239 100%)",
    focusLabel: "Deadline",
  },
  internship: {
    marker: "Role",
    label: "Internship",
    accent: "#a855f7",
    gradient:
      "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2), transparent 20%), linear-gradient(160deg, #581c87 0%, #4338ca 50%, #0f172a 100%)",
    focusLabel: "Role fit",
  },
  workshop: {
    marker: "Learn",
    label: "Workshop",
    accent: "#22c55e",
    gradient:
      "radial-gradient(circle at 60% 15%, rgba(255,255,255,0.28), transparent 20%), linear-gradient(130deg, #064e3b 0%, #0e7490 55%, #1e293b 100%)",
    focusLabel: "Session",
  },
  course: {
    marker: "Learn",
    label: "Course",
    accent: "#22c55e",
    gradient:
      "radial-gradient(circle at 60% 15%, rgba(255,255,255,0.28), transparent 20%), linear-gradient(130deg, #064e3b 0%, #0e7490 55%, #1e293b 100%)",
    focusLabel: "Session",
  },
  mentorship: {
    marker: "Mentor",
    label: "Mentorship",
    accent: "#14b8a6",
    gradient:
      "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.22), transparent 20%), linear-gradient(140deg, #134e4a 0%, #1e3a5f 45%, #312e81 100%)",
    focusLabel: "Cadence",
  },
  community: {
    marker: "Meet",
    label: "Community",
    accent: "#ef4444",
    gradient:
      "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.18), transparent 22%), linear-gradient(145deg, #9f1239 0%, #be185d 42%, #7e22ce 100%)",
    focusLabel: "Community fit",
  },
};

const defaultCategoryStyle = {
  marker: "New",
  label: "Opportunity",
  accent: "#4285F4",
  gradient:
    "radial-gradient(circle at 72% 18%, rgba(255,255,255,0.25), transparent 20%), linear-gradient(135deg, #1e3a5f 0%, #4285F4 52%, #202124 100%)",
  focusLabel: "Fit",
};

const SAMPLE_EVENTS = [
  {
    id: "venushacks",
    title: "VENUS",
    titleBreak: "HACKS",
    subtitle: "Build The Future",
    eventName: "VenusHacks 2026",
    host: "WICS",
    category: "hackathon",
    tags: ["Beginner Friendly", "Free", "Travel Support"],
    month: "May",
    date: "24",
    fullDate: "Friday, May 24",
    time: "6:00 PM to Sun 12:00 PM PDT",
    guests: "500+ Hackers",
    guestNames: "Alice, Bob & Charlie",
    status: "Application Accepted",
    statusDesc: "A confirmation email has been sent",
    decisionHeadline: "In-person build sprint",
    match: 85,
    instantRead: "similar learners",
    location: "Irvine, CA",
  },
  {
    id: "gracehopper",
    title: "GRACE",
    titleBreak: "HOPPER",
    subtitle: "Celebration Grant",
    eventName: "GHC 2026 Scholarship",
    host: "AnitaB.org",
    category: "scholarship",
    tags: ["Scholarship", "Travel Support", "Women in Tech"],
    month: "Oct",
    date: "12",
    fullDate: "Tuesday, Oct 12",
    time: "All Day Event",
    guests: "15,000+ Attendees",
    guestNames: "Diana, Eva & Fay",
    status: "Saved to Stack",
    statusDesc: "Deadline approaching in 5 days",
    decisionHeadline: "Funding opportunity",
    match: 92,
    instantRead: "high-fit",
    location: "Remote",
  },
  {
    id: "outintech",
    title: "OUT IN",
    titleBreak: "TECH",
    subtitle: "Mentorship Program",
    eventName: "Fall Mentorship Cohort",
    host: "Out in Tech",
    category: "internship",
    tags: ["LGBTQ+ Tech", "Mentorship", "Remote"],
    month: "Sep",
    date: "01",
    fullDate: "Monday, Sep 01",
    time: "Remote / Flexible",
    guests: "200+ Mentors",
    guestNames: "George, Helen & Ian",
    status: "Application Open",
    statusDesc: "High match based on your goals",
    decisionHeadline: "Early-career role",
    match: 78,
    instantRead: "role alignment",
    location: "Remote",
  },
  {
    id: "codepath",
    title: "CODE",
    titleBreak: "PATH",
    subtitle: "Intro to iOS Dev",
    eventName: "Fall 2026 Course",
    host: "CodePath",
    category: "course",
    tags: ["Beginner Friendly", "Course", "Free"],
    month: "Sep",
    date: "15",
    fullDate: "Tuesday, Sep 15",
    time: "Weekly 6:00 PM",
    guests: "1000+ Students",
    guestNames: "Jack, Kelly & Liam",
    status: "High Fit",
    statusDesc: "Matches your interest in Mobile Dev",
    decisionHeadline: "Course path",
    match: 95,
    instantRead: "skill building",
    location: "Virtual",
  }
];

type LandingVisualEvent = (typeof SAMPLE_EVENTS)[number] & {
  imageKind?: FeaturedOpportunity["imageKind"];
  imageUrl?: string | null;
};

function toLandingVisualEvent(opportunity: FeaturedOpportunity): LandingVisualEvent {
  const category = normalizeVisualCategory(opportunity.category);
  const style = categoryStyles[category] ?? defaultCategoryStyle;
  const dateParts = formatOpportunityDate(opportunity.deadline);
  const titleParts = splitLandingTitle(opportunity.title);

  return {
    id: opportunity.id,
    title: titleParts.title,
    titleBreak: titleParts.titleBreak,
    subtitle: buildLandingSubtitle(opportunity, style.label),
    eventName: opportunity.title,
    host: opportunity.organization || "Featured source",
    category,
    tags: buildLandingTags(opportunity, style.label),
    month: dateParts.month,
    date: dateParts.day,
    fullDate: dateParts.fullDate,
    time: opportunity.isRemote ? "Remote / Flexible" : "In-person or hybrid",
    guests: "Featured from D1",
    guestNames: "Matched learners",
    status: "Live opportunity",
    statusDesc: "Pulled from the opportunity database",
    decisionHeadline: buildDecisionHeadline(category, opportunity),
    match: opportunity.match,
    instantRead: buildInstantRead(category, opportunity),
    location: formatLandingLocation(opportunity),
    imageKind: opportunity.imageKind,
    imageUrl: opportunity.imageUrl,
  };
}

function normalizeVisualCategory(category: string) {
  return category.toLowerCase() === "course" ? "workshop" : category.toLowerCase();
}

function splitLandingTitle(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return { title: title.toUpperCase(), titleBreak: "" };
  }

  const midpoint = Math.ceil(words.length / 2);
  return {
    title: words.slice(0, midpoint).join(" ").toUpperCase(),
    titleBreak: words.slice(midpoint).join(" ").toUpperCase(),
  };
}

function formatOpportunityDate(deadline: string | null) {
  if (!deadline) {
    return { month: "Open", day: "--", fullDate: "Open timing" };
  }

  const parsed = new Date(`${deadline}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { month: "Open", day: "--", fullDate: "Open timing" };
  }

  return {
    month: parsed.toLocaleDateString("en-US", { month: "short" }),
    day: parsed.toLocaleDateString("en-US", { day: "2-digit" }),
    fullDate: parsed.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  };
}

function buildLandingSubtitle(opportunity: FeaturedOpportunity, categoryLabel: string) {
  const description = opportunity.description.replace(/\s+/g, " ").trim();
  if (!description) return categoryLabel;

  const firstSentence = description.split(/[.!?]/)[0]?.trim();
  return firstSentence ? truncateWords(firstSentence, 8) : categoryLabel;
}

function buildLandingTags(opportunity: FeaturedOpportunity, categoryLabel: string) {
  const tags = [
    ...opportunity.accessibilityTags,
    ...opportunity.topicTags,
    ...opportunity.experienceLevelTags,
  ];
  const labels = [categoryLabel, ...tags.map(formatLandingTag)]
    .filter(Boolean)
    .filter((tag, index, arr) => arr.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) === index);

  return labels.slice(0, 3).length >= 3 ? labels.slice(0, 3) : [...labels, "Free"].slice(0, 3);
}

function formatLandingTag(tag: string) {
  return tag
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bAi\b/g, "AI")
    .replace(/\bUi\b/g, "UI")
    .replace(/\bUx\b/g, "UX");
}

function buildDecisionHeadline(category: string, opportunity: FeaturedOpportunity) {
  if (category === "hackathon") return opportunity.isRemote ? "Remote build sprint" : "In-person build sprint";
  if (category === "scholarship") return "Funding opportunity";
  if (category === "internship") return "Early-career role";
  if (category === "mentorship") return "Mentor match";
  if (category === "community") return "Community fit";
  if (category === "workshop") return "Skill session";
  return "Strong fit";
}

function buildInstantRead(category: string, opportunity: FeaturedOpportunity) {
  if (opportunity.match >= 90) return "high-fit";
  if (opportunity.isRemote) return "remote-friendly";
  if (category === "hackathon") return "build window";
  if (category === "scholarship") return "funding path";
  return "matches goals";
}

function formatLandingLocation(opportunity: FeaturedOpportunity) {
  if (opportunity.isRemote) return "Remote";
  return opportunity.locationText?.trim() || "Location TBA";
}

function truncateWords(value: string, maxWords: number) {
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return value;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-white font-sans text-[#202124] selection:bg-[#4285F4]/20">
      <Nav />

      <main className="relative flex min-h-[100dvh] items-center px-6 pt-20 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <LeftCopy />
            <RightVisual />
          </div>
        </div>
      </main>
    </div>
  );
}

function Nav() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="absolute left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[#e8eaed] bg-white/80 px-6 backdrop-blur-md lg:px-12"
    >
      <div className="flex items-center gap-2">
        {/* Google-style 4-dot logo */}
        <div className="flex items-center gap-[3px]">
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.blue }} />
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.red }} />
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.yellow }} />
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.green }} />
        </div>
        <span className="fora-spectrum-text text-lg font-medium tracking-tight">fora</span>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-normal text-[#5f6368]">
        {!isLoaded ? (
          <button
            className="fora-spectrum-btn-nav rounded-lg bg-white px-6 py-2 text-sm font-semibold opacity-70"
            disabled
            type="button"
          >
            <span className="spectrum-label">Loading</span>
          </button>
        ) : isSignedIn ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/onboarding")}
              className="rounded-lg border border-[#dadce0] bg-white px-4 py-2 text-sm font-medium text-[#5f6368] transition-all hover:bg-[#f8f9fa] active:scale-[0.98]"
              type="button"
            >
              Edit Response
            </button>
            <button
              onClick={() => navigate("/feed")}
              className="fora-spectrum-btn-nav rounded-lg bg-white px-6 py-2 text-sm font-semibold transition-all active:scale-[0.98]"
              type="button"
            >
              <span className="spectrum-label">Open feed</span>
            </button>
            <UserButton />
          </div>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/feed">
            <button
              className="fora-spectrum-btn-nav rounded-lg bg-white px-6 py-2 text-sm font-semibold transition-all active:scale-[0.98]"
              type="button"
            >
              <span className="spectrum-label">Sign in</span>
            </button>
          </SignInButton>
        )}
      </div>
    </motion.header>
  );
}

function PhoneStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    }

    update();
    const id = setInterval(update, 30_000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-30 flex h-12 items-center justify-between px-6 pt-2">
      <span className="min-w-10 text-[10px] font-semibold text-white/80">
        {time || "9:41"}
      </span>
      <div className="absolute left-1/2 top-2 h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-end gap-1.5 text-white/70">
        <div className="flex h-3 items-end gap-[2px]" aria-hidden="true">
          <span className="h-[4px] w-[2px] rounded-full bg-current" />
          <span className="h-[6px] w-[2px] rounded-full bg-current" />
          <span className="h-[8px] w-[2px] rounded-full bg-current" />
          <span className="h-[10px] w-[2px] rounded-full bg-current" />
        </div>
        <div className="relative h-[7px] w-[15px] rounded-[2px] border border-current" aria-hidden="true">
          <div className="absolute bottom-[1px] left-[1px] top-[1px] w-[10px] rounded-[1px] bg-current" />
          <div className="absolute -right-[3px] top-1/2 h-[3px] w-[2px] -translate-y-1/2 rounded-r bg-current" />
        </div>
      </div>
    </div>
  );
}

function LeftCopy() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <motion.div
      className="relative z-10 flex flex-col items-start pt-10 lg:pt-0"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* Small fora badge removed */}

      <TypewriterHeading />

      <motion.p
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-8 max-w-[500px] text-lg leading-relaxed text-[#5f6368] sm:text-xl lg:text-2xl"
      >
        A daily stack of hackathons, scholarships, and communities matched to your goals.
      </motion.p>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-8 flex items-center gap-3"
      >
        {!isLoaded ? (
          <button
            className="fora-spectrum-btn-landing-hero flex h-11 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold opacity-70"
            disabled
            type="button"
          >
            <span className="spectrum-label">Loading</span>
          </button>
        ) : isSignedIn ? (
          <button
            className="fora-spectrum-btn-landing-hero flex h-11 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition-all active:scale-[0.98]"
            onClick={() => navigate("/feed")}
            type="button"
          >
            <span className="spectrum-label">Open your feed</span>
          </button>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/feed">
            <button
              className="fora-spectrum-btn-landing-hero flex h-11 items-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition-all active:scale-[0.98]"
              type="button"
            >
              <span className="spectrum-label">Start exploring</span>
            </button>
          </SignInButton>
        )}
      </motion.div>
    </motion.div>
  );
}

function TypewriterHeading() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Find your\nplace in\ntech.";
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let isDeleting = false;
    let i = 0;

    function loop() {
      if (isDeleting) {
        setDisplayedText(fullText.slice(0, i - 1));
        i--;
      } else {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      }

      let speed = isDeleting ? 30 : 70;

      if (!isDeleting && i === fullText.length) {
        speed = 3000; // Pause at the end for 3 seconds
        isDeleting = true;
      } else if (isDeleting && i === 0) {
        speed = 1000; // Pause before typing again
        isDeleting = false;
      }

      timeoutId = setTimeout(loop, speed);
    }

    timeoutId = setTimeout(loop, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-6 min-h-[3em] text-[4rem] font-normal leading-[1.05] tracking-tight text-[#202124] sm:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem]"
    >
      {displayedText.split('\n').map((line, index, arr) => (
        <span key={index}>
          {line}
          {index < arr.length - 1 && <br />}
        </span>
      ))}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
        className="inline-block w-[3px] h-[0.75em] bg-[#d1d5db] ml-1 align-middle"
      />
    </motion.h1>
  );
}

export function RightVisual() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<LandingVisualEvent[]>(SAMPLE_EVENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return;
    const start = performance.now();

    function animate(t: number) {
      const s = (t - start) / 1000;
      const y = Math.sin(s * 0.5) * 10;
      const r = Math.sin(s * 0.35) * 1.5;
      if (el) el.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      requestAnimationFrame(animate);
    }

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeaturedOpportunities() {
      try {
        const response = await fetchFeaturedOpportunities(controller.signal);
        const featuredEvents = response.opportunities
          .filter((opportunity) => opportunity.imageUrl)
          .map(toLandingVisualEvent)
          .slice(0, 4);

        if (featuredEvents.length > 0) {
          setEvents(featuredEvents);
          setCurrentIndex(0);
        }
      } catch {
        // The landing hero should stay fast and resilient; static samples are the fallback.
      }
    }

    void loadFeaturedOpportunities();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4400);
    return () => clearInterval(interval);
  }, [events.length]);

  const event = events[currentIndex] ?? SAMPLE_EVENTS[0];
  const style = categoryStyles[event.category] ?? defaultCategoryStyle;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease, delay: 0.5 }}
      className="relative flex min-h-[720px] w-full items-center justify-center py-8"
    >
      {/* Decorative orbit rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute h-[500px] w-[500px] rounded-full border border-dashed border-[#CDB4DB]/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute h-[650px] w-[650px] rounded-full border border-dashed border-[#B2C9AB]/25"
        />
      </div>

      {/* Stacked ghost cards behind phone */}
      <div className="hidden">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-18, -15, -18] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="space-y-[-150px]"
        >
          {[0.15, 0.25, 0.4].map((opacity, i) => (
            <div
              key={i}
              className="h-[180px] w-[100px] rounded-2xl shadow-lg sm:h-[200px] sm:w-[120px]"
              style={{
                background: `linear-gradient(135deg, ${[G.green, G.blue, G.red][i]}88, #0a0d14cc)`,
                opacity: opacity * 0.75,
                transform: `rotate(${-8 + i * 3}deg) translateX(${i * 10}px)`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Phone Mockup — Dark feed style */}
      <div ref={phoneRef} className="relative z-10 h-[580px] w-[290px] sm:h-[620px] sm:w-[310px]">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.8rem] border-[3px] border-[#1a1a1a] bg-[#0a0d14] shadow-[0_30px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)]">
          {/* Status bar */}
          <PhoneStatusBar />

          {/* Category tabs */}
          <div className="relative z-20 flex gap-1.5 overflow-hidden px-4 py-2">
            {["Overall", "Hackathon", "Internship", "Workshop"].map((tab, i) => (
              <span
                key={tab}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold",
                  i === 0
                    ? "bg-white text-[#0a0d14]"
                    : "border border-white/15 text-white/60"
                )}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Card content — scrolling through events */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-black text-white">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={event.id}
                custom={direction}
                initial={{ opacity: 0, y: direction * 520 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -520 }}
                transition={{ duration: 0.76, ease }}
                className="absolute inset-0 flex h-full w-full flex-col overflow-hidden bg-black"
                style={{ willChange: "transform, opacity" }}
              >
              {/* Dark gradient hero area */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.1, ease }}
                style={{ background: style.gradient }}
              />
              {event.imageUrl && event.imageKind !== "logo" ? (
                <img
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                  src={event.imageUrl}
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.85)_100%)]" />

              <div className="relative z-10 mx-auto flex h-full w-full flex-col items-center px-4 pb-4 pt-4 sm:px-5">
                <motion.div
                  className="flex min-h-0 flex-1 flex-col items-center justify-end pb-3 text-center"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.55, ease }}
                >
                  {/* Category badges */}
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
                    <span
                      className="rounded-full border px-2 py-0.5 text-[0.45rem] font-bold uppercase tracking-[0.22em] text-white"
                      style={{
                        background: style.accent,
                        borderColor: `${style.accent}88`,
                        boxShadow: `0 0 12px ${style.accent}44`,
                      }}
                    >
                      {style.marker}
                    </span>
                    <span className="rounded-full border border-white/12 bg-white/10 px-2 py-0.5 text-[0.5rem] font-semibold text-white/90 backdrop-blur-lg">
                      {style.label}
                    </span>
                    <span className="rounded-full border border-white/12 bg-white/10 px-2 py-0.5 text-[0.5rem] font-semibold text-white/90 backdrop-blur-lg">
                      {event.match}% match
                    </span>
                  </div>

                  {/* Instant-read eyebrow */}
                  <p
                    className="mb-2 flex items-center justify-center gap-1.5 text-[0.5rem] uppercase tracking-[0.24em] text-white/55"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <Sparkles className="h-2 w-2" />
                    {style.label} - {event.instantRead}
                  </p>

                  {/* Title */}
                  <h2
                    className="text-[2.2rem] font-bold leading-[0.92] tracking-tight sm:text-[2.6rem]"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      textShadow: "0 4px 16px rgba(0,0,0,0.5)",
                    }}
                  >
                    {event.eventName}
                  </h2>

                  {/* Description */}
                  <p className="mt-2.5 max-w-[28ch] text-[0.65rem] font-medium leading-relaxed text-white/72">
                    {event.subtitle} - {event.host}
                  </p>
                </motion.div>

                {/* Bottom info card */}
                <motion.div
                  className="w-full overflow-hidden rounded-[1rem] border border-white/8 bg-white text-left shadow-[0_16px_50px_rgba(0,0,0,0.4)]"
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.5, ease }}
                >
                  {/* Accent strip */}
                  <div className="h-1" style={{ background: style.accent }} />

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className="text-[0.45rem] font-medium uppercase tracking-[0.2em]"
                          style={{ color: style.accent, fontFamily: "'DM Mono', monospace" }}
                        >
                          {style.focusLabel}
                        </p>
                        <h3
                          className="mt-1 text-[0.9rem] font-bold leading-tight text-[#0a0d14]"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {event.decisionHeadline}
                        </h3>
                      </div>
                      <div
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[0.45rem] font-semibold text-white"
                        style={{
                          background: style.accent,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {currentIndex + 1}/{events.length}
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-[#f1f5f9] px-2 py-1.5 text-[0.5rem] font-semibold text-[#1e293b]">
                        <CalendarDays className="h-2.5 w-2.5 shrink-0 text-[#64748b]" />
                        <span className="truncate font-mono">{event.fullDate.split(",")[1]?.trim() ?? event.fullDate}</span>
                      </div>
                      <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-[#f1f5f9] px-2 py-1.5 text-[0.5rem] font-semibold text-[#1e293b]">
                        <MapPin className="h-2.5 w-2.5 shrink-0 text-[#64748b]" />
                        <span className="truncate font-mono">{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-[#1e293b]/8 px-1.5 py-0.5 text-[0.5rem] font-semibold text-[#334155]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-1.5">
                      <div
                        className="flex h-[2rem] items-center justify-center gap-1.5 rounded-xl text-[0.65rem] font-bold text-white transition active:scale-[0.97]"
                        style={{
                          background: style.accent,
                          boxShadow: `0 4px 14px ${style.accent}55`,
                        }}
                      >
                        Apply
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                      <div className="grid h-[2rem] w-[2rem] place-items-center rounded-xl border border-[#d1d9e2] bg-[#f8fafc] text-[#334155] transition active:scale-[0.97]">
                        <Bookmark className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Floating UI Elements ── */}

      {/* Deadline pill — top left */}
      <motion.div
        animate={{ y: [-4, 6, -4], rotate: [-6, -3, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[12%] z-20 hidden items-center gap-2.5 rounded-2xl border border-[#e8eaed] bg-white px-3.5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:flex lg:left-[2%]"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${G.red}18` }}>
          <CalendarDays className="h-4 w-4" style={{ color: G.red }} />
        </div>
        <div>
          <p className="text-[9px] font-medium text-[#94a3b8]">Deadline</p>
          <p className="text-[12px] font-bold text-[#1e293b]">May 23</p>
        </div>
      </motion.div>

      {/* Saved badge — bottom left */}
      <motion.div
        animate={{ y: [3, -5, 3], rotate: [4, 8, 4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[12%] left-[8%] z-20 hidden items-center gap-2 rounded-2xl border border-[#e8eaed] bg-white px-3.5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:flex lg:left-[6%]"
      >
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#7c3aed]/10">
          <Bookmark className="h-4 w-4 text-[#7c3aed]" />
        </div>
        <span className="text-[12px] font-bold text-[#1e293b]">Saved</span>
      </motion.div>

      {/* Match ring — top right */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[6%] top-[9%] z-20 hidden h-24 w-24 flex-col items-center justify-center rounded-full border border-[#e8eaed] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:flex lg:right-[2%]"
      >
        {/* SVG ring */}
        <svg className="absolute inset-0" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="38" fill="none" stroke="#e8eaed" strokeWidth="3" />
          <circle
            cx="48" cy="48" r="38" fill="none"
            stroke="#22c55e" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${0.7 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
            transform="rotate(-90 48 48)"
          />
        </svg>
        <span className="relative text-lg font-bold text-[#22c55e]">70%</span>
        <span className="relative text-[8px] font-semibold text-[#94a3b8]">match</span>
      </motion.div>

      {/* Category pills — right middle */}
      <motion.div
        animate={{ y: [3, -4, 3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden"
      >
        <span className="rounded-full border border-[#4f8cff]/30 bg-white/90 px-3 py-1.5 text-center text-[10px] font-bold text-[#4f8cff] shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
          Hackathon
        </span>
        <span className="rounded-full border border-[#f59e0b]/30 bg-white/90 px-3 py-1.5 text-center text-[10px] font-bold text-[#f59e0b] shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
          Scholarship
        </span>
        <span className="rounded-full border border-[#22c55e]/30 bg-white/90 px-3 py-1.5 text-center text-[10px] font-bold text-[#22c55e] shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
          Internship
        </span>
      </motion.div>

      {/* Location pin — right lower */}
      <motion.div
        key={event.location}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: [-3, 5, -3], scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{
          opacity: { duration: 0.22 },
          scale: { duration: 0.22 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-[35%] right-[5%] z-20 hidden items-center gap-2 rounded-2xl border border-[#e8eaed] bg-white px-3 py-2 shadow-[0_8px_20px_rgba(0,0,0,0.06)] md:flex lg:right-[3%]"
      >
        <MapPin className="h-4 w-4 shrink-0 text-[#22c55e]" />
        <span className="max-w-[92px] truncate text-[11px] font-bold text-[#1e293b]">
          {event.location}
        </span>
      </motion.div>

      {/* Profile icon — bottom right */}
      <motion.div
        animate={{ y: [2, -4, 2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden"
      >
        <svg className="h-5 w-5 text-[#CDB4DB]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </motion.div>

    </motion.div>
  );
}

