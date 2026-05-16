import { UserButton, useUser } from "@clerk/react";
import { ArrowRight, CalendarDays, Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dailyStackPreview } from "@/domain/opportunities";
import { getMatchExplanationLabels } from "@/domain/match-explanations";
import { cn } from "@/lib/utils";

export function DailyStackScreen() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "there";

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-3 py-3 text-ink sm:px-4 sm:py-4">
      <section className="mx-auto max-w-[1120px] overflow-hidden rounded-[1.35rem] border border-ink/10 bg-white shadow-[0_22px_80px_rgba(61,85,128,0.14)]">
        <header className="flex items-center justify-between border-b border-ink/8 px-5 py-5 sm:px-8 lg:px-10">
          <a className="text-2xl font-black tracking-normal text-blueberry" href="/">
            Fora
          </a>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="hidden h-11 px-5 sm:inline-flex">
              Explore more
            </Button>
            <UserButton />
          </div>
        </header>

        <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-10">
          <aside className="rounded-[1.4rem] bg-cloud p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blueberry">
              Daily stack
            </p>
            <h1 className="mt-4 text-4xl font-black leading-none sm:text-5xl">
              Good morning, {firstName}.
            </h1>
            <p className="mt-4 text-base font-semibold leading-7 text-ink/62">
              This is the signed-in product shell. Next we’ll connect this stack
              to D1 and score it from your private opportunity preferences.
            </p>
            <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-sunshine/25 text-sunshine">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black">Today’s rhythm</p>
                  <p className="text-xs font-bold text-ink/50">
                    2 matches ready
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            {dailyStackPreview.map((opportunity) => {
              const labels = getMatchExplanationLabels(
                opportunity.matchExplanationKeys,
              );

              return (
                <article
                  className="rounded-[1.4rem] border border-ink/8 bg-white p-5 shadow-sm"
                  key={opportunity.id}
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div
                      className={cn(
                        "h-32 rounded-2xl bg-gradient-to-br sm:h-auto sm:w-36 sm:shrink-0",
                        opportunity.imageClassName,
                      )}
                    >
                      <div className="h-full w-full rounded-2xl bg-[radial-gradient(circle_at_65%_30%,rgba(255,255,255,0.85),transparent_22%),radial-gradient(circle_at_35%_70%,rgba(255,255,255,0.55),transparent_18%)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-md bg-blueberry px-2 py-1 text-xs font-black text-white">
                          {opportunity.category}
                        </span>
                        <span className="rounded-full border border-ink/10 px-3 py-1 text-xs font-black">
                          {opportunity.matchScore}% match
                        </span>
                      </div>
                      <h2 className="mt-4 text-2xl font-black leading-tight">
                        {opportunity.title}
                      </h2>
                      <p className="mt-1 text-sm font-bold text-ink/55">
                        {opportunity.organization} · {opportunity.timing}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {labels.map((label) => (
                          <span
                            className="rounded-md bg-mint/14 px-2 py-1 text-xs font-black text-mint"
                            key={label}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Button size="sm">
                          Apply
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Heart className="h-4 w-4" aria-hidden="true" />
                          Save
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" aria-hidden="true" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </main>
  );
}
