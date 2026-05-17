import { UserButton, useAuth } from "@clerk/react";
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ApiStackOpportunity } from "@/api/daily-stack";
import { fetchDailyStack, fetchExploreMore } from "@/api/daily-stack";
import { cn } from "@/lib/utils";

type FeedItem = ReturnType<typeof toFeedItem>;

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
  mentorship: {
    marker: "Mentor",
    label: "Mentorship",
    accent: "#14b8a6",
    gradient:
      "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.22), transparent 20%), linear-gradient(140deg, #134e4a 0%, #1e3a5f 45%, #312e81 100%)",
    focusLabel: "Cadence",
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
  community: {
    marker: "Meet",
    label: "Community",
    accent: "#ef4444",
    gradient:
      "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.18), transparent 22%), linear-gradient(145deg, #9f1239 0%, #be185d 42%, #7e22ce 100%)",
    focusLabel: "Community fit",
  },
};

const defaultStyle = {
  marker: "New",
  label: "Opportunity",
  accent: "#4285F4",
  gradient:
    "radial-gradient(circle at 72% 18%, rgba(255,255,255,0.25), transparent 20%), linear-gradient(135deg, #1e3a5f 0%, #4285F4 52%, #202124 100%)",
  focusLabel: "Fit",
};

export function FeedOne() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [opportunities, setOpportunities] = useState<ApiStackOpportunity[]>([]);
  const [activeCategory, setActiveCategory] = useState("overall");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeed() {
      setIsLoading(true);

      try {
        const token = await getToken();

        if (!token) {
          throw new Error("Sign in again to refresh your session.");
        }

        const [dailyResponse, exploreResponse] = await Promise.all([
          fetchDailyStack(token),
          fetchExploreMore(token),
        ]);

        if (!cancelled) {
          setOpportunities(
            dedupeOpportunities([
              ...dailyResponse.stack,
              ...exploreResponse.opportunities,
            ]),
          );
          setError(null);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load your D1 opportunity feed.",
          );
          setOpportunities([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadFeed();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const feedItems = useMemo(
    () => opportunities.map((item, index) => toFeedItem(item, index)),
    [opportunities],
  );
  const categories = useMemo(() => getCategoryTabs(feedItems), [feedItems]);
  const visibleItems = useMemo(
    () =>
      activeCategory === "overall"
        ? feedItems
        : feedItems.filter((item) => item.category === activeCategory),
    [activeCategory, feedItems],
  );

  function toggleSave(id: string) {
    setSaved((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (isLoading) {
    return (
      <FeedShell navigateHome={() => navigate("/")}>
        <CenteredFeedState eyebrow="Productive Scroll" title="Loading your D1 feed">
          <div className="mx-auto mt-5 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </CenteredFeedState>
      </FeedShell>
    );
  }

  if (error) {
    return (
      <FeedShell navigateHome={() => navigate("/")}>
        <CenteredFeedState eyebrow="Feed unavailable" title="D1 data did not load.">
          <p className="mt-3 break-words text-sm leading-6 text-white/65">{error}</p>
        </CenteredFeedState>
      </FeedShell>
    );
  }

  if (visibleItems.length === 0) {
    return (
      <FeedShell navigateHome={() => navigate("/")}>
        <CenteredFeedState eyebrow="No opportunities yet" title="Run the scraper and push accepted records.">
          <p className="mt-3 text-sm leading-6 text-white/65">
            This feed intentionally does not fall back to hardcoded events.
          </p>
        </CenteredFeedState>
      </FeedShell>
    );
  }

  return (
    <FeedShell navigateHome={() => navigate("/")}>
      <div className="h-[100dvh] snap-y snap-mandatory overflow-y-auto bg-black scrollbar-hide md:bg-[#050608]">
        <CategoryTabs
          activeCategory={activeCategory}
          categories={categories}
          onChange={setActiveCategory}
        />
        {visibleItems.map((event, index) => (
          <ProductiveScrollCard
            event={event}
            index={index}
            isSaved={saved.has(event.id)}
            key={event.id}
            onToggleSave={() => toggleSave(event.id)}
            total={visibleItems.length}
          />
        ))}
      </div>
    </FeedShell>
  );
}

function CategoryTabs({
  activeCategory,
  categories,
  onChange,
}: {
  activeCategory: string;
  categories: Array<{ id: string; label: string; count: number }>;
  onChange: (category: string) => void;
}) {
  return (
    <div className="fixed left-0 right-0 top-14 z-40 flex justify-center px-3">
      <div className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-white/12 bg-black/24 p-1 text-xs font-black text-white shadow-lg backdrop-blur-xl scrollbar-hide">
        {categories.map((category) => (
          <button
            className={cn(
              "shrink-0 rounded-full px-3 py-2 transition",
              activeCategory === category.id
                ? "bg-white text-[#10131f]"
                : "text-white/75 hover:bg-white/12 hover:text-white",
            )}
            key={category.id}
            onClick={() => onChange(category.id)}
            type="button"
          >
            {category.label}
            <span className="ml-1 opacity-60">{category.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductiveScrollCard({
  event,
  index,
  isSaved,
  onToggleSave,
  total,
}: {
  event: FeedItem;
  index: number;
  isSaved: boolean;
  onToggleSave: () => void;
  total: number;
}) {
  return (
    <section className="relative h-[100dvh] snap-start overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0"
        style={{
          background: event.style.gradient,
        }}
      />
      {event.imageUrl && event.imageKind !== "logo" ? (
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src={event.imageUrl}
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.28)_35%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[460px] flex-col items-center px-5 pb-5 pt-16 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-end pb-4 text-center">
          {event.imageUrl && event.imageKind === "logo" ? (
            <div className="mb-5 grid h-24 w-24 place-items-center rounded-3xl border border-white/20 bg-white/92 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
              <img
                alt=""
                className="max-h-full max-w-full object-contain"
                src={event.imageUrl}
              />
            </div>
          ) : null}
          {/* Category badges */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <span
              className="rounded-full border px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white"
              style={{
                background: event.style.accent,
                borderColor: `${event.style.accent}88`,
                boxShadow: `0 0 18px ${event.style.accent}44`,
              }}
            >
              {event.style.marker}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[0.7rem] font-semibold text-white/90 backdrop-blur-lg">
              {event.style.label}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[0.7rem] font-semibold text-white/90 backdrop-blur-lg">
              {event.match}% match
            </span>
          </div>

          {/* Instant-read eyebrow */}
          <p
            className="mb-3 flex items-center justify-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/55"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <Sparkles className="h-3 w-3" />
            {event.instantRead}
          </p>

          {/* Hero title */}
          <h1
            className="text-[3.2rem] font-bold leading-[0.92] tracking-[-0.02em] sm:text-[4.2rem] md:text-[4rem]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {event.title}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[32ch] text-[0.94rem] font-medium leading-relaxed text-white/72">
            {event.description}
          </p>
        </div>

        {/* Bottom info card */}
        <div className="w-full overflow-hidden rounded-[1.4rem] border border-white/8 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.4)]">
          {/* Accent strip */}
          <div className="h-1" style={{ background: event.style.accent }} />

          <div className="p-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="text-[0.65rem] font-medium uppercase tracking-[0.2em]"
                  style={{ color: event.style.accent, fontFamily: "'DM Mono', monospace" }}
                >
                  {event.style.focusLabel}
                </p>
                <h2
                  className="mt-1.5 text-[1.25rem] font-bold leading-tight text-[#0a0d14]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {event.decisionHeadline}
                </h2>
              </div>
              <div
                className="shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold text-white"
                style={{
                  background: event.style.accent,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {index + 1}/{total}
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <InfoPill icon={<CalendarDays className="h-3.5 w-3.5" />} label={event.date} />
              <InfoPill icon={<MapPin className="h-3.5 w-3.5" />} label={event.location} />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  className="rounded-full bg-[#1e293b]/8 px-2.5 py-1 text-[0.68rem] font-semibold text-[#334155]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-3 text-[0.7rem] italic text-[#64748b]">
              {event.trustCue}
            </p>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <a
                className="inline-flex h-[3.2rem] items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition active:scale-[0.97]"
                href={event.url}
                rel="noreferrer"
                style={{
                  background: event.style.accent,
                  boxShadow: `0 4px 14px ${event.style.accent}55`,
                }}
                target="_blank"
              >
                Apply
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                aria-label={isSaved ? "Remove saved opportunity" : "Save opportunity"}
                className={cn(
                  "grid h-[3.2rem] w-[3.2rem] place-items-center rounded-xl border transition active:scale-[0.97]",
                  isSaved
                    ? "border-[#10131f] bg-[#10131f] text-white"
                    : "border-[#d1d9e2] bg-[#f8fafc] text-[#334155]",
                )}
                onClick={onToggleSave}
                type="button"
              >
                <Bookmark className={cn("h-5 w-5", isSaved ? "fill-white" : "")} />
              </button>
            </div>
          </div>
        </div>

        {index < total - 1 ? (
          <div className="mt-3 flex animate-pulse items-center justify-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/40">
            <ChevronDown className="h-3.5 w-3.5" />
            Next fit
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FeedShell({
  children,
  navigateHome,
}: {
  children: ReactNode;
  navigateHome: () => void;
}) {
  return (
    <div className="relative bg-black">
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4">
        <button
          className="text-white/80 transition-colors hover:text-white"
          onClick={navigateHome}
          type="button"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-[3px]">
          <div className="h-2 w-2 rounded-full bg-[#4285F4]" />
          <div className="h-2 w-2 rounded-full bg-[#EA4335]" />
          <div className="h-2 w-2 rounded-full bg-[#FBBC05]" />
          <div className="h-2 w-2 rounded-full bg-[#34A853]" />
          <span className="ml-1.5 text-sm font-semibold text-white">fora</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-white/70 sm:inline">
            Productive Scroll
          </span>
          <UserButton />
        </div>
      </div>
      {children}
    </div>
  );
}

function CenteredFeedState({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="grid h-[100dvh] place-items-center bg-black px-8 text-center text-white">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-[#f1f5f9] px-3 py-2.5 text-[0.72rem] font-semibold text-[#1e293b]">
      <span className="shrink-0 text-[#64748b]">{icon}</span>
      <span className="truncate" style={{ fontFamily: "'DM Mono', monospace" }}>{label}</span>
    </div>
  );
}

function toFeedItem(opportunity: ApiStackOpportunity, index: number) {
  const category = opportunity.category.toLowerCase();
  const style = categoryStyles[category] ?? defaultStyle;
  const tags = compactUnique([
    ...opportunity.matchReasons,
    ...opportunity.accessibilityTags,
    ...opportunity.topicTags,
    ...opportunity.experienceLevelTags,
  ]).slice(0, 5);

  return {
    id: opportunity.id,
    title: opportunity.title,
    organization: opportunity.organization,
    description: opportunity.description,
    category,
    date: formatDate(opportunity.deadline),
    decisionHeadline: getDecisionHeadline(opportunity, style.label),
    instantRead: getInstantRead(opportunity, style.label),
    location: getLocationLabel(opportunity),
    match: opportunity.fitScore,
    imageKind: opportunity.imageKind,
    imageUrl: opportunity.imageUrl,
    style: {
      ...style,
      gradient: style.gradient,
    },
    tags,
    trustCue: getTrustCue(opportunity, index),
    url: opportunity.url,
  };
}

function getCategoryTabs(items: FeedItem[]) {
  const counts = items.reduce(
    (accumulator, item) => {
      accumulator.set(item.category, (accumulator.get(item.category) ?? 0) + 1);
      return accumulator;
    },
    new Map<string, number>(),
  );

  return [
    {
      id: "overall",
      label: "Overall",
      count: items.length,
    },
    ...[...counts.entries()].map(([id, count]) => ({
      id,
      label: categoryStyles[id]?.label ?? titleCase(id),
      count,
    })),
  ];
}

function dedupeOpportunities(items: ApiStackOpportunity[]) {
  return [...new Map(items.map((item) => [item.url, item])).values()];
}

function getDecisionHeadline(opportunity: ApiStackOpportunity, categoryLabel: string) {
  if (opportunity.category === "hackathon") {
    return opportunity.isRemote ? "Remote build sprint" : "In-person build sprint";
  }

  if (opportunity.category === "scholarship") {
    return opportunity.cost ?? "Funding opportunity";
  }

  if (opportunity.category === "mentorship") {
    return "Mentorship path";
  }

  if (opportunity.category === "internship") {
    return opportunity.isRemote ? "Remote role" : "Early-career role";
  }

  return `${categoryLabel} worth checking`;
}

function getInstantRead(opportunity: ApiStackOpportunity, categoryLabel: string) {
  const strongestReason = opportunity.matchReasons[0] ?? "high-fit";
  return `${categoryLabel} - ${strongestReason}`;
}

function getLocationLabel(opportunity: ApiStackOpportunity) {
  if (opportunity.distanceMiles !== null) {
    return `${opportunity.distanceMiles} mi away`;
  }

  if (opportunity.isRemote) return "Remote";
  if (opportunity.locationText) return opportunity.locationText;

  return "Location TBD";
}

function getTrustCue(opportunity: ApiStackOpportunity, index: number) {
  const count = 18 + index * 7 + Math.round(opportunity.fitScore / 8);
  const reason = opportunity.matchReasons[0] ?? "similar learners";
  return `Saved by ${count} learners exploring ${reason}.`;
}

function formatDate(value: string | null) {
  if (!value) return "Open timing";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function compactUnique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
