import { UserButton, useAuth, useUser } from "@clerk/react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProfile, saveProfile, type UserProfile } from "@/api/profile";
import { geocodeKnownLocation } from "@/lib/geo";
import { cn } from "@/lib/utils";

const goalOptions = [
  { label: "Hackathons", value: "hackathon" },
  { label: "Scholarships", value: "scholarship" },
  { label: "Internships", value: "internship" },
  { label: "Mentorship", value: "mentorship" },
  { label: "Workshops", value: "workshop" },
  { label: "Communities", value: "community" },
  { label: "Resume prep", value: "resume-prep" },
];

const identityOptions = [
  { label: "Women in tech", value: "women-focused" },
  { label: "Nonbinary people in tech", value: "nonbinary-focused" },
  { label: "Beginner coders", value: "beginner-friendly" },
  { label: "First-gen students", value: "first-gen-friendly" },
  { label: "Low-income students", value: "low-income-friendly" },
  { label: "LGBTQ+ technologists", value: "lgbtq-friendly" },
  { label: "Disabled technologists", value: "disability-friendly" },
  { label: "Career switchers", value: "career-switcher" },
  { label: "Student founders", value: "student-founder" },
  { label: "Caregivers or parents", value: "caregiver-friendly" },
];

const supportOptions = [
  { label: "Free", value: "free" },
  { label: "Remote", value: "remote" },
  { label: "Beginner-friendly", value: "beginner-friendly" },
  { label: "No experience required", value: "no-experience-required" },
  { label: "Mentorship included", value: "mentorship-included" },
  { label: "Travel support", value: "travel-support" },
  { label: "Evening/weekend friendly", value: "evening-weekend" },
  { label: "Childcare support", value: "childcare-support" },
  { label: "Fee waived", value: "fee-waived" },
];

const interestOptions = [
  { label: "AI", value: "ai" },
  { label: "Design", value: "design" },
  { label: "Cybersecurity", value: "cybersecurity" },
  { label: "Data", value: "data" },
  { label: "Health tech", value: "health-tech" },
  { label: "Startups", value: "startup" },
  { label: "Hardware", value: "hardware" },
  { label: "Social good", value: "social-good" },
];

const experienceOptions = [
  { label: "Just starting", value: "beginner-friendly" },
  { label: "Some projects", value: "early-career" },
  { label: "Ready for internships", value: "internship-ready" },
];

const mileageOptions = [10, 25, 50, 100];

