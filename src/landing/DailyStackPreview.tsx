import { Heart, Home, Search, UserCircle, type LucideIcon } from "lucide-react";

import { getMatchExplanationLabels } from "@/domain/match-explanations";
import type { Opportunity } from "@/domain/opportunities";
import { cn } from "@/lib/utils";

interface DailyStackPreviewProps {
  opportunities: Opportunity[];
  className?: string;
}

export function DailyStackPreview({
  opportunities,
  className,
}: DailyStackPreviewProps) {
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
          {opportunities.map((opportunity) => (
            <OpportunityCard opportunity={opportunity} key={opportunity.id} />
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

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const labels = getMatchExplanationLabels(opportunity.matchExplanationKeys);

  return (
    <article className="rounded-2xl border border-ink/8 bg-white p-3 shadow-[0_10px_24px_rgba(40,56,90,0.10)]">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <span className="rounded-md bg-blueberry px-2 py-1 text-[10px] font-black text-white">
            {opportunity.category}
          </span>
          <h2 className="mt-2 text-sm font-black leading-tight text-ink">
            {opportunity.title}
          </h2>
          <p className="mt-1 text-[11px] font-bold text-ink/55">
            {opportunity.timing}
          </p>
        </div>
        <div
          className={cn(
            "h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br",
            opportunity.imageClassName,
          )}
        >
          <div className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_65%_30%,rgba(255,255,255,0.85),transparent_22%),radial-gradient(circle_at_35%_70%,rgba(255,255,255,0.55),transparent_18%)]" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {labels.map((label) => (
          <span
            className="rounded-md bg-mint/14 px-2 py-1 text-[10px] font-black text-mint"
            key={label}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-ink/6 pt-2">
        <p className="text-[10px] font-bold text-ink/50">
          Why this matches you
        </p>
        <span className="rounded-full border border-ink/10 px-2 py-1 text-[10px] font-black">
          {opportunity.matchScore}% match
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
  icon: LucideIcon;
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
