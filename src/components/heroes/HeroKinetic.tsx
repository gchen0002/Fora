import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const headlineWords = [
  { text: "Five", delay: 0 },
  { text: "minutes.", delay: 300 },
  { text: "Your", delay: 600 },
  { text: "move.", delay: 900 },
];

export function HeroKinetic() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#fcfbf7] px-6">
      <div className="mx-auto max-w-[1200px] text-center">
        <div
          className={cn(
            "transition-all duration-700",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <span className="inline-block rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1.5 text-xs font-bold tracking-wide text-rose-600 backdrop-blur-sm">
            FORA
          </span>
        </div>

        <h1 className="relative mt-6">
          {headlineWords.map((word, i) => (
            <span
              key={word.text}
              className={cn(
                "inline-block text-[clamp(3.5rem,15vw,10rem)] font-black leading-[0.88] tracking-tighter text-[#172033] transition-all duration-700",
                mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0",
              )}
              style={{
                transitionDelay: `${word.delay}ms`,
                marginRight: i < headlineWords.length - 1 ? "0.15em" : "0",
              }}
            >
              {i === 1 ? (
                <span className="text-rose-500">{word.text}</span>
              ) : (
                word.text
              )}
            </span>
          ))}
        </h1>

        <p
          className={cn(
            "mx-auto mt-8 max-w-[520px] text-lg leading-relaxed text-[#172033]/60 transition-all delay-[1200ms] duration-700",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          Hackathons, scholarships, mentors, and internships matched to your
          goals — delivered daily.
        </p>

        <div
          className={cn(
            "mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row transition-all delay-[1400ms] duration-700",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <Button
            size="lg"
            className="bg-rose-500 shadow-[0_14px_30px_rgba(244,63,94,0.28)] hover:bg-rose-600"
          >
            Build my stack
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="lg">
            See opportunities
          </Button>
        </div>

        <div
          className={cn(
            "mt-12 flex items-center justify-center gap-8 transition-all delay-[1600ms] duration-700",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          {[
            { value: "12K+", label: "Opportunities" },
            { value: "4K+", label: "Students" },
            { value: "94%", label: "Match rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-[#172033]">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-[#172033]/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AnimatedLine />
    </section>
  );
}

function AnimatedLine() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = performance.now();

    function animate(time: number) {
      const elapsed = (time - startTime) / 1000;
      setProgress(((elapsed * 15) % 100));
      requestAnimationFrame(animate);
    }

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-100">
      <div
        className="h-full bg-rose-500 transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
