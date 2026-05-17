/**
 * Variation 5 — "Google Clean"
 * Pure white background, Google.com aesthetic.
 * Google brand colors (Blue #4285F4, Red #EA4335, Yellow #FBBC05, Green #34A853)
 * used as tasteful accents on a bright, minimal canvas.
 * Apple/Mac-style frosted Sign In button.
 */
import { motion } from "framer-motion";
import { SignInButton, useAuth, UserButton } from "@clerk/react";
import { ArrowRight, Megaphone, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const G = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
} as const;

const ease = [0.32, 0.72, 0, 1] as const;

export function VariationFive() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-white font-sans text-[#202124] selection:bg-[#4285F4]/20">
      <Nav />

      <main className="relative flex min-h-[100dvh] items-center px-6 pt-20 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <LeftCopy />
            <RightVisual />
          </div>
        </div>
      </main>
    </div>
  );
}

function Nav() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="absolute left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[#e8eaed] bg-white/80 px-6 backdrop-blur-md lg:px-12"
    >
      <div className="flex items-center gap-2">
        {/* Google-style 4-dot logo */}
        <div className="flex items-center gap-[3px]">
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.blue }} />
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.red }} />
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.yellow }} />
          <div className="h-[10px] w-[10px] rounded-full" style={{ background: G.green }} />
        </div>
        <span className="text-lg font-medium tracking-tight text-[#202124]">fora</span>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-normal text-[#5f6368]">
        <span className="hidden sm:block">
          <Clock />
        </span>
        <a href="#" className="hidden transition-colors hover:text-[#202124] sm:block">
          Discover Events
        </a>
        {!isLoaded ? (
          <button
            className="rounded px-6 py-2 text-sm font-medium text-white opacity-70"
            disabled
            style={{ background: G.blue }}
            type="button"
          >
            Loading
          </button>
        ) : isSignedIn ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/feed")}
              className="rounded px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.98]"
              style={{ background: G.blue }}
            >
              Open feed
            </button>
            <UserButton />
          </div>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/feed">
            <button
              className="rounded px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.98]"
              style={{ background: G.blue }}
            >
              Sign in
            </button>
          </SignInButton>
        )}
      </div>
    </motion.header>
  );
}

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        })
      );
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return <span>{time}</span>;
}

function LeftCopy() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <motion.div
      className="relative z-10 flex flex-col items-start pt-10 lg:pt-0"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: 0.9, ease }}
        className="flex items-center gap-2 text-sm font-medium text-[#5f6368]"
      >
        <div className="flex items-center gap-[3px]">
          <div className="h-[6px] w-[6px] rounded-full" style={{ background: G.blue }} />
          <div className="h-[6px] w-[6px] rounded-full" style={{ background: G.red }} />
          <div className="h-[6px] w-[6px] rounded-full" style={{ background: G.yellow }} />
          <div className="h-[6px] w-[6px] rounded-full" style={{ background: G.green }} />
        </div>
        fora
      </motion.div>

      <motion.h1
        variants={{
          hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: 1, ease }}
        className="mt-6 text-[3.2rem] font-normal leading-[1.12] tracking-tight text-[#202124] sm:text-[4rem] lg:text-[5rem]"
      >
        Delightful <br />
        events <br />
        <span className="font-normal">
          <span style={{ color: G.blue }}>s</span>
          <span style={{ color: G.red }}>t</span>
          <span style={{ color: G.yellow }}>a</span>
          <span style={{ color: G.blue }}>r</span>
          <span style={{ color: G.green }}>t</span>
          <span style={{ color: G.red }}> </span>
          <span style={{ color: G.red }}>h</span>
          <span style={{ color: G.yellow }}>e</span>
          <span style={{ color: G.green }}>r</span>
          <span style={{ color: G.blue }}>e</span>
          <span style={{ color: G.red }}>.</span>
        </span>
      </motion.h1>

      <motion.p
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-6 max-w-[420px] text-base leading-relaxed text-[#5f6368] sm:text-lg"
      >
        Set up an event page, invite friends and sell tickets. Host a memorable event today.
      </motion.p>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className="mt-8 flex items-center gap-3"
      >
        {!isLoaded ? (
          <button
            className="flex h-11 items-center gap-2 rounded px-6 text-[14px] font-medium text-white opacity-70"
            disabled
            style={{ background: G.blue, boxShadow: `0 1px 3px ${G.blue}40` }}
            type="button"
          >
            Loading
          </button>
        ) : isSignedIn ? (
          <button
            onClick={() => navigate("/feed")}
            className="flex h-11 items-center gap-2 rounded px-6 text-[14px] font-medium text-white transition-all hover:shadow-lg active:scale-[0.98]"
            style={{ background: G.blue, boxShadow: `0 1px 3px ${G.blue}40` }}
          >
            Open your feed
          </button>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/feed">
            <button
              className="flex h-11 items-center gap-2 rounded px-6 text-[14px] font-medium text-white transition-all hover:shadow-lg active:scale-[0.98]"
              style={{ background: G.blue, boxShadow: `0 1px 3px ${G.blue}40` }}
            >
              Create Your First Event
            </button>
          </SignInButton>
        )}
        <button className="flex h-11 items-center gap-2 rounded border border-[#dadce0] px-6 text-[14px] font-medium text-[#1a73e8] transition-all hover:bg-[#f8f9fa] active:scale-[0.98]">
          Learn more
        </button>
      </motion.div>
    </motion.div>
  );
}

