import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CircleDollarSign,
  GraduationCap,
  Handshake,
  Heart,
  Home,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = ["How it works", "For you", "Categories", "About"];

const categoryCards = [
  {
    title: "Hackathons",
    copy: "Build, learn, and launch together.",
    icon: Zap,
    color: "text-blueberry",
    bg: "bg-blueberry/10",
    ring: "ring-blueberry/15",
  },
  {
    title: "Scholarships",
    copy: "Funding to fuel your future.",
    icon: GraduationCap,
    color: "text-mint",
    bg: "bg-mint/10",
    ring: "ring-mint/15",
  },
  {
    title: "Mentorship",
    copy: "Guidance from people who have been there.",
    icon: Handshake,
    color: "text-sunshine",
    bg: "bg-sunshine/20",
    ring: "ring-sunshine/25",
  },
  {
    title: "Internships",
    copy: "Real experience. Real impact.",
    icon: BriefcaseBusiness,
    color: "text-coral",
    bg: "bg-coral/10",
    ring: "ring-coral/15",
  },
];

const opportunityCards = [
  {
    type: "Hackathon",
    title: "Build for Good Hack",
    meta: "Online - Aug 24-25",
    tags: ["Beginner-friendly", "Free", "Remote", "Mentorship"],
    match: "95% match",
    image: "from-blueberry/80 via-sky-300 to-sunshine",
  },
  {
    type: "Scholarship",
    title: "Jane Street Women in Tech",
    meta: "Apply by Sep 10",
    tags: ["Women in tech", "Funding", "Undergrad"],
    match: "92% match",
    image: "from-coral/80 via-orange-200 to-blueberry/70",
  },
];

const benefits = [
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

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f8ff] px-3 py-3 text-ink sm:px-4 sm:py-4">
      <section className="mx-auto max-w-[1420px] overflow-hidden rounded-[1.35rem] border border-ink/10 bg-white shadow-[0_22px_80px_rgba(61,85,128,0.14)]">
        <Header />
        <div className="grid gap-8 px-5 pb-10 pt-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-6 lg:px-14 lg:pb-12 lg:pt-10">
          <HeroCopy />
          <HeroVisual />
        </div>
        <Categories />
        <BenefitStrip />
      </section>
      <p className="mx-auto mt-6 max-w-7xl text-center text-base font-semibold text-blueberry sm:text-lg">
        5 minutes today. More opportunities tomorrow.
      </p>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
      <a className="text-2xl font-black tracking-normal text-blueberry" href="/">
        Fora
      </a>
      <nav className="hidden items-center gap-9 text-sm font-bold text-ink/72 lg:flex">
        {navItems.map((item) => (
          <a className="transition hover:text-blueberry" href="/" key={item}>
            {item}
          </a>
        ))}
      </nav>
      <div className="hidden lg:block">
        <Button className="h-12 px-7">Build my stack</Button>
      </div>
      <div className="flex items-center gap-3 lg:hidden">
        <button
          aria-label="Open navigation"
          className="grid h-10 w-10 place-items-center rounded-full bg-cloud text-ink"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          aria-label="Open profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white"
        >
          <UserCircle className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function HeroCopy() {
  return (
    <div className="flex min-h-[520px] flex-col justify-center lg:pb-4">
      <h1 className="max-w-[680px] text-balance text-[3.15rem] font-black leading-[0.96] tracking-normal text-ink sm:text-6xl lg:text-[4.9rem]">
        Find your next tech opening{" "}
        <span className="text-blueberry">in 5 minutes.</span>
      </h1>
      <p className="mt-7 max-w-[560px] text-lg font-medium leading-8 text-ink/70">
        A daily stack of hackathons, mentors, scholarships, and communities
        matched to your goals.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="lg" className="w-full sm:w-auto">
          Build my stack
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
        <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-blueberry transition hover:bg-blueberry/5">
          See how it works
          <span className="grid h-7 w-7 place-items-center rounded-full border border-blueberry/30">
            <Play className="h-3.5 w-3.5 fill-blueberry" aria-hidden="true" />
          </span>
        </button>
      </div>
      <SocialProof />
    </div>
  );
}

