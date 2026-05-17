import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { searchLocations, type LocationEntry } from "@/data/locations";
import { cn } from "@/lib/utils";

export function LocationAutocomplete({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (value: string) => void;
  onPick: (location: LocationEntry) => void;
}) {
  const [suggestions, setSuggestions] = useState<LocationEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const trimmed = value.trim();
    if (trimmed.length >= 2) {
      searchLocations(trimmed).then((results) => {
        if (!cancelled) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
          setHighlightedIndex(-1);
        }
      });
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
    return () => { cancelled = true; };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handlePick(location: LocationEntry) {
    onChange(location.label);
    onPick(location);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      handlePick(suggestions[highlightedIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5f6368]">
        <MapPin className="h-3.5 w-3.5" />
        Primary location
      </span>
      <input
        ref={inputRef}
        className="mt-2 h-12 w-full rounded-xl border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#202124] outline-none transition focus:border-[#CDB4DB] focus:ring-4 focus:ring-[#CDB4DB]/20"
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="City, state or remote"
        type="text"
        value={value}
      />
      <p className="mt-2 text-xs font-medium leading-5 text-[#5f6368]">
        Used only to estimate miles away and sort nearby opportunities.
      </p>

      {isOpen ? (
        <ul
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-[#dadce0] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          role="listbox"
        >
          {suggestions.map((location, index) => (
            <li
              className={cn(
                "flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-[#202124] transition hover:bg-[#f8f9fa]",
                index === highlightedIndex ? "bg-[#f0f0f4]" : "",
              )}
              key={location.label}
              onClick={() => handlePick(location)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#8a8f98]" />
              {location.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
