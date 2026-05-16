/**
 * Variation 4 — "Editorial Night"
 * Full-width asymmetric layout with massive serif-inspired display type.
 * Deep navy + electric blue accent. Stacked cards overlapping with depth.
 * Horizontal scrolling category pills.
 */
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Globe, MapPin, Sparkles, Star, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ease = [0.32, 0.72, 0, 1] as const;

export function VariationFour() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#070b14] font-sans text-white selection:bg-blue-400/30">
      {/* Ambient light */}
      <div className="pointer-events-none absolute right-0 top-0 h-[800px] w-[800px] translate-x-1/3 -translate-y-1/4 rounded-full bg-blue-600/8 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/4 rounded-full bg-indigo-600/6 blur-[120px]" />

      <Nav />

      <main className="relative flex min-h-[100dvh] items-center px-6 pt-20 lg:px-0">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-0">
            <div className="lg:col-span-7 lg:pl-16">
              <LeftContent />
            </div>
            <div className="lg:col-span-5 lg:pr-8">
              <CardStack />
            </div>
          </div>
        </div>
      </main>

      <VariationNav current={4} />
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
        <span className="text-xl font-bold tracking-tight text-white">fora</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/15">
          beta
        </span>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-medium text-zinc-500">
        <a href="#" className="hidden transition-colors hover:text-white sm:block">How it works</a>
        <a href="#" className="hidden transition-colors hover:text-white sm:block">For teams</a>
        <button className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]">
          Early Access
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
        variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.7, ease }}
      >
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-blue-400">
          For the ones who build
        </span>
      </motion.div>

      <motion.h1
        variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } }}
        transition={{ duration: 1, ease }}
        className="mt-6 text-[3.5rem] font-bold leading-[1] tracking-tight text-white sm:text-[4.5rem] lg:text-[6rem]"
        style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
      >
        Don't search. <br />
        <span className="text-blue-400">Discover.</span>
      </motion.h1>

      <motion.p
        variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-8 max-w-[480px] text-lg leading-relaxed text-zinc-500"
      >
        Fora delivers a personalized daily digest of hackathons, scholarships, and internships tailored to underrepresented tech learners.
      </motion.p>

      {/* Category pills with horizontal scroll */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-8 flex flex-wrap gap-2"
      >
        {["Hackathons", "Scholarships", "Internships", "Mentorship", "Bootcamps"].map((cat, i) => (
          <motion.span
            key={cat}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
            className="rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-2 text-xs font-medium text-zinc-400 transition-all hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/20 cursor-pointer"
          >
            {cat}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-10 flex items-center gap-4"
      >
        <button className="group flex h-14 items-center gap-3 rounded-full bg-blue-500 pl-8 pr-3 text-base font-semibold text-white shadow-[0_0_40px_rgba(59,130,246,0.25)] transition-all hover:bg-blue-400 hover:shadow-[0_0_50px_rgba(59,130,246,0.35)] active:scale-[0.98]">
          Build my stack
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </motion.div>

      {/* Trusted line */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: 0.7, ease, delay: 0.2 }}
        className="mt-12 flex items-center gap-3"
      >
        <div className="flex -space-x-2">
          {["bg-blue-400", "bg-indigo-400", "bg-sky-400", "bg-blue-300"].map((bg, i) => (
            <div key={i} className={cn("h-7 w-7 rounded-full border-2 border-[#070b14]", bg)} />
          ))}
        </div>
        <p className="text-xs text-zinc-600">
          <span className="font-semibold text-zinc-400">2,800+</span> students building their future
        </p>
      </motion.div>
    </motion.div>
  );
}

function CardStack() {
  const cards = [
    {
      type: "Hackathon",
      title: "VenusHacks 2026",
      location: "Irvine, CA",
      date: "Aug 24 — 25",
      match: "98%",
      icon: <Trophy className="h-5 w-5 text-blue-400" />,
      gradient: "from-blue-600/20 to-indigo-600/20",
    },
    {
      type: "Scholarship",
      title: "Women in Tech Fund",
      location: "Online",
      date: "Sep 10",
      match: "94%",
      icon: <Star className="h-5 w-5 text-blue-400" />,
      gradient: "from-indigo-600/20 to-purple-600/20",
    },
    {
      type: "Internship",
      title: "Frontend @ Vercel",
      location: "Remote",
      date: "Rolling",
      match: "89%",
      icon: <Globe className="h-5 w-5 text-blue-400" />,
      gradient: "from-sky-600/20 to-blue-600/20",
    },
  ];

  return (
    <div className="relative flex flex-col items-center lg:items-end">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 60, rotate: i % 2 === 0 ? -2 : 2 }}
          animate={{ opacity: 1, y: 0, rotate: i === 0 ? -1 : i === 2 ? 1 : 0 }}
          transition={{ duration: 0.8, ease, delay: 0.6 + i * 0.15 }}
          className={cn(
            "w-full max-w-[380px] rounded-[1.5rem] border border-white/[0.06] bg-gradient-to-br p-1 shadow-2xl",
            card.gradient,
            i > 0 && "-mt-6 relative z-" + (10 + i * 10)
          )}
          style={{ zIndex: 10 + i * 10 }}
        >
          <div className="rounded-[1.25rem] bg-[#0d1117]/90 p-5 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 border border-blue-500/15">
                  {card.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{card.type}</p>
                  <p className="text-base font-semibold text-white mt-0.5">{card.title}</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-500/15 border border-blue-500/20 px-2.5 py-1 text-[10px] font-bold text-blue-300">
                {card.match}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                {card.location.toLowerCase() === "online" || card.location.toLowerCase() === "remote" ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <MapPin className="h-3 w-3" />
                )}
                {card.location}
              </span>
              <span>{card.date}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-1.5">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="h-5 w-5 rounded-full border border-[#0d1117] bg-zinc-700" />
                ))}
                <div className="flex h-5 items-center rounded-full bg-zinc-800 pl-1.5 pr-2 text-[8px] font-bold text-zinc-400">
                  +47
                </div>
              </div>
              <button className="flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/15 px-3 py-1.5 text-[10px] font-semibold text-blue-300 transition hover:bg-blue-500/20">
                Apply <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Glow under cards */}
      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[60px]" />
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
                ? "bg-blue-500 text-white"
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
