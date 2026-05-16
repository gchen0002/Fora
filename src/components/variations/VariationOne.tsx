/**
 * Variation 1 — "Ethereal Orb"
 * Deep OLED black with a single massive glowing orb hero.
 * Phone mockup floating in the center of the orb with parallax float.
 * Staggered text entry from left, framer-motion spring physics.
 */
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...spring, duration: 0.9 },
  },
};

export function VariationOne() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#050505] font-sans text-white selection:bg-emerald-400/30">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[700px] w-[700px] rounded-full bg-emerald-600/10 blur-[140px]" />
      </div>
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-emerald-900/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-900/10 blur-[120px]" />

      <Nav />

      <main className="relative flex min-h-[100dvh] items-center px-6 pt-20 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8">
            <LeftContent />
            <OrbVisual />
          </div>
        </div>
      </main>

      <VariationNav current={1} />
    </div>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      className="absolute left-0 right-0 top-0 z-50 flex h-20 items-center justify-between px-6 lg:px-12"
    >
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Sparkles className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white/90">fora</span>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-medium text-zinc-500">
        <a href="#" className="hidden transition-colors hover:text-white sm:block">Discover</a>
        <a href="#" className="hidden transition-colors hover:text-white sm:block">About</a>
        <button className="rounded-full bg-white/5 px-5 py-2.5 text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white border border-white/5">
          Sign In
        </button>
      </div>
    </motion.header>
  );
}

function LeftContent() {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-start pt-10 lg:pt-0"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 border border-emerald-500/15">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Daily Opportunity Stack
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="mt-8 text-[3.2rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[4.2rem] lg:text-[5rem]"
      >
        Discover what's <br />
        <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
          built for you.
        </span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="mt-6 max-w-[440px] text-lg font-normal leading-relaxed text-zinc-400"
      >
        Hackathons, scholarships, and internships matched to your skills — delivered in five minutes, every day.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4">
        <button className="group relative flex h-13 items-center gap-3 rounded-full bg-emerald-500 pl-7 pr-2 text-[15px] font-semibold text-black transition-all hover:bg-emerald-400 active:scale-[0.98]">
          Build your stack
          <span className="grid h-9 w-9 place-items-center rounded-full bg-black/15 transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
        <button className="h-13 rounded-full px-6 text-[15px] font-medium text-zinc-400 transition-colors hover:text-white">
          Learn more
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-14 flex items-center gap-5">
        <div className="flex -space-x-2.5">
          {["bg-emerald-400", "bg-cyan-400", "bg-teal-400", "bg-emerald-300"].map((bg, i) => (
            <div key={i} className={cn("h-8 w-8 rounded-full border-2 border-[#050505]", bg)} />
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-300">4,200+ students</p>
          <p className="text-xs text-zinc-500">joined this month</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrbVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = performance.now();

    function animate(t: number) {
      const s = (t - start) / 1000;
      const y = Math.sin(s * 0.5) * 16;
      const r = Math.sin(s * 0.35) * 2;
      if (el) el.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      requestAnimationFrame(animate);
    }

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
      className="relative flex w-full items-center justify-center"
    >
      {/* Glowing orb backdrop */}
      <div className="relative flex aspect-square w-full max-w-[480px] items-center justify-center rounded-full">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-900/30 via-[#0a1a14] to-cyan-900/20 shadow-[0_0_120px_rgba(16,185,129,0.15)]" />
        <div className="absolute inset-8 rounded-full bg-gradient-to-t from-emerald-950/60 to-transparent" />

        {/* Phone mockup */}
        <div ref={ref} className="relative z-10 h-[480px] w-[240px]">
          <div className="h-full w-full rounded-[2.2rem] border-[5px] border-zinc-800 bg-zinc-950 shadow-2xl shadow-emerald-900/20 overflow-hidden">
            {/* Notch */}
            <div className="absolute left-1/2 top-2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />

            {/* Screen */}
            <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#0d1f17] to-[#071510] pt-8">
              <div className="px-4 pt-2">
                <p className="text-[9px] font-semibold text-emerald-400/80">Good morning, Alex</p>
                <p className="text-[8px] text-zinc-500 mt-0.5">Your daily stack is ready</p>
              </div>

              <div className="mt-4 space-y-2 px-3">
                <PhoneCard label="Hackathon" title="VenusHacks 2026" match="98%" accent="emerald" />
                <PhoneCard label="Scholarship" title="Women in Tech Fund" match="92%" accent="cyan" />
                <PhoneCard label="Internship" title="Frontend @ Stripe" match="87%" accent="teal" />
              </div>

              {/* Bottom bar */}
              <div className="mt-auto p-3">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/15 p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    <p className="text-[9px] font-semibold text-emerald-300">3 new matches today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 top-24 z-20 rounded-2xl bg-zinc-900/90 border border-zinc-700/50 p-3 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 grid place-items-center">
              <Sparkles className="h-3 w-3 text-emerald-400" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-white">98% Match</p>
              <p className="text-[8px] text-zinc-500">VenusHacks</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-6 bottom-32 z-20 rounded-2xl bg-zinc-900/90 border border-zinc-700/50 p-3 shadow-xl backdrop-blur-sm"
        >
          <p className="text-[9px] font-bold text-emerald-400">+47 saved this week</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PhoneCard({ label, title, match, accent }: { label: string; title: string; match: string; accent: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    teal: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  };
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5">
      <div className="flex items-center justify-between">
        <div>
          <span className={cn("inline-block rounded-md px-1.5 py-0.5 text-[7px] font-bold border", colors[accent])}>
            {label}
          </span>
          <p className="mt-1 text-[10px] font-semibold text-white">{title}</p>
        </div>
        <span className="text-[9px] font-bold text-emerald-400">{match}</span>
      </div>
    </div>
  );
}

function VariationNav({ current }: { current: number }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full bg-zinc-900/90 border border-zinc-700/40 px-4 py-2.5 backdrop-blur-xl shadow-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <a
            key={n}
            href={`/${n}`}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-all",
              n === current
                ? "bg-emerald-500 text-black"
                : "text-zinc-500 hover:text-white hover:bg-white/10"
            )}
          >
            {n}
          </a>
        ))}
      </div>
    </div>
  );
}
