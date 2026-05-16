import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  Compass,
  GraduationCap,
  HeartHandshake,
  MapPin,
  MessageCircleHeart,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Hackathons", color: "bg-blueberry text-white", icon: Compass },
  { label: "Scholarships", color: "bg-sunshine text-ink", icon: CircleDollarSign },
  { label: "Mentorship", color: "bg-mint text-white", icon: HeartHandshake },
  { label: "Internships", color: "bg-coral text-white", icon: GraduationCap },
];

const opportunities = [
  {
    title: "Beginner AI Hack Night",
    org: "Code Collective",
    meta: "Remote • Closes Friday",
    score: "96%",
    tags: ["Beginner-friendly", "Free", "Remote"],
    accent: "border-blueberry/25 bg-blueberry/5",
  },
  {
    title: "Women in Product Mentors",
    org: "Product Bridge",
    meta: "8 mi away • Rolling",
    score: "91%",
    tags: ["Mentorship", "No experience required"],
    accent: "border-mint/25 bg-mint/5",
  },
  {
    title: "First-Gen Tech Grant",
    org: "Open Campus Fund",
    meta: "Online • 12 days left",
    score: "88%",
    tags: ["Funding", "Career prep"],
    accent: "border-sunshine/30 bg-sunshine/10",
  },
];

const supportTags = [
  "Free",
  "Remote",
  "Beginner-friendly",
  "Mentorship",
  "No experience required",
  "Travel support",
];

const whyItems = [
  "Matched to your goals",
  "Respects your range",
  "Explains every recommendation",
];

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper text-ink">
      <div className="absolute inset-x-0 top-0 -z-10 h-[780px] bg-[radial-gradient(circle_at_20%_10%,rgba(244,182,63,0.24),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(59,111,245,0.18),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#fcfbf7_68%)]" />
      <Header />
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-14">
        <HeroCopy />
        <HeroVisual />
      </section>
      <ProofStrip />
      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-16 sm:px-8 lg:grid-cols-3 lg:px-10">
        <FeatureCard
          icon={BookOpenCheck}
          title="A stack, not a search chore"
          copy="Fora starts with 5-10 high-fit opportunities, then lets you explore more when you have the time."
        />
        <FeatureCard
          icon={MessageCircleHeart}
          title="Private preferences"
          copy="Users choose what they want surfaced. The app explains matches without turning identity into a public label."
        />
        <FeatureCard
          icon={CalendarClock}
          title="Built around deadlines"
          copy="Urgent opportunities get a boost only when they are still relevant to goals, access needs, and location."
        />
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
      <a className="flex items-center gap-3" href="/" aria-label="Fora home">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
          <Sparkles className="h-5 w-5 text-blueberry" aria-hidden="true" />
        </span>
        <span className="text-xl font-black tracking-tight">Fora</span>
      </a>
      <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/65 md:flex">
        <a className="transition hover:text-ink" href="#stack">
          Daily stack
        </a>
        <a className="transition hover:text-ink" href="#matching">
          Matching
        </a>
        <a className="transition hover:text-ink" href="#saved">
          Saved
        </a>
      </nav>
      <Button variant="secondary" size="sm">
        Sign in
      </Button>
    </header>
  );
}

