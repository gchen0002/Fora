/**
 * Variation 3 — "Neon Pulse"
 * Centered hero with animated gradient mesh background (canvas).
 * Giant kinetic headline with word-by-word stagger.
 * Deep rose / fuchsia accent. Particle-like floating dots.
 */
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ease = [0.32, 0.72, 0, 1] as const;

export function VariationThree() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#08060a] font-sans text-white selection:bg-fuchsia-400/30">
      <MeshCanvas />
      <FloatingDots />

      <Nav />

      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <HeroContent />
      </main>

      <VariationNav current={3} />
    </div>
  );
}

function MeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let id: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { x: 0.3, y: 0.3, r: 0.35, dx: 0.0003, dy: 0.0002, color: "168, 85, 247" },  // purple
      { x: 0.7, y: 0.6, r: 0.3, dx: -0.00025, dy: 0.00035, color: "236, 72, 153" }, // pink
      { x: 0.5, y: 0.8, r: 0.25, dx: 0.0002, dy: -0.0003, color: "217, 70, 239" },  // fuchsia
      { x: 0.2, y: 0.7, r: 0.2, dx: -0.00015, dy: -0.0002, color: "147, 51, 234" }, // violet
    ];

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((b) => {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < 0 || b.x > 1) b.dx *= -1;
        if (b.y < 0 || b.y > 1) b.dy *= -1;

        const gradient = ctx.createRadialGradient(
          canvas.width * b.x, canvas.height * b.y, 0,
          canvas.width * b.x, canvas.height * b.y, canvas.width * b.r
        );
        gradient.addColorStop(0, `rgba(${b.color}, 0.12)`);
        gradient.addColorStop(0.5, `rgba(${b.color}, 0.05)`);
        gradient.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      id = requestAnimationFrame(draw);
    }

    id = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function FloatingDots() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-fuchsia-400"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [dot.opacity, dot.opacity * 1.5, dot.opacity],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="absolute left-0 right-0 top-0 z-50 flex h-20 items-center justify-between px-6 lg:px-12"
    >
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
          <Sparkles className="h-4 w-4 text-fuchsia-400" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white/90">fora</span>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-medium text-zinc-500">
        <a href="#" className="hidden transition-colors hover:text-white sm:block">Explore</a>
        <button className="rounded-full bg-fuchsia-500/10 px-5 py-2.5 text-fuchsia-200 border border-fuchsia-500/15 backdrop-blur-sm transition-all hover:bg-fuchsia-500/20">
          Join Free
        </button>
      </div>
    </motion.header>
  );
}

function HeroContent() {
  const words = [
    { text: "Opportunities", color: "text-white" },
    { text: "that", color: "text-zinc-400" },
    { text: "find", color: "text-white" },
    { text: "you.", color: "text-fuchsia-400" },
  ];

  return (
    <div className="max-w-[1000px]">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-300 border border-fuchsia-500/15 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
          </span>
          Built for underrepresented tech learners
        </span>
      </motion.div>

      {/* Giant headline */}
      <h1 className="mt-10">
        {words.map((word, i) => (
          <motion.span
            key={word.text}
            initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease, delay: 0.3 + i * 0.12 }}
            className={cn(
              "inline-block text-[clamp(3rem,12vw,8rem)] font-bold leading-[0.95] tracking-tight mr-[0.15em]",
              word.color
            )}
          >
            {word.text}
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.9 }}
        className="mx-auto mt-8 max-w-[560px] text-lg leading-relaxed text-zinc-500"
      >
        A personalized daily stack of hackathons, scholarships, mentors, and internships — delivered in just five minutes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 1.1 }}
        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <button className="group flex h-14 items-center gap-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 pl-8 pr-3 text-base font-semibold text-white shadow-[0_0_40px_rgba(217,70,239,0.3)] transition-all hover:shadow-[0_0_60px_rgba(217,70,239,0.4)] active:scale-[0.98]">
          Create your profile
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
        <button className="h-14 rounded-full px-7 text-base font-medium text-zinc-400 transition-colors hover:text-white">
          Watch demo
        </button>
      </motion.div>

      {/* Floating card preview */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease, delay: 1.4 }}
        className="mx-auto mt-16 max-w-md"
      >
        <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.03] p-1 backdrop-blur-sm">
          <div className="rounded-[1.25rem] bg-zinc-950/70 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Today's Stack</p>
              <span className="rounded-full bg-fuchsia-500/15 border border-fuchsia-500/20 px-2.5 py-1 text-[10px] font-bold text-fuchsia-300">
                4 new
              </span>
            </div>
            <div className="space-y-2">
              {[
                { t: "VenusHacks 2026", c: "Hackathon", m: "98%" },
                { t: "Women in Tech Fund", c: "Scholarship", m: "92%" },
                { t: "Frontend @ Linear", c: "Internship", m: "87%" },
              ].map((item) => (
                <div key={item.t} className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                  <div>
                    <p className="text-[10px] font-bold text-fuchsia-400">{item.c}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{item.t}</p>
                  </div>
                  <span className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-bold text-fuchsia-300">{item.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
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
                ? "bg-fuchsia-500 text-white"
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
