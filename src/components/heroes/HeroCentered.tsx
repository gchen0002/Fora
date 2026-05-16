import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroCentered() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#fcfbf7]">
      <AnimatedMesh />

      <div className="relative z-10 mx-auto max-w-[900px] px-6 text-center">
        <div
          className={cn(
            "transition-all duration-700",
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
        >
          <span className="inline-block rounded-full border border-rose-200 bg-rose-50/80 px-4 py-1.5 text-xs font-bold tracking-wide text-rose-600 backdrop-blur-sm">
            FORA — DAILY OPPORTUNITY STACK
          </span>
        </div>

        <h1
          className={cn(
            "mt-8 text-balance text-5xl font-black leading-[0.95] tracking-tighter text-[#172033] transition-all delay-150 duration-700 sm:text-6xl md:text-7xl lg:text-8xl",
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
        >
          Five minutes to{" "}
          <span className="text-rose-500">find your future.</span>
        </h1>

        <p
          className={cn(
            "mx-auto mt-6 max-w-[580px] text-lg leading-relaxed text-[#172033]/60 transition-all delay-300 duration-700",
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
        >
          Hackathons, scholarships, mentors, and internships — matched to your
          goals and delivered daily.
        </p>

        <div
          className={cn(
            "mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row transition-all delay-450 duration-700",
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
        >
          <Button
            size="lg"
            className="bg-rose-500 shadow-[0_14px_30px_rgba(244,63,94,0.28)] hover:bg-rose-600"
          >
            Build my stack
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="lg">
            Explore opportunities
          </Button>
        </div>

        <p className="mt-10 text-sm font-semibold text-[#172033]/45">
          Trusted by students at 200+ universities
        </p>
      </div>
    </section>
  );
}

function AnimatedMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { x: 0.3, y: 0.4, r: 0.35, dx: 0.0003, dy: 0.0002, color: "244, 63, 94" },
      { x: 0.7, y: 0.6, r: 0.3, dx: -0.0002, dy: 0.0003, color: "251, 207, 232" },
      { x: 0.5, y: 0.3, r: 0.25, dx: 0.00015, dy: -0.00025, color: "253, 164, 175" },
    ];

    function draw(time: number) {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((b) => {
        b.x += b.dx;
        b.y += b.dy;

        if (b.x < 0 || b.x > 1) b.dx *= -1;
        if (b.y < 0 || b.y > 1) b.dy *= -1;

        const gradient = ctx.createRadialGradient(
          canvas.width * b.x,
          canvas.height * b.y,
          0,
          canvas.width * b.x,
          canvas.height * b.y,
          canvas.width * b.r,
        );
        gradient.addColorStop(0, `rgba(${b.color}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${b.color}, 0.08)`);
        gradient.addColorStop(1, `rgba(${b.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
