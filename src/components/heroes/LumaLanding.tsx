import { ArrowRight, Calendar, Globe, MapPin, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LumaLanding() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-[#111111] selection:bg-[#ffb6b6] selection:text-[#111]">
      <LumaNav />
      <LumaHero />
      <LumaBento />
      <LumaCTA />
    </div>
  );
}

function LumaNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-black/[0.04] bg-[#faf9f8]/80 px-6 backdrop-blur-xl md:px-10">
      <div className="flex items-center gap-2">
        {/* Luma-style simple logo mark */}
        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#111] text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-lg font-bold tracking-tight">fora</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#111]/60">
        <a href="#discover" className="hover:text-[#111] transition-colors">Discover</a>
        <a href="#calendars" className="hover:text-[#111] transition-colors">Calendars</a>
        <a href="#about" className="hover:text-[#111] transition-colors">About</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden text-[15px] font-medium text-[#111]/70 hover:text-[#111] md:block">
          Sign In
        </button>
        <Button className="h-9 rounded-full bg-[#111] px-5 text-[14px] font-semibold text-white shadow-sm hover:bg-black hover:scale-105 transition-transform duration-200">
          Get Started
        </Button>
      </div>
    </nav>
  );
}

function LumaHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Luma signature pastel blur backgrounds */}
      <div className="absolute top-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-[#ffd8d8] opacity-40 blur-[100px] mix-blend-multiply" />
      <div className="absolute top-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-[#e0e7ff] opacity-50 blur-[100px] mix-blend-multiply" />
      <div className="absolute top-[30%] left-[40%] h-[400px] w-[400px] rounded-full bg-[#fcf0d8] opacity-50 blur-[80px] mix-blend-multiply" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-10">
        <div
          className={cn(
            "transition-all duration-1000",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#111]/60 backdrop-blur-md">
            <Star className="h-3.5 w-3.5" />
            Your Daily Stack
          </span>
        </div>

        <h1
          className={cn(
            "mt-8 text-5xl font-bold tracking-tight text-[#111] sm:text-6xl md:text-7xl lg:text-[5rem] lg:leading-[1.05] transition-all delay-150 duration-1000",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
        >
          Delightful tech <br className="hidden md:block" /> opportunities start here.
        </h1>

        <p
          className={cn(
            "mx-auto mt-8 max-w-xl text-lg md:text-xl font-medium text-[#111]/60 leading-relaxed transition-all delay-300 duration-1000",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          Discover hackathons, scholarships, and internships matched perfectly to your goals. Beautifully curated, every single day.
        </p>

        <div
          className={cn(
            "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all delay-500 duration-1000",
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <Button className="h-12 rounded-full bg-[#111] px-8 text-base font-semibold text-white shadow-lg shadow-black/10 transition-transform duration-200 hover:scale-105 hover:bg-black">
            Create your profile
          </Button>
        </div>
      </div>

      {/* Floating Tickets Section - very Luma.com */}
      <div 
        className={cn(
          "relative z-10 mx-auto mt-20 max-w-6xl px-6 transition-all delay-700 duration-1000",
          mounted ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        )}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <LumaTicket 
            image="bg-gradient-to-br from-[#ff9a9e] to-[#fecfef]"
            date="AUG 24"
            title="VenusHacks 2026"
            location="Irvine, CA"
            offset="md:translate-y-8"
          />
          <LumaTicket 
            image="bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb]"
            date="SEP 10"
            title="Women in Tech Fund"
            location="Online"
            offset="md:-translate-y-4"
          />
          <LumaTicket 
            image="bg-gradient-to-br from-[#d4fc79] to-[#96e6a1]"
            date="OCT 01"
            title="Frontend Internship"
            location="Remote"
            offset="md:translate-y-12"
          />
        </div>
      </div>
    </section>
  );
}

function LumaTicket({ image, date, title, location, offset }: { image: string, date: string, title: string, location: string, offset?: string }) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-[24px] border border-black/5 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]",
      offset
    )}>
      {/* Ticket Image Area */}
      <div className={cn("h-48 w-full rounded-[18px]", image)}>
        {/* Subtle glass overlay on image */}
        <div className="h-full w-full bg-white/10 backdrop-blur-[2px]" />
      </div>
      
      {/* Ticket Info Area */}
      <div className="p-5">
        <p className="text-xs font-bold tracking-widest text-[#ff4f4f] mb-2">{date}</p>
        <h3 className="text-xl font-bold tracking-tight text-[#111] mb-1">{title}</h3>
        <div className="flex items-center gap-1.5 text-[14px] font-medium text-[#111]/50">
          {location.toLowerCase() === 'online' || location.toLowerCase() === 'remote' ? (
            <Globe className="h-3.5 w-3.5" />
          ) : (
            <MapPin className="h-3.5 w-3.5" />
          )}
          {location}
        </div>
      </div>
    </div>
  );
}

function LumaBento() {
  return (
    <section className="relative z-20 bg-white py-24 md:py-32 rounded-t-[3rem] shadow-[0_-20px_40px_rgb(0,0,0,0.02)]">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 md:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#111] sm:text-4xl md:text-5xl">
            Everything you need. <br className="hidden md:block" /> Beautifully organized.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Feature Card */}
          <div className="md:col-span-2 rounded-[2rem] border border-black/5 bg-[#faf9f8] p-8 md:p-12 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm mb-8">
              <Calendar className="h-6 w-6 text-[#111]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111] mb-4">Your personalized timeline</h3>
            <p className="text-[#111]/60 text-lg leading-relaxed max-w-md">
              We sync with your goals to build a custom calendar of opportunities. Never miss a deadline, application, or event again.
            </p>
          </div>

          {/* Small Feature Card */}
          <div className="rounded-[2rem] border border-black/5 bg-[#faf9f8] p-8 md:p-12 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm mb-8">
              <Sparkles className="h-6 w-6 text-[#111]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111] mb-4">Smart Matches</h3>
            <p className="text-[#111]/60 text-lg leading-relaxed">
              AI curates your daily stack based on your unique skills and interests.
            </p>
          </div>

          {/* Small Feature Card */}
          <div className="rounded-[2rem] border border-black/5 bg-[#faf9f8] p-8 md:p-12 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm mb-8">
              <Globe className="h-6 w-6 text-[#111]" />
            </div>
            <h3 className="text-2xl font-bold text-[#111] mb-4">Global Reach</h3>
            <p className="text-[#111]/60 text-lg leading-relaxed">
              Find remote work, online hackathons, and global scholarships easily.
            </p>
          </div>

          {/* Large Feature Card */}
          <div className="md:col-span-2 rounded-[2rem] border border-black/5 bg-[#faf9f8] p-8 md:p-12 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#111] mb-4">Share your profile</h3>
              <p className="text-[#111]/60 text-lg leading-relaxed max-w-md">
                Create a beautiful, public-facing page showcasing your hackathon wins, projects, and goals.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-gradient-to-br from-[#ffd8d8] to-[#e0e7ff] rounded-full blur-[60px] opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LumaCTA() {
  return (
    <section className="bg-white py-24 pb-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#faf9f8] border border-black/5 shadow-sm mb-8">
          <Sparkles className="h-8 w-8 text-[#111]" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#111] mb-8">
          Ready to discover?
        </h2>
        <Button className="h-14 rounded-full bg-[#111] px-10 text-lg font-bold text-white shadow-xl shadow-black/10 transition-transform duration-200 hover:scale-105 hover:bg-black">
          Join Fora Free
        </Button>
      </div>
    </section>
  );
}