function RightVisual() {
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return;
    let start = performance.now();

    function animate(t: number) {
      const s = (t - start) / 1000;
      const y = Math.sin(s * 0.5) * 14;
      const r = Math.sin(s * 0.35) * 2;
      if (el) el.style.transform = `translateY(${y}px) rotate(${-2 + r}deg)`;
      requestAnimationFrame(animate);
    }

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease, delay: 0.5 }}
      className="relative flex w-full items-center justify-center"
    >
      {/* Soft circular backdrop */}
      <div className="relative flex aspect-square w-full max-w-[500px] items-center justify-center rounded-full bg-[#f8f9fa] shadow-[0_0_0_1px_#e8eaed]">
        {/* Subtle colored radials */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute -left-10 -top-10 h-[250px] w-[250px] rounded-full blur-[80px] opacity-[0.15]"
            style={{ background: G.blue }}
          />
          <div
            className="absolute -right-10 top-10 h-[200px] w-[200px] rounded-full blur-[70px] opacity-[0.12]"
            style={{ background: G.red }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-[200px] w-[200px] rounded-full blur-[70px] opacity-[0.12]"
            style={{ background: G.green }}
          />
        </div>

        {/* Phone Mockup */}
        <div ref={phoneRef} className="relative z-10 h-[520px] w-[260px]">
          <div className="h-full w-full rounded-[2.5rem] border border-[#dadce0] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Notch */}
            <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-[#202124]" />

            {/* Phone Screen */}
            <div className="flex h-full w-full flex-col bg-white pt-10">
              {/* Header image */}
              <div className="px-3">
                <div
                  className="flex aspect-video w-full flex-col items-center justify-center rounded-xl overflow-hidden relative"
                  style={{ background: `linear-gradient(135deg, ${G.blue}, ${G.red}cc)` }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                  />
                  <h2 className="relative z-10 text-3xl font-black italic tracking-tighter text-white drop-shadow-sm">
                    DJ SET
                  </h2>
                  <p className="relative z-10 text-[8px] font-bold uppercase tracking-widest text-white/80">
                    Y2K Party Y2K Party
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="mt-3 flex flex-1 flex-col rounded-t-2xl border-t border-[#e8eaed] bg-white p-4">
                <h3 className="text-base font-medium text-[#202124]">DJ Set at Club Fugazi</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#5f6368]">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ background: G.blue }} />
                  Hosted by Club Fugazi
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex gap-3">
                    <div
                      className="flex flex-col items-center justify-center rounded-lg px-2.5 py-1.5 text-center"
                      style={{ background: `${G.blue}10` }}
                    >
                      <span className="text-[8px] font-semibold uppercase" style={{ color: G.blue }}>
                        Jul
                      </span>
                      <span className="text-sm font-medium text-[#202124]">23</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#202124]">Sunday, July 23</p>
                      <p className="text-[10px] text-[#5f6368]">9:00 PM to 4:00 AM PDT</p>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="mt-auto mb-2 rounded-xl border border-[#e8eaed] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full border-2 border-white" style={{ background: G.blue }} />
                      <div className="h-6 w-6 rounded-full border-2 border-white" style={{ background: G.red }} />
                      <div className="h-6 w-6 rounded-full border-2 border-white" style={{ background: G.yellow }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#202124]">45 Guests</p>
                      <p className="text-[9px] text-[#5f6368]">Sam, Hugo & John</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom notification */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2, ease }}
                className="absolute bottom-4 left-3 right-3 rounded-xl border border-[#e8eaed] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full" style={{ background: `${G.green}15` }}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={G.green}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#202124]">You're In</p>
                    <p className="text-[9px] text-[#5f6368]">A confirmation email has been sent</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        {/* Calendar — Red */}
        <motion.div
          animate={{ y: [-6, 6, -6], rotate: [-12, -8, -12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-8 top-28 z-20 flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden border border-[#e8eaed]"
        >
          <div className="w-full py-1 text-center text-[8px] font-bold uppercase text-white" style={{ background: G.red }}>
            Jul
          </div>
          <div className="text-2xl font-medium text-[#202124]">23</div>
        </motion.div>

        {/* Megaphone — Blue */}
        <motion.div
          animate={{ y: [4, -8, 4], rotate: [12, 16, 12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-4 top-1/2 z-20 grid h-14 w-14 place-items-center rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-[#e8eaed]"
          style={{ background: G.blue }}
        >
          <Megaphone className="h-7 w-7 text-white" />
        </motion.div>

        {/* Speaker L — Yellow */}
        <motion.div
          animate={{ y: [3, -5, 3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-10 z-20 grid h-20 w-16 -rotate-12 place-items-center rounded-xl border border-[#e8eaed] shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
          style={{ background: G.yellow }}
        >
          <div className="h-8 w-8 rounded-full bg-white/30 shadow-inner flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white/50" />
          </div>
          <div className="absolute bottom-3 h-4 w-4 rounded-full bg-white/30 shadow-inner flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </div>
        </motion.div>

        {/* Speaker R — Green */}
        <motion.div
          animate={{ y: [-4, 6, -4] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 right-4 z-20 grid h-20 w-16 rotate-12 place-items-center rounded-xl border border-[#e8eaed] shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
          style={{ background: G.green }}
        >
          <div className="h-8 w-8 rounded-full bg-white/30 shadow-inner flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white/50" />
          </div>
          <div className="absolute bottom-3 h-4 w-4 rounded-full bg-white/30 shadow-inner flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </div>
        </motion.div>

        {/* Star — Yellow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-24 top-20 z-20"
        >
          <Sparkles className="h-8 w-8" style={{ color: G.yellow }} />
        </motion.div>

        {/* Sphere — Blue */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-12 bottom-1/3 z-20 h-10 w-10 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
          style={{ background: `linear-gradient(135deg, ${G.blue}90, ${G.blue})` }}
        />
      </div>
    </motion.div>
  );
}
