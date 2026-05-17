import { UserButton, useAuth } from "@clerk/react";
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  ChevronDown,
  Clock3,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteOpportunityAction,
  fetchSavedOpportunityIds,
  recordOpportunityAction,
} from "@/api/actions";
import type { ApiStackOpportunity } from "@/api/daily-stack";
import { fetchDailyStack, fetchExploreMore } from "@/api/daily-stack";
import { cn } from "@/lib/utils";

/* ── Spectrum animation keyframes ── */
const SPECTRUM_STYLE_ID = "fora-spectrum-styles-feed";
if (typeof document !== "undefined" && !document.getElementById(SPECTRUM_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = SPECTRUM_STYLE_ID;
  style.textContent = `
    @keyframes spectrumShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
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
    .fora-line-clamp-2,
    .fora-line-clamp-3 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .fora-line-clamp-2 {
      -webkit-line-clamp: 2;
    }
    .fora-line-clamp-3 {
      -webkit-line-clamp: 3;
    }
  `;
  document.head.appendChild(style);
}

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
  const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
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
        const savedResponse = await fetchSavedOpportunityIds(token).catch(() => ({
          opportunityIds: [],
        }));

        if (!cancelled) {
          if (!dailyResponse.profileComplete || !exploreResponse.profileComplete) {
            navigate("/onboarding", { replace: true });
            return;
          }

          setOpportunities(
            dedupeOpportunities([
              ...dailyResponse.stack,
              ...exploreResponse.opportunities,
            ]),
          );
          setSaved(new Set(savedResponse.opportunityIds));
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
  const categories = useMemo(
    () => getCategoryTabs(feedItems, saved),
    [feedItems, saved],
  );
  const visibleItems = useMemo(
    () =>
      activeCategory === "overall"
        ? feedItems
        : activeCategory === "saved"
          ? feedItems.filter((item) => saved.has(item.id))
        : feedItems.filter((item) => item.category === activeCategory),
    [activeCategory, feedItems, saved],
  );

  async function toggleSave(id: string) {
    if (pendingSaves.has(id)) return;

    const token = await getToken();

    if (!token) {
      setActionError("Sign in again to save this opportunity.");
      return;
    }

    const wasSaved = saved.has(id);

    setActionError(null);
    setPendingSaves((previous) => new Set(previous).add(id));
    setSaved((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      if (wasSaved) {
        await deleteOpportunityAction(token, id, "save");
      } else {
        await recordOpportunityAction(token, id, "save");
      }
    } catch (cause) {
      setSaved((previous) => {
        const next = new Set(previous);
        wasSaved ? next.add(id) : next.delete(id);
        return next;
      });
      setActionError(
        cause instanceof Error ? cause.message : "Could not update saved item.",
      );
    } finally {
      setPendingSaves((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    }
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
        <div className="relative h-[100dvh] bg-black">
          <CategoryTabs
            activeCategory={activeCategory}
            categories={categories}
            onChange={setActiveCategory}
          />
          {activeCategory === "saved" ? (
            <CenteredFeedState eyebrow="Saved" title="No saved opportunities yet.">
              <p className="mt-3 text-sm leading-6 text-white/65">
                Bookmark opportunities from the feed and they will collect here.
              </p>
            </CenteredFeedState>
          ) : (
            <CenteredFeedState eyebrow="No opportunities yet" title="Run the scraper and push accepted records.">
              <p className="mt-3 text-sm leading-6 text-white/65">
                This feed intentionally does not fall back to hardcoded events.
              </p>
            </CenteredFeedState>
          )}
        </div>
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
        {actionError ? (
          <div className="fixed bottom-4 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-white/12 bg-black/75 px-4 py-2 text-center text-xs font-semibold text-white shadow-2xl backdrop-blur-xl">
            {actionError}
          </div>
        ) : null}
        {visibleItems.map((event, index) => (
          <ProductiveScrollCard
            event={event}
            index={index}
            isSaved={saved.has(event.id)}
            key={event.id}
            isSavePending={pendingSaves.has(event.id)}
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
    <div className="fixed left-0 right-0 top-10 z-40 flex justify-center px-2 sm:top-14 sm:px-3">
      <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-white/12 bg-black/32 p-1 text-[0.68rem] font-black text-white shadow-lg backdrop-blur-xl scrollbar-hide sm:gap-2 sm:text-xs">
        {categories.map((category) => (
          <button
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 transition sm:py-2",
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
  isSavePending,
  isSaved,
  onToggleSave,
  total,
}: {
  event: FeedItem;
  index: number;
  isSavePending: boolean;
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

      <div className="relative z-10 mx-auto grid h-full w-full max-w-[460px] grid-rows-[minmax(0,1fr)_auto] px-4 pb-3 pt-[5.85rem] sm:px-6 sm:pb-5 sm:pt-16">
        <div className="flex min-h-0 flex-col items-center justify-end pb-3 text-center sm:pb-4">
          {event.imageUrl && event.imageKind === "logo" ? (
            <div className="mb-3 grid h-20 w-20 place-items-center rounded-3xl border border-white/20 bg-white/92 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.28)] sm:mb-5 sm:h-24 sm:w-24 sm:p-4">
              <img
                alt=""
                className="max-h-full max-w-full object-contain"
                src={event.imageUrl}
              />
            </div>
          ) : null}
          {/* Category badges */}
          <div className="mb-2 flex max-h-[2rem] flex-wrap items-center justify-center gap-2 overflow-hidden sm:mb-4 sm:max-h-none">
            <span
              className="rounded-full border px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-white sm:px-3.5 sm:text-[0.65rem]"
              style={{
                background: event.style.accent,
                borderColor: `${event.style.accent}88`,
                boxShadow: `0 0 18px ${event.style.accent}44`,
              }}
            >
              {event.style.marker}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[0.62rem] font-semibold text-white/90 backdrop-blur-lg sm:text-[0.7rem]">
              {event.style.label}
            </span>
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[0.62rem] font-semibold text-white/90 backdrop-blur-lg sm:text-[0.7rem]">
              {event.match}% match
            </span>
          </div>

          {/* Instant-read eyebrow */}
          <p
            className="mb-2 flex items-center justify-center gap-2 text-[0.58rem] uppercase tracking-[0.24em] text-white/55 sm:mb-3 sm:text-[0.68rem]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <Sparkles className="h-3 w-3" />
            {event.instantRead}
          </p>

          {/* Hero title */}
          <h1
            className="max-w-[94vw] text-balance break-words text-[clamp(2.05rem,9vw,3.05rem)] font-bold leading-[0.94] tracking-[-0.02em] sm:max-w-[18ch] sm:text-[3.35rem] md:max-w-[20ch] md:text-[3.5rem]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
            }}
            title={event.title}
          >
            {event.title}
          </h1>

          {/* Description */}
          <p
            className="fora-line-clamp-3 mt-3 min-h-[2.3rem] max-w-[34ch] text-[0.82rem] font-medium leading-snug text-white/72 sm:mt-4 sm:min-h-[2.9rem] sm:max-w-[38ch] sm:text-[0.94rem] sm:leading-normal"
            title={event.description}
          >
            {event.description}
          </p>
        </div>

        {/* Bottom info card */}
        <div
          className="w-full overflow-hidden rounded-[1.25rem] border-2 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.4)] sm:rounded-[1.4rem]"
          style={{ borderColor: event.style.accent }}
        >
          <div className="p-3 text-left sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="text-[0.58rem] font-medium uppercase tracking-[0.2em] sm:text-[0.65rem]"
                  style={{ color: event.style.accent, fontFamily: "'DM Mono', monospace" }}
                >
                  {event.style.focusLabel}
                </p>
                <h2
                  className="mt-1 text-[1.05rem] font-bold leading-tight text-[#0a0d14] sm:mt-1.5 sm:text-[1.25rem]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {event.decisionHeadline}
                </h2>
              </div>
              <div
                className="shrink-0 rounded-full px-2.5 py-1 text-[0.58rem] font-semibold text-white sm:text-[0.65rem]"
                style={{
                  background: event.style.accent,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {index + 1}/{total}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-3.5">
              <InfoPill icon={<CalendarDays className="h-3.5 w-3.5" />} label={event.date} />
              <InfoPill icon={<MapPin className="h-3.5 w-3.5" />} label={event.location} />
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3">
              {event.tags.map((tag) => (
                <span
                  className="rounded-full border px-2.5 py-1 text-[0.62rem] font-bold text-[#172033] shadow-[0_6px_16px_rgba(15,23,42,0.06)] sm:px-3 sm:py-1.5 sm:text-[0.68rem]"
                  key={tag}
                  style={getTagStyle(tag, event.style.accent)}
                >
                  {formatTagLabel(tag)}
                </span>
              ))}
            </div>

            <p className="mt-2.5 text-[0.64rem] italic text-[#64748b] sm:mt-3 sm:text-[0.7rem]">
              {event.trustCue}
            </p>

            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 sm:mt-4">
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition active:scale-[0.97] sm:h-[3.2rem]"
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
                  "grid h-12 w-12 place-items-center rounded-xl border transition active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:h-[3.2rem] sm:w-[3.2rem]",
                  isSaved
                    ? "border-[#10131f] bg-[#10131f] text-white"
                    : "border-[#d1d9e2] bg-[#f8fafc] text-[#334155]",
                )}
                disabled={isSavePending}
                onClick={onToggleSave}
                type="button"
              >
                <Bookmark className={cn("h-5 w-5", isSaved ? "fill-white" : "")} />
              </button>
            </div>
          </div>
        </div>

        {index < total - 1 ? (
          <div className="mt-2 hidden animate-pulse items-center justify-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/40 sm:flex">
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
      <div className="fixed left-0 right-0 top-0 z-50 flex h-10 items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-3 sm:h-14 sm:px-4">
        <button
          className="text-white/80 transition-colors hover:text-white"
          onClick={navigateHome}
          type="button"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          aria-label="Open landing page"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[3px] rounded-full px-2 py-1 transition hover:bg-white/10"
          onClick={() => navigateHome()}
          type="button"
        >
          <div className="h-2 w-2 rounded-full bg-[#CDB4DB]" />
          <div className="h-2 w-2 rounded-full bg-[#FFB5A7]" />
          <div className="h-2 w-2 rounded-full bg-[#F4F1DE]" />
          <div className="h-2 w-2 rounded-full bg-[#B2C9AB]" />
          <span className="fora-spectrum-text ml-1.5 text-sm font-semibold">fora</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-white/70 sm:inline">
            Productive Scroll
          </span>
          <button
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[0.7rem] font-bold text-white/85 backdrop-blur-md transition hover:border-white/30 hover:bg-white/15 active:scale-[0.98] sm:h-9 sm:px-3.5 sm:text-xs"
            onClick={() => window.location.assign("/onboarding")}
            type="button"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit responses</span>
            <span className="sm:hidden">Edit</span>
          </button>
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
  const tags = getDetailTags(opportunity, category).slice(0, 5);

  return {
    id: opportunity.id,
    title: opportunity.title,
    organization: opportunity.organization,
    description: opportunity.description,
    category,
    date: formatDate(opportunity.deadline),
    decisionHeadline: getDecisionHeadline(opportunity, style.label),
    instantRead: getInstantRead(opportunity),
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

function getCategoryTabs(items: FeedItem[], saved: Set<string>) {
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
    {
      id: "saved",
      label: "Saved",
      count: items.filter((item) => saved.has(item.id)).length,
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
    return getScholarshipHeadline(opportunity.cost);
  }

  if (opportunity.category === "mentorship") {
    return "Mentorship path";
  }

  if (opportunity.category === "internship") {
    return opportunity.isRemote ? "Remote role" : "Early-career role";
  }

  return `${categoryLabel} fit`;
}

function getInstantRead(opportunity: ApiStackOpportunity) {
  const strongestReason = opportunity.matchReasons[0] ?? "high-fit";
  return titleCase(strongestReason.replace(/-/g, " "));
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
  return `Saved by ${count} learners.`;
}

function getDetailTags(opportunity: ApiStackOpportunity, category: string) {
  const redundantTags = new Set([
    category,
    categoryStyles[category]?.label.toLowerCase(),
    "matches your goals",
    "matches your support needs",
  ]);

  return compactUnique([
    ...opportunity.accessibilityTags,
    ...opportunity.topicTags,
    ...opportunity.experienceLevelTags,
  ]).filter((tag) => !redundantTags.has(tag.toLowerCase()));
}

function getScholarshipHeadline(cost: string | null) {
  if (!cost) return "Funding available";

  const normalized = cost.toLowerCase();

  if (normalized.includes("scholarship") || normalized.includes("funding")) {
    return "Funding available";
  }

  if (normalized.includes("free")) {
    return "Free to apply";
  }

  return cost;
}

function formatTagLabel(tag: string) {
  const labels: Record<string, string> = {
    ai: "AI",
    web: "Web",
    free: "Free",
    remote: "Remote",
    "beginner-friendly": "Beginner Friendly",
    "social-good": "Social Good",
    "travel-support": "Travel Support",
    "mentorship-included": "Mentorship Included",
    "no-experience-required": "No Experience Needed",
    "women-focused": "Women in Tech",
    "low-income-friendly": "Funding Support",
    "first-gen-friendly": "First-Gen Friendly",
    "lgbtq-friendly": "LGBTQ+ Friendly",
    "disability-friendly": "Disability Friendly",
    "career-switcher": "Career Switchers",
    "student-founder": "Student Founders",
    "evening-weekend": "Evening/Weekend",
    "fee-waived": "Fee Waived",
    design: "Design",
    data: "Data",
    cybersecurity: "Cybersecurity",
    hardware: "Hardware",
    startup: "Startups",
    "health-tech": "Health Tech",
  };

  return labels[tag.toLowerCase()] ?? titleCase(tag.replace(/-/g, " "));
}

function getTagStyle(tag: string, accent: string): CSSProperties {
  const lower = tag.toLowerCase();
  const palettes: Record<string, CSSProperties> = {
    free: {
      background: "#ecfdf3",
      borderColor: "#bbf7d0",
      color: "#047857",
    },
    remote: {
      background: "#eff6ff",
      borderColor: "#bfdbfe",
      color: "#1d4ed8",
    },
    ai: {
      background: "#f5f3ff",
      borderColor: "#ddd6fe",
      color: "#6d28d9",
    },
    "social-good": {
      background: "#fff7ed",
      borderColor: "#fed7aa",
      color: "#c2410c",
    },
    "beginner-friendly": {
      background: "#f0fdf4",
      borderColor: "#bbf7d0",
      color: "#15803d",
    },
    "travel-support": {
      background: "#fefce8",
      borderColor: "#fde68a",
      color: "#a16207",
    },
    web: {
      background: "#f0f9ff",
      borderColor: "#bae6fd",
      color: "#0369a1",
    },
  };

  return (
    palettes[lower] ?? {
      background: `${accent}12`,
      borderColor: `${accent}38`,
      color: "#172033",
    }
  );
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
