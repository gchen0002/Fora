import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Hackathons",
    gradient: "from-rose-400 via-pink-300 to-rose-200",
  },
  {
    title: "Scholarships",
    gradient: "from-rose-600 via-rose-400 to-pink-300",
  },
  {
    title: "Mentorship",
    gradient: "from-pink-400 via-rose-300 to-rose-200",
  },
  {
    title: "Internships",
    gradient: "from-rose-500 via-pink-400 to-rose-300",
  },
];

export function HeroMediaWall() {
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % slides.length);
      }, 2500);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

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
              CURATED FOR YOU
            </span>
          </div>

          <h1
            className={cn(
              "mt-6 max-w-[540px] text-balance text-5xl font-black leading-[0.95] tracking-tighter text-[#172033] transition-all delay-150 duration-700 sm:text-6xl lg:text-7xl",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            Opportunities that{" "}
            <span className="text-rose-500">actually fit.</span>
          </h1>

          <p
            className={cn(
              "mt-6 max-w-[480px] text-lg leading-relaxed text-[#172033]/65 transition-all delay-300 duration-700",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            Stop hunting. Your daily stack of relevant opportunities — from
            hackathons to internships — delivered in one place.
          </p>

          <div
            className={cn(
              "mt-10 transition-all delay-450 duration-700",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <Button
              size="lg"
              className="bg-rose-500 shadow-[0_14px_30px_rgba(244,63,94,0.28)] hover:bg-rose-600"
            >
              Get started free
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          <div
            className={cn(
              "mt-12 flex items-center gap-6 transition-all delay-600 duration-700",
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-gradient-to-br"
                  style={{
                    backgroundImage: `conic-gradient(from ${i * 90}deg, #f43f5e, #fb7185, #fda4af, #fecdd3)`,
                  }}
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-[#172033]">4K+ students</p>
              <p className="text-xs font-semibold text-[#172033]/55">
                joined this week
              </p>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[100dvh] flex-col items-center justify-center overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[#f1f0ee]" />

          <div className="relative z-10 h-full w-full">
            <div className="flex h-full flex-col items-center justify-center px-12">
              <div className="relative w-full max-w-[420px] overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                <div
                  className={cn(
                    "h-[520px] w-full transition-all duration-700",
                    slides[slideIndex].gradient,
                  )}
                >
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/70">
                      Featured
                    </p>
                    <h3 className="mt-4 text-3xl font-black tracking-tight">
                      {slides[slideIndex].title}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
                      Discover opportunities tailored to your goals and
                      interests.
                    </p>
                    <button className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10">
                      View opportunities
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setPlaying(!playing)}
                  className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#172033] shadow-lg backdrop-blur-sm transition hover:bg-white"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>

                <div className="absolute bottom-4 left-4 flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === slideIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/40",
                      )}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
