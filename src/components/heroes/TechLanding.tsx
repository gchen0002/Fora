import { ArrowRight, CheckCircle2, Search, Star, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TechLanding() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroSection />
      <UIFeaturesSection />
      <SocialProofSection />
      <CTASection />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md lg:px-12">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
          <Search className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">Fora</span>
      </div>
      <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
        <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
        <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
        <a href="#community" className="hover:text-blue-600 transition-colors">Community</a>
      </nav>
      <div>
        <Button className="h-10 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow">
          Join Waitlist
        </Button>
      </div>
    </header>
  );
}

function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32">
      {/* Subtle Background Elements */}
      <div className="absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-blue-50/50 blur-3xl" />
      <div className="absolute top-48 -left-24 h-[300px] w-[300px] rounded-full bg-blue-50/50 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-12">
        {/* Left: Product First Copy */}
        <div className="relative z-10 flex flex-col items-start">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-all duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            New: Personalized Daily Stacks
          </div>

          <h1
            className={cn(
              "mt-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-[4rem] lg:leading-[1.1] transition-all delay-150 duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            Find your next <span className="text-blue-600">tech opening</span> in 5 minutes.
          </h1>

          <p
            className={cn(
              "mt-6 max-w-lg text-lg text-slate-600 transition-all delay-300 duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            We match you with the best hackathons, scholarships, and internships based on your profile. Stop searching, start applying.
          </p>

          <div
            className={cn(
              "mt-10 flex flex-col gap-4 sm:flex-row transition-all delay-500 duration-700",
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            <Button className="h-14 rounded-full bg-blue-600 px-8 text-base font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" className="h-14 rounded-full px-8 text-base font-semibold text-slate-700 hover:bg-slate-100">
              View Example Stack
            </Button>
          </div>
        </div>

        {/* Right: Software UI Focus / Mockup */}
        <div
          className={cn(
            "relative z-10 mx-auto w-full max-w-md transition-all delay-700 duration-1000",
            mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          )}
        >
          {/* Main Mockup Container */}
          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/50">
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-50 pb-6">
              {/* App Header */}
              <div className="bg-white px-6 py-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Today's Stack</p>
                    <p className="text-xs font-medium text-slate-500">4 new opportunities</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center font-bold text-sm">
                    A
                  </div>
                </div>
              </div>

              {/* App Content (Cards) */}
              <div className="mt-6 flex flex-col gap-4 px-4">
                <MockOpportunityCard 
                  type="Hackathon" 
                  title="VenusHacks 2026" 
                  tags={["In-person", "Beginner Friendly"]} 
                  match="98%" 
                  icon={<Trophy className="h-5 w-5 text-blue-600" />}
                  active
                />
                <MockOpportunityCard 
                  type="Scholarship" 
                  title="Women in Tech Fund" 
                  tags={["$5,000", "Undergrad"]} 
                  match="92%" 
                  icon={<Star className="h-5 w-5 text-blue-600" />}
                />
                <MockOpportunityCard 
                  type="Internship" 
                  title="Frontend Engineering Intern" 
                  tags={["Remote", "Summer"]} 
                  match="85%" 
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                />
              </div>
            </div>
          </div>

          {/* Floating UI Element */}
          <div className="absolute -left-12 bottom-20 animate-bounce rounded-2xl border border-slate-100 bg-white p-4 shadow-xl hidden md:block" style={{ animationDuration: '3s' }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Application Saved!</p>
                <p className="text-xs text-slate-500">VenusHacks added to tracker</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockOpportunityCard({ 
  type, title, tags, match, active, icon 
}: { 
  type: string, title: string, tags: string[], match: string, active?: boolean, icon: React.ReactNode
}) {
  return (
    <div className={cn(
      "rounded-2xl border bg-white p-4 transition-all hover:shadow-md",
      active ? "border-blue-200 ring-1 ring-blue-100 shadow-sm" : "border-slate-200 shadow-sm"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            {icon}
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600">{type}</p>
            <p className="text-sm font-bold text-slate-900">{title}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
            {match} Match
          </span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {tags.map(tag => (
          <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function UIFeaturesSection() {
  return (
    <section id="features" className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything you need in one stack.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            We handle the searching, filtering, and organizing. You handle the building and learning.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard 
            title="Smart Matching"
            description="Our algorithm reads your tech stack and goals to surface only the most relevant opportunities."
            icon={<Search className="h-6 w-6 text-blue-600" />}
          />
          <FeatureCard 
            title="Daily Digest"
            description="Get a curated list of exactly what you need to see today. No endless scrolling required."
            icon={<Star className="h-6 w-6 text-blue-600" />}
          />
          <FeatureCard 
            title="Track Progress"
            description="Save opportunities, track your applications, and never miss a deadline again."
            icon={<CheckCircle2 className="h-6 w-6 text-blue-600" />}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function SocialProofSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
        <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Trusted by students at top hackathons
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-8 opacity-60 grayscale filter md:gap-16">
          {/* Placeholder for hackathon/college logos. Using text for now to maintain the tech vibe */}
          <span className="text-2xl font-black text-slate-800">VenusHacks</span>
          <span className="text-2xl font-black text-slate-800">TreeHacks</span>
          <span className="text-2xl font-black text-slate-800">LA Hacks</span>
          <span className="text-2xl font-black text-slate-800">HackMIT</span>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[3rem] bg-blue-600 px-6 py-20 text-center shadow-2xl sm:px-12">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Ready to build your stack?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
          Join thousands of tech learners finding their next opportunity in minutes, not hours.
        </p>
        <div className="mt-10 flex justify-center">
          <Button className="h-14 rounded-full bg-white px-8 text-base font-bold text-blue-600 hover:bg-slate-50 hover:text-blue-700 shadow-lg">
            Create your free profile
          </Button>
        </div>
      </div>
    </section>
  );
}
