import { Show, useAuth } from "@clerk/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import { fetchProfile } from "@/api/profile";
import { FeedOne } from "@/components/feeds/FeedOne";
import { LandingPage } from "@/landing/LandingPage";
import { OnboardingScreen } from "@/onboarding/OnboardingScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/goal" element={<FeedRoute />} />
        <Route path="/stack" element={<FeedRoute />} />
        <Route path="/feed" element={<FeedRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

function FeedRoute() {
  return (
    <>
      <Show when="signed-out">
        <LandingPage />
      </Show>
      <Show when="signed-in">
        <ProfileGate>
          <FeedOne />
        </ProfileGate>
      </Show>
    </>
  );
}

function OnboardingRoute() {
  return (
    <>
      <Show when="signed-out">
        <LandingPage />
      </Show>
      <Show when="signed-in">
        <OnboardingScreen />
      </Show>
    </>
  );
}

function ProfileGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [state, setState] = useState<"checking" | "ready" | "error">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkProfile() {
      try {
        const token = await getToken();
        if (!token) throw new Error("Sign in again to refresh your session.");

        const response = await fetchProfile(token);

        if (cancelled) return;
        if (!response.profileComplete) {
          navigate("/onboarding", { replace: true });
          return;
        }

        setState("ready");
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not check your profile.",
          );
          setState("error");
        }
      }
    }

    void checkProfile();

    return () => {
      cancelled = true;
    };
  }, [getToken, navigate]);

  if (state === "ready") return <>{children}</>;

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-black px-6 text-center text-white">
      <div className="max-w-sm">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
          Fora
        </p>
        <h1 className="mt-4 text-3xl font-black">
          {state === "error" ? "Profile check failed." : "Preparing your stack."}
        </h1>
        {error ? (
          <p className="mt-3 break-words text-sm font-semibold leading-6 text-white/60">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default App;