function HeroCopy() {
  return (
    <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-blueberry shadow-sm ring-1 ring-blueberry/10">
        <span className="h-2 w-2 rounded-full bg-mint" />
        Built for 5 minutes a day
      </div>
      <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-normal text-ink sm:text-6xl lg:text-7xl">
        Find your next tech opening in 5 minutes.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-ink/68 lg:mx-0">
        A daily stack of hackathons, mentors, scholarships, and communities
        matched to your goals, access needs, and location.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
        <Button size="lg" className="w-full sm:w-auto">
          Build my stack
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
          View demo
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-sm",
                category.color,
              )}
              key={category.label}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {category.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div
      id="stack"
      className="relative mx-auto w-full max-w-[520px] lg:mr-0"
      aria-label="Fora app preview"
    >
      <div className="absolute -left-4 top-16 hidden w-36 rotate-[-8deg] rounded-[2rem] bg-white p-3 shadow-card ring-1 ring-ink/5 sm:block">
        <div className="rounded-[1.35rem] bg-cloud p-3">
          <UsersRound className="h-6 w-6 text-mint" aria-hidden="true" />
          <p className="mt-3 text-sm font-black leading-tight">
            2 friends saved this
          </p>
        </div>
      </div>
      <div className="absolute -right-3 bottom-20 hidden w-40 rotate-[7deg] rounded-[2rem] bg-white p-3 shadow-card ring-1 ring-ink/5 sm:block">
        <div className="rounded-[1.35rem] bg-sunshine/20 p-3">
          <MapPin className="h-6 w-6 text-coral" aria-hidden="true" />
          <p className="mt-3 text-sm font-black leading-tight">
            8 miles away
          </p>
        </div>
      </div>
      <div className="rounded-[2.5rem] bg-ink p-3 shadow-soft">
        <div className="overflow-hidden rounded-[2rem] bg-[#f7f9fd]">
          <div className="flex items-center justify-between border-b border-ink/5 bg-white px-5 py-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/35">
                Today
              </p>
              <p className="text-lg font-black">Your stack</p>
            </div>
            <span className="rounded-full bg-blueberry px-3 py-1 text-xs font-black text-white">
              7 picks
            </span>
          </div>
          <div className="space-y-4 p-4">
            {opportunities.map((opportunity, index) => (
              <OpportunityCard
                index={index}
                key={opportunity.title}
                opportunity={opportunity}
              />
            ))}
          </div>
          <div className="bg-white px-5 py-4">
            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-2xl bg-cloud py-3 text-sm font-black text-ink/60">
                Pass
              </button>
              <button className="rounded-2xl bg-blueberry py-3 text-sm font-black text-white">
                Save
              </button>
              <button className="rounded-2xl bg-ink py-3 text-sm font-black text-white">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Opportunity = (typeof opportunities)[number];

function OpportunityCard({
  opportunity,
  index,
}: {
  opportunity: Opportunity;
  index: number;
}) {
  return (
    <article
      className={cn(
        "rounded-[1.55rem] border p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1",
        opportunity.accent,
      )}
      style={{ transform: `translateY(${index * 2}px)` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-ink/48">{opportunity.org}</p>
          <h2 className="mt-1 text-xl font-black leading-tight">
            {opportunity.title}
          </h2>
          <p className="mt-2 text-sm font-semibold text-ink/56">
            {opportunity.meta}
          </p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white shadow-sm">
          <span className="text-sm font-black text-blueberry">
            {opportunity.score}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {opportunity.tags.map((tag) => (
          <span
            className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-ink/68 shadow-sm"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2">
        <span className="text-xs font-bold text-ink/55">Why this?</span>
        <span className="inline-flex items-center gap-1 text-xs font-black text-mint">
          Matched
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function ProofStrip() {
  return (
    <section
      id="matching"
      className="border-y border-ink/5 bg-white/72 backdrop-blur"
    >
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 md:grid-cols-3 lg:px-10">
        {whyItems.map((item) => (
          <div className="flex items-center gap-3" key={item}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-mint/10 text-mint">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="font-black">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof BookOpenCheck;
  title: string;
  copy: string;
}) {
  return (
    <article
      id={title.includes("stack") ? "saved" : undefined}
      className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-ink/5"
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {supportTags.slice(0, 3).map((tag) => (
          <span
            className="rounded-full bg-cloud px-3 py-1.5 text-xs font-black text-ink/58"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blueberry/10 text-blueberry">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-2xl font-black tracking-normal">{title}</h3>
      <p className="mt-3 leading-7 text-ink/62">{copy}</p>
    </article>
  );
}

export default App;
