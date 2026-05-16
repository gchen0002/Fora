import { Calendar, ChevronRight, Megaphone, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function LumaDark() {
  return (
    <div className="min-h-screen bg-[#131313] font-sans text-white selection:bg-[#ff4f4f]/30">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#3b2d4a] opacity-20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#4a2d3b] opacity-20 blur-[120px]" />

      <Navbar />
      
      <main className="relative flex min-h-screen items-center overflow-hidden px-6 pt-16 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <LeftCopy />
            <RightVisual />
          </div>
        </div>
      </main>
    </div>
  );
}

function Navbar() {
  return (
    <header className="absolute left-0 right-0 top-0 z-50 flex h-20 items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-1 text-[#666666]">
        <Sparkles className="h-5 w-5" />
      </div>
      
      <div className="flex items-center gap-6 text-[13px] font-medium text-[#a1a1aa]">
        <span className="hidden sm:block">3:41 PM PDT</span>
        <a href="#" className="hidden hover:text-white transition-colors sm:block">Discover Events</a>
        <button className="rounded-full bg-white/5 px-4 py-2 text-[#e4e4e7] backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white">
          Sign In
        </button>
      </div>
    </header>
  );
}

function LeftCopy() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative z-10 flex flex-col items-start pt-10 lg:pt-0">
      <div
        className={cn(
          "flex items-center gap-1 text-2xl font-bold tracking-tight text-[#e4e4e7] transition-all duration-1000",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        luma<Sparkles className="h-4 w-4 text-[#a1a1aa]" />
      </div>

      <h1
        className={cn(
          "mt-6 text-[3.5rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[4.5rem] lg:text-[5.5rem] transition-all delay-150 duration-1000",
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        Delightful <br />
        events <br />
        <span className="bg-gradient-to-r from-[#4f46e5] via-[#d946ef] to-[#f97316] bg-clip-text text-transparent">
          start here.
        </span>
      </h1>

      <p
        className={cn(
          "mt-6 max-w-[420px] text-lg font-normal leading-relaxed text-[#a1a1aa] sm:text-[19px] transition-all delay-300 duration-1000",
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        Set up an event page, invite friends and sell tickets. Host a memorable event today.
      </p>

      <div
        className={cn(
          "mt-10 transition-all delay-500 duration-1000",
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <button className="h-12 rounded-xl bg-white px-6 text-[15px] font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-gray-100 active:scale-[0.98]">
          Create Your First Event
        </button>
      </div>
    </div>
  );
}

function RightVisual() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center transition-all delay-700 duration-1000",
        mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
      )}
    >
      {/* The large circular cutout */}
      <div className="relative flex aspect-square w-full max-w-[500px] items-center justify-center rounded-full bg-[#1c1326] shadow-2xl">
        {/* Crowd background image inside the circle */}
        <div className="absolute inset-0 overflow-hidden rounded-full opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1470229722913-7c090be5ba44?q=80&w=1000&auto=format&fit=crop" 
            alt="Concert Crowd" 
            className="h-full w-full object-cover mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* The Phone Mockup */}
        <div className="relative z-10 h-[520px] w-[260px] rounded-[2.5rem] border-[6px] border-[#2a2a2a] bg-black shadow-2xl overflow-hidden shadow-purple-900/20 transform rotate-[-2deg]">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
          
          {/* Phone Screen Content */}
          <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#2a1338] to-[#9c36b5] pt-10">
            {/* Header image area */}
            <div className="px-3">
              <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 shadow-inner">
                <h2 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-md">DJ SET</h2>
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/80">Y2K Party Y2K Party</p>
              </div>
            </div>

            {/* Event Details */}
            <div className="mt-4 flex flex-1 flex-col rounded-t-3xl bg-[#1d1d1f] p-4">
              <h3 className="text-lg font-bold text-white">DJ Set at Club Fugazi</h3>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-[#a1a1aa]">
                <span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span>
                Hosted by Club Fugazi
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-white/5 px-2 py-1 text-center">
                    <span className="text-[8px] font-semibold uppercase text-purple-400">Jul</span>
                    <span className="text-sm font-bold text-white">23</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Sunday, July 23</p>
                    <p className="text-[10px] text-[#a1a1aa]">9:00 PM to 4:00 AM PDT</p>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="mt-auto mb-2 rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-purple-400 border border-[#1d1d1f]" />
                    <div className="h-6 w-6 rounded-full bg-pink-400 border border-[#1d1d1f]" />
                    <div className="h-6 w-6 rounded-full bg-orange-400 border border-[#1d1d1f]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white">45 Guests</p>
                    <p className="text-[9px] text-[#a1a1aa]">Sam, Hugo & John</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom floating notification */}
            <div className="absolute bottom-4 left-3 right-3 rounded-xl bg-white/20 p-3 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-pink-300" />
                <div>
                  <p className="text-xs font-bold text-white">You're In</p>
                  <p className="text-[9px] text-white/80 text-balance">A confirmation email has been sent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating "3D" Elements */}
        {/* Calendar */}
        <div className="absolute right-8 top-28 z-20 flex h-16 w-16 -rotate-12 flex-col items-center justify-center rounded-xl bg-white shadow-2xl shadow-purple-900/50">
          <div className="w-full rounded-t-lg bg-purple-600 py-1 text-center text-[8px] font-bold uppercase text-white">Jul</div>
          <div className="text-2xl font-black text-slate-800">23</div>
        </div>

        {/* Megaphone/Speaker */}
        <div className="absolute left-4 top-1/2 z-20 grid h-14 w-14 rotate-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-300 shadow-2xl shadow-cyan-900/50">
          <Megaphone className="h-7 w-7 text-white" />
        </div>

        {/* Pink Speaker */}
        <div className="absolute bottom-12 left-10 z-20 grid h-20 w-16 -rotate-12 place-items-center rounded-xl bg-gradient-to-br from-pink-400 to-orange-400 shadow-2xl shadow-pink-900/50 border border-white/20">
           <div className="h-8 w-8 rounded-full bg-black/40 shadow-inner flex items-center justify-center">
             <div className="h-3 w-3 rounded-full bg-black/80" />
           </div>
           <div className="absolute bottom-3 h-4 w-4 rounded-full bg-black/40 shadow-inner flex items-center justify-center">
             <div className="h-1.5 w-1.5 rounded-full bg-black/80" />
           </div>
        </div>

        {/* Pink Speaker 2 */}
        <div className="absolute bottom-16 right-4 z-20 grid h-20 w-16 rotate-12 place-items-center rounded-xl bg-gradient-to-br from-pink-300 to-purple-400 shadow-2xl shadow-purple-900/50 border border-white/20">
           <div className="h-8 w-8 rounded-full bg-black/40 shadow-inner flex items-center justify-center">
             <div className="h-3 w-3 rounded-full bg-black/80" />
           </div>
           <div className="absolute bottom-3 h-4 w-4 rounded-full bg-black/40 shadow-inner flex items-center justify-center">
             <div className="h-1.5 w-1.5 rounded-full bg-black/80" />
           </div>
        </div>

        {/* Star */}
        <div className="absolute left-24 top-20 z-20">
          <Sparkles className="h-8 w-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>
        
        {/* Floating Sphere */}
        <div className="absolute right-12 bottom-1/3 z-20 h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-600 shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)]" />
      </div>
    </div>
  );
}
