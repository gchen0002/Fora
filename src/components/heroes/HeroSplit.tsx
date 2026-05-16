import { ArrowRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSplit() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[100dvh] bg-[#fcfbf7]">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-20 lg:px-16 lg:py-0">
          <div
            className={cn(
              "transition-all duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            <span className="inline-block rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold tracking-wide text-rose-600">
              FORA — OPPORTUNITIES THAT FIND YOU
            </span>
          </div>

          <h1
            className={cn(
              "mt-6 max-w-[620px] text-balance text-5xl font-black leading-[0.95] tracking-tighter text-[#172033] transition-all delay-150 duration-700 sm:text-6xl lg:text-7xl",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            Your next tech move,{" "}
            <span className="text-rose-500">five minutes a day.</span>
          </h1>

          <p
            className={cn(
              "mt-6 max-w-[520px] text-lg leading-relaxed text-[#172033]/65 transition-all delay-300 duration-700",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            A personalized daily stack of hackathons, scholarships, mentors, and
            internships matched to your goals.
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
              Build my stack
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-[#172033] transition hover:bg-rose-50">
              See how it works
              <span className="grid h-7 w-7 place-items-center rounded-full border border-[#172033]/20">
                <Play className="h-3.5 w-3.5 fill-[#172033]" aria-hidden="true" />
              </span>
            </button>
          </div>

          <div
            className={cn(
              "mt-12 flex items-center gap-4 transition-all delay-600 duration-700",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <div className="flex -space-x-2">
              {["A", "N", "S", "M"].map((initial, i) => (
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm",
                    [
                      "bg-rose-400",
                      "bg-rose-500",
                      "bg-rose-600",
                      "bg-rose-700",
                    ][i],
                  )}
                  key={initial}
                >
                  {initial}
                </span>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#172033]/55">
                Loved by learners like you
              </p>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[100dvh] items-center justify-center overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-rose-100" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/40 blur-3xl" />

          <FloatingMockup />
        </div>
      </div>
    </section>
  );
}

function FloatingMockup() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startTime = performance.now();

    function animate(time: number) {
      const elapsed = (time - startTime) / 1000;
      const y = Math.sin(elapsed * 0.6) * 12;
      const rotate = Math.sin(elapsed * 0.4) * 1.5;
      if (el) {
        el.style.transform = `translateY(${y}px) rotate(${rotate}deg)`;
      }
      requestAnimationFrame(animate);
    }

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className="relative z-10 w-[340px]">
      <div className="rounded-[2.65rem] bg-[#111827] p-2.5 shadow-[0_25px_70px_rgba(23,32,51,0.32)]">
        <div className="relative overflow-hidden rounded-[2.05rem] bg-white">
          <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-[#111827]" />
          <div className="flex items-center justify-between px-5 pb-3 pt-9">
            <div>
              <p className="text-xs font-black text-[#172033]">Good morning, Alex</p>
              <p className="text-[11px] font-semibold text-[#172033]/55">
                Here is your stack for today
              </p>
            </div>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f3f6fb]">
              <span className="h-4 w-4 rounded-full bg-rose-300" />
            </span>
          </div>
          <div className="space-y-3 px-4 pb-4">
            <MockCard type="Hackathon" title="Build for Good Hack" />
            <MockCard type="Scholarship" title="Women in Tech Fund" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockCard({
  type,
  title,
}: {
  type: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-[#172033]/8 bg-white p-3 shadow-[0_10px_24px_rgba(40,56,90,0.10)]">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <span className="rounded-md bg-rose-500 px-2 py-1 text-[10px] font-black text-white">
            {type}
          </span>
          <h3 className="mt-2 text-sm font-black leading-tight text-[#172033]">
            {title}
          </h3>
          <p className="mt-1 text-[11px] font-bold text-[#172033]/55">
            Online · Free
          </p>
        </div>
        <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-rose-300 via-rose-200 to-rose-400" />
      </div>
    </div>
  );
}
