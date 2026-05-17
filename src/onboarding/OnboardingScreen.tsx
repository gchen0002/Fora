import { UserButton, useAuth, useUser } from "@clerk/react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Loader2,
  MapPin,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProfile, saveProfile, type UserProfile } from "@/api/profile";
import { geocodeKnownLocation } from "@/lib/geo";
import { cn } from "@/lib/utils";

/* ── Spectrum animation keyframes (shared with landing) ── */
const SPECTRUM_STYLE_ID = "fora-spectrum-styles-onboarding";
if (typeof document !== "undefined" && !document.getElementById(SPECTRUM_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = SPECTRUM_STYLE_ID;
  style.textContent = `
    @keyframes spectrumShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes spectrumShiftReverse {
      0%   { background-position: 100% 50%; }
      50%  { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    .fora-spectrum-text {
      background: linear-gradient(
        90deg,
        #CDB4DB, #FFB5A7, #F4F1DE, #B2C9AB,
        #CDB4DB, #FFB5A7, #F4F1DE, #B2C9AB
      );
      background-size: 300% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: spectrumShift 4s ease infinite;
    }
    .fora-spectrum-bar {
      background: linear-gradient(
        90deg,
        #CDB4DB, #FFB5A7, #F4F1DE, #B2C9AB,
        #CDB4DB, #FFB5A7
      );
      background-size: 300% 100%;
      animation: spectrumShift 4s ease infinite;
    }
    .fora-spectrum-btn-hero {
      border: 1.5px solid #e8eaed !important;
      background: white !important;
    }
    .fora-spectrum-btn-hero:hover {
      border-color: #B2C9AB !important;
      box-shadow: 0 4px 18px rgba(178,201,171,0.3) !important;
    }
    .fora-spectrum-btn-hero .spectrum-label {
      background: linear-gradient(
        90deg,
        #B2C9AB, #F4F1DE, #FFB5A7, #CDB4DB,
        #B2C9AB, #F4F1DE, #FFB5A7, #CDB4DB
      );
      background-size: 300% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: spectrumShiftReverse 6s ease infinite;
    }
    .fora-spectrum-btn-hero svg {
      color: #CDB4DB;
    }
  `;
  document.head.appendChild(style);
}

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
  const isMountedRef = useRef(true);
  const saveControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      saveControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadExistingProfile() {
      try {
        const token = await getToken();
        if (!token) throw new Error("Sign in again to refresh your session.");

        if (cancelled) return;

        const response = await fetchProfile(token, controller.signal);
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
      controller.abort();
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
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5f6368]">
                Display name
              </span>
              <input
                className="mt-2 h-12 w-full rounded-xl border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#202124] outline-none transition focus:border-[#CDB4DB] focus:ring-4 focus:ring-[#CDB4DB]/20"
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
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5f6368]">
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
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5f6368]">
                Interests
              </span>
              <ChipGrid
                options={interestOptions}
                selected={profile.interestTags}
                onToggle={(value) => toggleList("interestTags", value)}
              />
            </div>

            <label className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5f6368]">
                <MapPin className="h-3.5 w-3.5" />
                Primary location
              </span>
              <input
                className="mt-2 h-12 w-full rounded-xl border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#202124] outline-none transition focus:border-[#CDB4DB] focus:ring-4 focus:ring-[#CDB4DB]/20"
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    locationText: event.target.value,
                  }))
                }
                placeholder="City, state or remote"
                value={profile.locationText ?? ""}
              />
              <p className="mt-2 text-xs font-medium leading-5 text-[#5f6368]">
                Used only to estimate miles away and sort nearby opportunities.
              </p>
            </label>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5f6368]">
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

              <label className="flex min-h-[4.9rem] items-center gap-3 rounded-xl border border-[#dadce0] bg-white px-4">
                <input
                  checked={profile.remotePreference === "remote"}
                  className="h-5 w-5 accent-[#202124]"
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      remotePreference: event.target.checked ? "remote" : "any",
                    }))
                  }
                  type="checkbox"
                />
                <span className="text-sm font-medium text-[#202124]">
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
    if (isSaving) return;

    const controller = new AbortController();
    saveControllerRef.current?.abort();
    saveControllerRef.current = controller;
    setIsSaving(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Sign in again to refresh your session.");
      const coordinates = geocodeKnownLocation(profile.locationText);

      if (controller.signal.aborted) return;

      await saveProfile(token, {
        ...profile,
        costSensitive: profile.accessNeedTags.includes("free"),
        displayName: profile.displayName || user?.firstName || null,
        latitude: coordinates?.latitude ?? null,
        locationText: profile.locationText || null,
        longitude: coordinates?.longitude ?? null,
      }, controller.signal);

      if (!controller.signal.aborted && isMountedRef.current) {
        navigate("/feed", { replace: true });
      }
    } catch (cause) {
      if (controller.signal.aborted) return;

      setError(
        cause instanceof Error ? cause.message : "Could not build your stack.",
      );
    } finally {
      if (saveControllerRef.current === controller) {
        saveControllerRef.current = null;
      }

      if (!controller.signal.aborted && isMountedRef.current) {
        setIsSaving(false);
      }
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
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#CDB4DB]" />
            <p className="mt-4 text-sm font-medium text-[#5f6368]">
              Setting up your quiz
            </p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell>
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-6 py-10 lg:px-24">
        <div className="mx-auto grid w-full max-w-[840px] grid-cols-4 gap-3">
          {steps.map((item, index) => (
            <div
              className={cn(
                "h-3 rounded-full transition-colors",
                index <= step ? "fora-spectrum-bar" : "bg-[#e8eaed]",
              )}
              key={item.eyebrow}
            />
          ))}
        </div>

        <div className="grid flex-1 items-center pt-10">
          <main className="mx-auto w-full max-w-[640px]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a8f98]">
              {currentStep.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#202124] sm:text-4xl">
              {currentStep.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#5f6368]">
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
                  "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-medium text-[#5f6368] transition active:scale-[0.98]",
                  canGoBack ? "hover:bg-[#f8f9fa]" : "pointer-events-none opacity-0",
                )}
                onClick={() => setStep((value) => Math.max(value - 1, 0))}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-11 items-center rounded-xl border border-[#dadce0] px-5 text-sm font-medium text-[#5f6368] transition hover:bg-[#f8f9fa] active:scale-[0.98] disabled:opacity-70"
                  disabled={isSaving}
                  onClick={finishOnboarding}
                  type="button"
                >
                  Skip
                </button>
                {canContinue ? (
                  <button
                    className="fora-spectrum-btn-hero inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold transition active:scale-[0.98]"
                    onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
                    type="button"
                  >
                    <span className="spectrum-label">Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    className="fora-spectrum-btn-hero inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-70"
                    disabled={isSaving}
                    onClick={finishOnboarding}
                    type="button"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    <span className="spectrum-label">Build my stack</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </OnboardingShell>
  );
}

function OnboardingShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-white font-sans text-[#202124] selection:bg-[#CDB4DB]/20">
      <header className="flex h-16 items-center justify-between border-b border-[#e8eaed] bg-white/80 px-6 backdrop-blur-md lg:px-12">
        <button
          className="flex items-center gap-2 transition-opacity hover:opacity-75"
          aria-label="Go to Fora home"
          onClick={() => navigate("/")}
          type="button"
        >
          <BrandDots />
          <div className="fora-spectrum-text text-lg font-medium tracking-tight">
            fora
          </div>
        </button>
        <UserButton />
      </header>
      {children}
    </div>
  );
}

function BrandDots({ size = "md" }: { size?: "sm" | "md" }) {
  const dotClass = size === "sm" ? "h-[6px] w-[6px]" : "h-[10px] w-[10px]";

  return (
    <div className="flex items-center gap-[3px]" aria-hidden="true">
      <div className={cn(dotClass, "rounded-full bg-[#CDB4DB]")} />
      <div className={cn(dotClass, "rounded-full bg-[#FFB5A7]")} />
      <div className={cn(dotClass, "rounded-full bg-[#F4F1DE]")} />
      <div className={cn(dotClass, "rounded-full bg-[#B2C9AB]")} />
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
              "flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition active:scale-[0.99]",
              isSelected
                ? "border-[#202124] bg-white text-[#202124] shadow-[0_10px_28px_rgba(32,33,36,0.08)]"
                : "border-[#dadce0] bg-white text-[#5f6368] hover:border-[#bfc5cd] hover:bg-[#f8f9fa]",
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
                  ? "border-[#202124] bg-[#202124] text-white"
                  : "border-[#dadce0] bg-white text-transparent",
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
        "h-11 rounded-xl border px-3 text-sm font-medium transition active:scale-[0.98]",
        isSelected
          ? "border-[#202124] bg-[#202124] text-white"
          : "border-[#dadce0] bg-white text-[#5f6368] hover:border-[#bfc5cd]",
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
