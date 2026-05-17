import { Play, Star } from "lucide-react";

import {
  HeaderAuthActions,
  HeroAuthActions,
  MobileAuthActions,
} from "@/auth/AuthActions";
import { Button } from "@/components/ui/button";
import { dailyStackPreview } from "@/domain/opportunities";
import { categoryCards, benefits, navItems } from "@/landing/landing-content";
import { DailyStackPreview } from "@/landing/DailyStackPreview";
import {
  categoryColorRecipes,
  socialProofAvatarRecipes,
} from "@/landing/visual-recipes";
import { cn } from "@/lib/utils";

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f8ff] px-3 py-3 text-ink sm:px-4 sm:py-4">
      <section className="mx-auto max-w-[1420px] overflow-hidden rounded-[1.35rem] border border-ink/10 bg-white shadow-[0_22px_80px_rgba(61,85,128,0.14)]">
        <Header />
        <div className="grid gap-8 px-5 pb-10 pt-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-6 lg:px-14 lg:pb-12 lg:pt-10">
          <HeroCopy />
          <HeroVisual />
        </div>
        <Categories />
        <BenefitStrip />
      </section>
      <p className="mx-auto mt-6 max-w-7xl text-center text-base font-semibold text-blueberry sm:text-lg">
        5 minutes today. More opportunities tomorrow.
      </p>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
      <a className="text-2xl font-black tracking-normal text-blueberry" href="/">
        Fora
      </a>
      <nav className="hidden items-center gap-9 text-sm font-bold text-ink/72 lg:flex">
        {navItems.map((item) => (
          <a className="transition hover:text-blueberry" href="/" key={item}>
            {item}
          </a>
        ))}
      </nav>
      <HeaderAuthActions />
      <MobileAuthActions />
    </header>
  );
}

function HeroCopy() {
  return (
    <div className="flex min-h-[520px] flex-col justify-center lg:pb-4">
      <h1 className="max-w-[680px] text-balance text-[3.15rem] font-black leading-[0.96] tracking-normal text-ink sm:text-6xl lg:text-[4.9rem]">
        Find your next tech opening{" "}
        <span className="text-blueberry">in 5 minutes.</span>
      </h1>
      <p className="mt-7 max-w-[560px] text-lg font-medium leading-8 text-ink/70">
        A daily stack of hackathons, mentors, scholarships, and communities
        matched to your goals.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <HeroAuthActions />
        <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-blueberry transition hover:bg-blueberry/5">
          See how it works
          <span className="grid h-7 w-7 place-items-center rounded-full border border-blueberry/30">
            <Play className="h-3.5 w-3.5 fill-blueberry" aria-hidden="true" />
          </span>
        </button>
      </div>
      <SocialProof />
    </div>
  );
}

function SocialProof() {
  return (
    <div className="mb-8 mt-10 flex flex-wrap items-center gap-4 lg:mb-0">
      <div className="flex -space-x-2">
        {["A", "N", "S", "M"].map((initial, index) => (
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm",
              socialProofAvatarRecipes[index],
            )}
            key={initial}
          >
            {initial}
          </span>
        ))}
      </div>
      <div>
        <div className="flex gap-0.5 text-sunshine">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              className="h-4 w-4 fill-current"
              aria-hidden="true"
              key={index}
            />
          ))}
        </div>
        <p className="mt-1 text-sm font-semibold text-ink/58">
          Loved by learners like you
        </p>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div
      className="relative min-h-[560px] lg:min-h-[640px]"
      aria-label="Fora app preview"
    >
      <div className="absolute right-[-12%] top-[19%] h-64 w-64 rounded-full bg-sunshine lg:h-80 lg:w-80" />
      <div className="absolute bottom-[15%] right-[18%] h-52 w-52 rounded-full bg-mint/75 lg:h-64 lg:w-64" />
      <div className="absolute bottom-[15%] left-[16%] h-64 w-64 rounded-full bg-blueberry lg:h-80 lg:w-80" />
      <div className="absolute left-[3%] top-[32%] hidden h-32 w-32 bg-[radial-gradient(#f4b63f_1.5px,transparent_1.5px)] [background-size:12px_12px] lg:block" />
      <DailyStackPreview
        opportunities={dailyStackPreview}
        className="absolute left-1/2 top-1/2 w-[min(72vw,320px)] -translate-x-1/2 -translate-y-1/2 lg:w-[330px]"
      />
    </div>
  );
}

function Categories() {
  return (
    <section id="categories" className="px-5 pb-12 sm:px-8 lg:px-14">
      <div className="mb-5">
        <h2 className="text-2xl font-black sm:text-3xl">
          Explore what's possible
        </h2>
        <p className="mt-1 text-sm font-medium text-ink/58">
          Opportunities designed for you.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoryCards.map((card) => {
          const Icon = card.icon;
          const recipe = categoryColorRecipes[card.colorRecipe];

          return (
            <article
              className={cn(
                "rounded-[1.4rem] bg-white p-6 shadow-sm ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-card",
                recipe.ring,
              )}
              key={card.title}
            >
              <span
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-full",
                  recipe.bg,
                  recipe.text,
                )}
              >
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-black">{card.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-ink/62">
                {card.copy}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BenefitStrip() {
  return (
    <section className="bg-[#eef6ff] px-5 py-8 sm:px-8 lg:px-14">
      <div className="grid gap-7 lg:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article className="flex gap-4" key={benefit.title}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-blueberry shadow-sm">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-black">{benefit.title}</h3>
                <p className="mt-1 max-w-sm text-sm font-medium leading-6 text-ink/62">
                  {benefit.copy}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