const initialProfile: UserProfile = {
  accessNeedTags: ["free", "beginner-friendly"],
  costSensitive: true,
  displayName: "",
  experienceLevel: "beginner-friendly",
  goalTags: ["hackathon", "scholarship"],
  identityTags: [],
  interestTags: [],
  latitude: null,
  locationText: "",
  longitude: null,
  mileageRange: 25,
  remotePreference: "remote",
};

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExistingProfile() {
      try {
        const token = await getToken();
        if (!token) throw new Error("Sign in again to refresh your session.");

        const response = await fetchProfile(token);
        if (!cancelled && response.profile) {
          setProfile({
            ...initialProfile,
            ...response.profile,
            displayName: response.profile.displayName ?? "",
            locationText: response.profile.locationText ?? "",
          });
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load your profile.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadExistingProfile();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const steps = useMemo(
    () => [
      {
        eyebrow: "Step 1 of 4",
        title: "What should Fora look for?",
        body: "Choose the opportunity types you want in your first stack.",
        content: (
          <ChipGrid
            options={goalOptions}
            selected={profile.goalTags}
            onToggle={(value) => toggleList("goalTags", value)}
          />
        ),
      },
      {
        eyebrow: "Step 2 of 4",
        title: "Who should opportunities be designed for?",
        body: "Optional. Pick only what you want Fora to consider.",
        content: (
          <ChipGrid
            options={identityOptions}
            selected={profile.identityTags}
            onToggle={(value) => toggleList("identityTags", value)}
          />
        ),
      },
      {
        eyebrow: "Step 3 of 4",
        title: "What support matters?",
        body: "These make the stack practical, not just interesting.",
        content: (
          <ChipGrid
            options={supportOptions}
            selected={profile.accessNeedTags}
            onToggle={(value) => toggleList("accessNeedTags", value)}
          />
        ),
      },
      {
        eyebrow: "Step 4 of 4",
        title: "Tune your range and interests.",
        body: "A few final signals help Fora sort the first cards.",
        content: (
          <div className="space-y-6">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#64748b]">
                Display name
              </span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-[#d7deea] bg-white px-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[#3f6df6]"
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    displayName: event.target.value,
                  }))
                }
                placeholder={user?.firstName ?? "Your name"}
                value={profile.displayName ?? ""}
              />
            </label>

            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#64748b]">
                Experience
              </span>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {experienceOptions.map((option) => (
                  <SingleChoice
                    isSelected={profile.experienceLevel === option.value}
                    key={option.value}
                    label={option.label}
                    onClick={() =>
                      setProfile((current) => ({
                        ...current,
                        experienceLevel: option.value,
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#64748b]">
                Interests
              </span>
              <ChipGrid
                options={interestOptions}
                selected={profile.interestTags}
                onToggle={(value) => toggleList("interestTags", value)}
              />
            </div>

            <label className="block">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#64748b]">
                <MapPin className="h-3.5 w-3.5" />
                Primary location
              </span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-[#d7deea] bg-white px-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[#3f6df6]"
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    locationText: event.target.value,
                  }))
                }
                placeholder="City, state or remote"
                value={profile.locationText ?? ""}
              />
              <p className="mt-2 text-xs font-semibold leading-5 text-[#64748b]">
                Used only to estimate miles away and sort nearby opportunities.
              </p>
            </label>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#64748b]">
                  Mileage
                </span>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {mileageOptions.map((value) => (
                    <SingleChoice
                      isSelected={profile.mileageRange === value}
                      key={value}
                      label={`${value}`}
                      onClick={() =>
                        setProfile((current) => ({
                          ...current,
                          mileageRange: value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>

              <label className="flex min-h-[4.9rem] items-center gap-3 rounded-2xl border border-[#d7deea] bg-white px-4">
                <input
                  checked={profile.remotePreference === "remote"}
                  className="h-5 w-5 accent-[#3f6df6]"
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      remotePreference: event.target.checked ? "remote" : "any",
                    }))
                  }
                  type="checkbox"
                />
                <span className="text-sm font-black text-[#111827]">
                  Include remote first
                </span>
              </label>
            </div>
          </div>
        ),
      },
    ],
    [profile, user?.firstName],
  );

  function toggleList(key: keyof Pick<UserProfile, "accessNeedTags" | "goalTags" | "identityTags" | "interestTags">, value: string) {
    setProfile((current) => {
      const selected = new Set(current[key]);
      selected.has(value) ? selected.delete(value) : selected.add(value);

      return {
        ...current,
        [key]: [...selected],
      };
    });
  }

  async function finishOnboarding() {
    setIsSaving(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Sign in again to refresh your session.");
      const coordinates = geocodeKnownLocation(profile.locationText);

      await saveProfile(token, {
        ...profile,
        costSensitive: profile.accessNeedTags.includes("free"),
        displayName: profile.displayName || user?.firstName || null,
        latitude: coordinates?.latitude ?? null,
        locationText: profile.locationText || null,
        longitude: coordinates?.longitude ?? null,
      });
      navigate("/feed", { replace: true });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not build your stack.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const currentStep = steps[step];
  const canGoBack = step > 0;
  const canContinue = step < steps.length - 1;

  if (isLoading) {
    return (
      <OnboardingShell>
        <div className="grid min-h-[60dvh] place-items-center text-center">
          <div>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#3f6df6]" />
            <p className="mt-4 text-sm font-bold text-[#64748b]">
              Setting up your quiz
            </p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell>
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center gap-8 px-4 py-6 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <aside className="rounded-[2rem] bg-[#101827] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)] md:min-h-[34rem] md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-[#f9c74f]" />
            Profile Onboarding
          </div>
          <h1 className="mt-8 max-w-[8ch] text-5xl font-black leading-[0.95] tracking-[-0.03em] sm:text-6xl">
            Build your first stack.
          </h1>
          <p className="mt-5 max-w-sm text-sm font-semibold leading-6 text-white/62">
            Fora uses this private profile to rank opportunities. Skip anything
            personal; the stack still works.
          </p>
          <div className="mt-8 grid grid-cols-4 gap-2">
            {steps.map((item, index) => (
              <div
                className={cn(
                  "h-2 rounded-full",
                  index <= step ? "bg-[#3f6df6]" : "bg-white/14",
                )}
                key={item.eyebrow}
              />
            ))}
          </div>
        </aside>

        <main className="rounded-[2rem] border border-[#dfe5ef] bg-[#f8fafc] p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#3f6df6]">
            {currentStep.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.02em] text-[#111827] sm:text-5xl">
            {currentStep.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-[#64748b]">
            {currentStep.body}
          </p>

          <div className="mt-8">{currentStep.content}</div>

          {error ? (
            <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-black text-[#475569] transition",
                canGoBack ? "hover:bg-white" : "pointer-events-none opacity-0",
              )}
              onClick={() => setStep((value) => Math.max(value - 1, 0))}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {canContinue ? (
              <button
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#3f6df6] px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(63,109,246,0.28)] transition active:scale-[0.98]"
                onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
                type="button"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#111827] px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(17,24,39,0.24)] transition active:scale-[0.98]"
                disabled={isSaving}
                onClick={finishOnboarding}
                type="button"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Build my stack
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </main>
      </div>
    </OnboardingShell>
  );
}

function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#eef3fb] text-[#111827]">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="text-3xl font-black tracking-[-0.04em] text-[#3f6df6]">
          Fora
        </div>
        <UserButton />
      </header>
      {children}
    </div>
  );
}

function ChipGrid({
  onToggle,
  options,
  selected,
}: {
  onToggle: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  selected: string[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <button
            className={cn(
              "flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black transition active:scale-[0.99]",
              isSelected
                ? "border-[#3f6df6] bg-white text-[#111827] shadow-[0_10px_28px_rgba(63,109,246,0.14)]"
                : "border-[#d7deea] bg-white/60 text-[#475569] hover:border-[#aab7cc] hover:bg-white",
            )}
            key={option.value}
            onClick={() => onToggle(option.value)}
            type="button"
          >
            <span>{option.label}</span>
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                isSelected
                  ? "border-[#3f6df6] bg-[#3f6df6] text-white"
                  : "border-[#cbd5e1] bg-white text-transparent",
              )}
            >
              <Check className="h-3.5 w-3.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SingleChoice({
  isSelected,
  label,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "h-11 rounded-2xl border px-3 text-sm font-black transition active:scale-[0.98]",
        isSelected
          ? "border-[#3f6df6] bg-[#3f6df6] text-white"
          : "border-[#d7deea] bg-white text-[#475569] hover:border-[#aab7cc]",
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
