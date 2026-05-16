import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroGlassCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-[#fcfbf7] via-white to-rose-50">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-20 lg:px-16 lg:py-0">
          <div
            className={cn(
              "transition-all duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold tracking-wide text-rose-600">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              NEW — DAILY STACK
            </span>
          </div>

          <h1
            className={cn(
              "mt-6 max-w-[560px] text-balance text-5xl font-black leading-[0.95] tracking-tighter text-[#172033] transition-all delay-150 duration-700 sm:text-6xl lg:text-7xl",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            Stop searching.{" "}
            <span className="text-rose-500">Start building.</span>
          </h1>

          <p
            className={cn(
              "mt-6 max-w-[480px] text-lg leading-relaxed text-[#172033]/65 transition-all delay-300 duration-700",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            Fora finds the hackathons, scholarships, and opportunities that
            match you — so you can spend your time building, not browsing.
          </p>

          <div
            className={cn(
              "mt-10 flex flex-col gap-3 sm:flex-row sm:items-center transition-all delay-450 duration-700",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <Button
              size="lg"
              className="bg-rose-500 shadow-[0_14px_30px_rgba(244,63,94,0.28)] hover:bg-rose-600"
            >
              Join Fora free
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="lg">
              How it works
            </Button>
          </div>
        </div>

        <div className="relative flex min-h-[100dvh] items-center justify-center px-6 lg:px-12">
          <div
            className={cn(
              "w-full max-w-[440px] transition-all delay-600 duration-700",
              mounted
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-12 opacity-0 scale-95",
            )}
          >
            <GlassCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassCard() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-2xl sm:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-rose-100/40 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#172033]">
            Your daily stack
          </h3>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold text-rose-600">
            4 new today
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <GlassRow
            type="Hackathon"
            title="Build for Good Hack"
            match="96%"
            active
          />
          <GlassRow
            type="Scholarship"
            title="Jane Street Women in Tech"
            match="92%"
          />
          <GlassRow
            type="Mentorship"
            title="Senior Dev一对一"
            match="88%"
          />
        </div>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-4 shadow-inner backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#172033]/40">
            AI Match
          </p>
          <p className="mt-1 text-sm font-semibold text-[#172033]/70">
            "Based on your skills, you're a strong fit for 3 frontend roles."
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rose-100">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-rose-400 to-rose-500" />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-bold text-[#172033]/40">
            <span>Profile strength</span>
            <span>82%</span>
          </div>
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(244,63,94,0.25)] transition hover:bg-rose-600 active:scale-[0.98]">
          Build my stack
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="mt-3 text-center text-[11px] font-semibold text-[#172033]/40">
          Free · 5 minutes a day
        </p>
      </div>
    </div>
  );
}

function GlassRow({
  type,
  title,
  match,
  active,
}: {
  type: string;
  title: string;
  match: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/50 p-3 shadow-sm backdrop-blur-sm transition hover:bg-white/80",
        active && "ring-1 ring-rose-200/50",
      )}
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-200 to-rose-300 text-[10px] font-black text-rose-700">
        {type.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-[#172033]">{title}</p>
        <p className="text-[11px] font-bold text-[#172033]/50">{type}</p>
      </div>
      <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
        {match}
      </span>
    </div>
  );
}
