/**
 * Variation 2 — "Cinematic Split"
 * Left-aligned bold kinetic type + right-side animated bento cards.
 * Warm amber/gold accent on deep charcoal.
 * Text-scramble reveal on headline, staggered bento entry.
 */
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Globe, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const ease = [0.32, 0.72, 0, 1] as const;

export function VariationTwo() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0c0c0c] font-sans text-white selection:bg-amber-400/30">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(251,191,36,0.06)_0%,_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(251,191,36,0.04)_0%,_transparent_50%)]" />

      <Nav />

      <main className="relative flex min-h-[100dvh] items-center px-6 pt-20 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <LeftContent />
            </div>
            <div className="lg:col-span-7">
              <BentoGrid />
            </div>
          </div>
        </div>
      </main>

      <VariationNav current={2} />
    </div>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="absolute left-0 right-0 top-0 z-50 flex h-20 items-center justify-between px-6 lg:px-16"
    >
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Zap className="h-4 w-4 text-amber-400" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white/90">fora</span>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-medium text-zinc-500">
        <a href="#" className="hidden transition-colors hover:text-white sm:block">Features</a>
        <a href="#" className="hidden transition-colors hover:text-white sm:block">Community</a>
        <button className="rounded-full bg-amber-500/10 px-5 py-2.5 text-amber-200 border border-amber-500/15 backdrop-blur-sm transition-all hover:bg-amber-500/20 hover:text-amber-100">
          Get Started
        </button>
      </div>
    </motion.header>
  );
}

function LeftContent() {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-start"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/8 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 border border-amber-500/12">
          For underrepresented learners
        </span>
      </motion.div>

      <motion.h1
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.9, ease }}
        className="mt-8 text-[3rem] font-bold leading-[1.08] tracking-tight text-white sm:text-[3.8rem] lg:text-[4.5rem]"
      >
        Your daily <br />
        tech stack. <br />
        <TextScramble text="Curated." />
      </motion.h1>

      <motion.p
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-6 max-w-[380px] text-base leading-relaxed text-zinc-500"
      >
        Five minutes a day to find hackathons, scholarships, and internships that actually match your path.
      </motion.p>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-10"
      >
        <button className="group flex h-13 items-center gap-3 rounded-full bg-amber-400 pl-7 pr-2 text-[15px] font-semibold text-black transition-all hover:bg-amber-300 active:scale-[0.98]">
          Build my stack
          <span className="grid h-9 w-9 place-items-center rounded-full bg-black/10 transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-14 flex gap-10"
      >
        {[
          { v: "12K+", l: "Opportunities" },
          { v: "94%", l: "Match rate" },
          { v: "5 min", l: "Per day" },
        ].map((s) => (
          <div key={s.l}>
            <p className="text-xl font-bold text-amber-300">{s.v}</p>
            <p className="text-[11px] font-medium text-zinc-600">{s.l}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function TextScramble({ text }: { text: string }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const [display, setDisplay] = useState(text.replace(/./g, " "));
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    const totalFrames = text.length * 4;
    let id: number;

    function step() {
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * text.length);

      const result = text
        .split("")
        .map((ch, i) => {
          if (i < revealed) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplay(result);
      frame++;

      if (frame <= totalFrames) {
        id = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        setDone(true);
      }
    }

    const timeout = setTimeout(() => {
      id = requestAnimationFrame(step);
    }, 1200);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(id);
    };
  }, [text]);

  return (
    <span className={cn(
      "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent transition-opacity",
      done ? "opacity-100" : "opacity-90"
    )}>
      {display}
    </span>
  );
}

function BentoGrid() {
  const cards = [
    { span: "lg:col-span-2 lg:row-span-2", delay: 0.5, content: <BentoPhone /> },
    { span: "lg:col-span-1", delay: 0.65, content: <BentoStat value="98%" label="Match Score" icon={<Star className="h-4 w-4 text-amber-400" />} /> },
    { span: "lg:col-span-1", delay: 0.8, content: <BentoStat value="5min" label="Daily Review" icon={<Calendar className="h-4 w-4 text-amber-400" />} /> },
    { span: "lg:col-span-2", delay: 0.95, content: <BentoMarquee /> },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:grid-rows-3">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: card.delay }}
          className={cn(
            "relative overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-1",
            card.span
          )}
        >
          <div className="h-full rounded-[1.25rem] bg-zinc-950/80 p-5">
            {card.content}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BentoPhone() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-[200px] rounded-[1.8rem] border-[4px] border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        {/* Notch */}
        <div className="relative">
          <div className="absolute left-1/2 top-1.5 z-10 h-3 w-12 -translate-x-1/2 rounded-full bg-black" />
        </div>
        <div className="flex flex-col bg-gradient-to-b from-[#1a1206] to-[#0f0d08] pb-4 pt-7">
          <div className="px-3">
            <p className="text-[8px] font-semibold text-amber-400/70">Today's Stack</p>
            <div className="mt-2 space-y-1.5">
              {[
                { t: "VenusHacks", c: "Hackathon", m: "98%" },
                { t: "Tech Fund", c: "Scholarship", m: "94%" },
                { t: "Figma Intern", c: "Internship", m: "89%" },
              ].map((item) => (
                <div key={item.t} className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[7px] text-amber-400/60 font-bold">{item.c}</p>
                      <p className="text-[8px] font-semibold text-white mt-0.5">{item.t}</p>
                    </div>
                    <span className="text-[7px] font-bold text-amber-300">{item.m}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoStat({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/15">
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function BentoMarquee() {
  const items = ["Hackathons", "Scholarships", "Internships", "Mentorship", "Hackathons", "Scholarships", "Internships", "Mentorship"];
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-3">Categories</p>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-4 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {items.map((item, i) => (
            <span
              key={i}
              className="shrink-0 rounded-full bg-amber-500/8 border border-amber-500/12 px-4 py-2 text-xs font-semibold text-amber-300/80"
            >
              {item}
            </span>
          ))}
        </motion.div>
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
                ? "bg-amber-400 text-black"
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
