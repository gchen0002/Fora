/**
 * Feed 1 — "TikTok Vertical"
 * Full-screen snap-scroll cards, one event at a time.
 * Swipe up to see the next event. Social engagement on the side.
 */
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ChevronUp, Heart, MapPin, MessageCircle, Share2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { events, typeEmoji, type EventItem } from "@/data/events";
import { cn } from "@/lib/utils";

const G = { blue: "#4285F4", red: "#EA4335", yellow: "#FBBC05", green: "#34A853" };

export function FeedOne() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());

  function toggleLike(id: number) {
    setLiked((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }
  function toggleSave(id: number) {
    setSaved((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  return (
    <div className="relative h-[100dvh] snap-y snap-mandatory overflow-y-scroll bg-black">
      {/* Top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between px-4 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => navigate("/")} className="text-white/80 hover:text-white transition-colors">
          <X className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-[3px]">
          <div className="h-2 w-2 rounded-full" style={{ background: G.blue }} />
          <div className="h-2 w-2 rounded-full" style={{ background: G.red }} />
          <div className="h-2 w-2 rounded-full" style={{ background: G.yellow }} />
          <div className="h-2 w-2 rounded-full" style={{ background: G.green }} />
          <span className="ml-1.5 text-sm font-semibold text-white">fora</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-white/60">For You</span>
          <span className="text-xs font-semibold text-white border-b-2 border-white pb-0.5">Following</span>
        </div>
      </div>

      {/* Cards */}
      {events.map((event) => (
        <div
          key={event.id}
          className="relative flex h-[100dvh] w-full snap-start items-end"
          style={{ background: event.gradient }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Content */}
          <div className="relative z-10 w-full p-6 pb-24">
            {/* Match badge */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-lg">{typeEmoji[event.type]}</span>
              <span className="text-xs font-semibold text-white capitalize">{event.type}</span>
              <span className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: G.green }}>
                {event.match}% match
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white leading-tight">{event.title}</h2>
            <p className="mt-1 text-sm font-medium text-white/70">
              {event.org} · <span className="text-white/50">{event.handle}</span>
            </p>

            <p className="mt-3 max-w-[85%] text-sm leading-relaxed text-white/80">{event.description}</p>

            <div className="mt-3 flex items-center gap-2 text-white/60 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              <span>{event.location}</span>
              <span>·</span>
              <span>{event.date}</span>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Apply button */}
            <button
              className="mt-5 h-11 w-full rounded-lg text-sm font-semibold text-white transition-all active:scale-[0.98]"
              style={{ background: G.blue }}
            >
              Apply Now · {event.attendees.toLocaleString()} interested
            </button>
          </div>

          {/* Side actions (TikTok-style) */}
          <div className="absolute bottom-32 right-4 z-20 flex flex-col items-center gap-6">
            <button onClick={() => toggleLike(event.id)} className="flex flex-col items-center gap-1">
              <Heart className={cn("h-7 w-7 transition-colors", liked.has(event.id) ? "text-red-500 fill-red-500" : "text-white")} />
              <span className="text-[10px] font-semibold text-white">{liked.has(event.id) ? event.attendees + 1 : event.attendees}</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <MessageCircle className="h-7 w-7 text-white" />
              <span className="text-[10px] font-semibold text-white">{Math.floor(event.attendees * 0.12)}</span>
            </button>
            <button onClick={() => toggleSave(event.id)} className="flex flex-col items-center gap-1">
              <Bookmark className={cn("h-7 w-7 transition-colors", saved.has(event.id) ? "text-yellow-400 fill-yellow-400" : "text-white")} />
              <span className="text-[10px] font-semibold text-white">Save</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Share2 className="h-7 w-7 text-white" />
              <span className="text-[10px] font-semibold text-white">Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