function SocialProof() {
  return (
    <div className="mb-8 mt-10 flex flex-wrap items-center gap-4 lg:mb-0">
      <div className="flex -space-x-2">
        {["A", "N", "S", "M"].map((initial, index) => (
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm",
              [
                "bg-blueberry",
                "bg-mint",
                "bg-sunshine text-ink",
                "bg-coral",
              ][index],
            )}
            key={initial}
          >
            {initial}
          </span>
        ))}
      </div>
      <div>
        <div className="flex gap-0.5 text-sunshine">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              className="h-4 w-4 fill-current"
              aria-hidden="true"
              key={index}
            />
          ))}
        </div>
        <p className="mt-1 text-sm font-semibold text-ink/58">
          Loved by learners like you
        </p>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[560px] lg:min-h-[640px]" aria-label="Fora app preview">
      <div className="absolute right-[-12%] top-[19%] h-64 w-64 rounded-full bg-sunshine lg:h-80 lg:w-80" />
      <div className="absolute bottom-[15%] right-[18%] h-52 w-52 rounded-full bg-mint/75 lg:h-64 lg:w-64" />
      <div className="absolute bottom-[15%] left-[16%] h-64 w-64 rounded-full bg-blueberry lg:h-80 lg:w-80" />
      <div className="absolute left-[3%] top-[32%] hidden h-32 w-32 bg-[radial-gradient(#f4b63f_1.5px,transparent_1.5px)] [background-size:12px_12px] lg:block" />
      <PhoneMockup className="absolute left-1/2 top-1/2 w-[min(72vw,320px)] -translate-x-1/2 -translate-y-1/2 lg:w-[330px]" />
    </div>
  );
}

function PhoneMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[2.65rem] bg-[#111827] p-2.5 shadow-[0_25px_70px_rgba(23,32,51,0.32)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[2.05rem] bg-white">
        <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-[#111827]" />
        <div className="flex items-center justify-between px-5 pb-3 pt-9">
          <div>
            <p className="text-xs font-black text-ink">Good morning, Alex</p>
            <p className="text-[11px] font-semibold text-ink/55">
              Here is your stack for today
            </p>
          </div>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-cloud">
            <UserCircle className="h-4 w-4 text-ink/70" aria-hidden="true" />
          </span>
        </div>
        <div className="space-y-3 px-4 pb-4">
          {opportunityCards.map((opportunity) => (
            <OpportunityCard opportunity={opportunity} key={opportunity.title} />
          ))}
        </div>
        <div className="grid grid-cols-4 border-t border-ink/8 bg-white px-5 py-3 text-[10px] font-bold text-ink/50">
          <PhoneNav icon={Home} label="Home" active />
          <PhoneNav icon={Search} label="Explore" />
          <PhoneNav icon={Heart} label="Saved" />
          <PhoneNav icon={UserCircle} label="Profile" />
        </div>
      </div>
    </div>
  );
}

type Opportunity = (typeof opportunityCards)[number];

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="rounded-2xl border border-ink/8 bg-white p-3 shadow-[0_10px_24px_rgba(40,56,90,0.10)]">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <span className="rounded-md bg-blueberry px-2 py-1 text-[10px] font-black text-white">
            {opportunity.type}
          </span>
          <h2 className="mt-2 text-sm font-black leading-tight text-ink">
            {opportunity.title}
          </h2>
          <p className="mt-1 text-[11px] font-bold text-ink/55">
            {opportunity.meta}
          </p>
        </div>
        <div
          className={cn(
            "h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br",
            opportunity.image,
          )}
        >
          <div className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_65%_30%,rgba(255,255,255,0.85),transparent_22%),radial-gradient(circle_at_35%_70%,rgba(255,255,255,0.55),transparent_18%)]" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {opportunity.tags.map((tag) => (
          <span
            className="rounded-md bg-mint/14 px-2 py-1 text-[10px] font-black text-mint"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-ink/6 pt-2">
        <p className="text-[10px] font-bold text-ink/50">
          Why this matches you
        </p>
        <span className="rounded-full border border-ink/10 px-2 py-1 text-[10px] font-black">
          {opportunity.match}
        </span>
      </div>
    </article>
  );
}

function PhoneNav({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1",
        active && "text-blueberry",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function Categories() {
  return (
    <section id="categories" className="px-5 pb-12 sm:px-8 lg:px-14">
      <div className="mb-5">
        <h2 className="text-2xl font-black sm:text-3xl">
          Explore what's possible
        </h2>
        <p className="mt-1 text-sm font-medium text-ink/58">
          Opportunities designed for you.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              className={cn(
                "rounded-[1.4rem] bg-white p-6 shadow-sm ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-card",
                card.ring,
              )}
              key={card.title}
            >
              <span
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-full",
                  card.bg,
                  card.color,
                )}
              >
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-black">{card.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-ink/62">
                {card.copy}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BenefitStrip() {
  return (
    <section className="bg-[#eef6ff] px-5 py-8 sm:px-8 lg:px-14">
      <div className="grid gap-7 lg:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article className="flex gap-4" key={benefit.title}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-blueberry shadow-sm">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-black">{benefit.title}</h3>
                <p className="mt-1 max-w-sm text-sm font-medium leading-6 text-ink/62">
                  {benefit.copy}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default App;
