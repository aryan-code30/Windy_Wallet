"use client";

import { useEffect, useMemo, useState } from "react";
import { CHICAGO_EVENTS } from "@/lib/events";
import type { ChicagoEvent, EventCategory, EventCostType } from "@/types";

const STORAGE_KEY = "ww_events_bookmarks";

type CostFilter = "all" | EventCostType;
type CategoryFilter = "all" | EventCategory;

function loadBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveBookmarks(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function isWeekend(iso: string) {
  const day = new Date(iso).getDay();
  return day === 0 || day === 6;
}

function toGoogleCalendarUrl(e: ChicagoEvent) {
  const start = new Date(e.startAt);
  const end = new Date(e.endAt ?? new Date(start.getTime() + 60 * 60 * 1000).toISOString());
  const ymd = (date: Date) =>
    `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
  const hms = (date: Date) =>
    `${String(date.getUTCHours()).padStart(2, "0")}${String(date.getUTCMinutes()).padStart(2, "0")}00`;

  const dates = `${ymd(start)}T${hms(start)}Z/${ymd(end)}T${hms(end)}Z`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates,
    details: `${e.description}\n\nMore info: ${e.link}`,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadICS(e: ChicagoEvent) {
  const start = new Date(e.startAt);
  const end = new Date(e.endAt ?? new Date(start.getTime() + 60 * 60 * 1000).toISOString());

  const toICS = (date: Date) =>
    `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}T${String(
      date.getUTCHours()
    ).padStart(2, "0")}${String(date.getUTCMinutes()).padStart(2, "0")}00Z`;

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WindyWallet//Chicago Events//EN",
    "BEGIN:VEVENT",
    `UID:${e.id}@windywallet`,
    `DTSTAMP:${toICS(new Date())}`,
    `DTSTART:${toICS(start)}`,
    `DTEND:${toICS(end)}`,
    `SUMMARY:${e.title}`,
    `LOCATION:${e.location}`,
    `DESCRIPTION:${e.description} - ${e.link}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function EventsCalendar() {
  const [cost, setCost] = useState<CostFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(loadBookmarks());
  }, []);

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id) ? bookmarks.filter((x) => x !== id) : [...bookmarks, id];
    setBookmarks(next);
    saveBookmarks(next);
  };

  const events = useMemo(() => {
    const now = Date.now();
    const twoWeeks = now + 14 * 24 * 60 * 60 * 1000;

    return CHICAGO_EVENTS.filter((e) => {
      const t = new Date(e.startAt).getTime();
      if (t < now - 3 * 60 * 60 * 1000 || t > twoWeeks) return false;
      if (cost !== "all" && e.costType !== cost) return false;
      if (category !== "all" && e.category !== category) return false;
      if (weekendOnly && !isWeekend(e.startAt)) return false;
      if (
        query &&
        !`${e.title} ${e.description} ${e.location} ${e.neighborhood}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [category, cost, query, weekendOnly]);

  const grouped = useMemo(() => {
    return events.reduce<Record<string, ChicagoEvent[]>>((acc, e) => {
      const key = dayKey(e.startAt);
      acc[key] ||= [];
      acc[key].push(e);
      return acc;
    }, {});
  }, [events]);

  const weekendCount = events.filter((e) => isWeekend(e.startAt)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-gray-900 text-base">🎉 Chicago Events Calendar</h3>
          <p className="text-xs text-gray-400">
            Free + low-cost Loop events in the next 2 weeks · {bookmarks.length} bookmarked
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="bg-emerald-50 text-emerald-700 font-semibold rounded-full px-2.5 py-1">
            {events.length} upcoming
          </span>
          <span className="bg-indigo-50 text-indigo-700 font-semibold rounded-full px-2.5 py-1">
            {weekendCount} weekend
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <select
          value={cost}
          onChange={(e) => setCost(e.target.value as CostFilter)}
          className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700"
        >
          <option value="all">All prices</option>
          <option value="free">Free only</option>
          <option value="low-cost">Low-cost</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700"
        >
          <option value="all">All categories</option>
          <option value="music">Music</option>
          <option value="fitness">Fitness</option>
          <option value="market">Markets</option>
          <option value="museum">Museums</option>
          <option value="community">Community</option>
        </select>

        <label className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={weekendOnly}
            onChange={(e) => setWeekendOnly(e.target.checked)}
            className="rounded"
          />
          This weekend only
        </label>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or neighborhood"
          className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700"
        />
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-8 text-center">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-sm font-semibold text-gray-700">No events match your filters</p>
          <p className="text-xs text-gray-500 mt-1">Try removing a filter or search term.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([day, list]) => (
            <div key={day} className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
                {day}
              </div>
              <div className="divide-y divide-gray-100">
                {list.map((e) => {
                  const bookmarked = bookmarks.includes(e.id);
                  return (
                    <div key={e.id} className="px-4 py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800">{e.title}</p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              e.costType === "free"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {e.costLabel}
                          </span>
                          <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full capitalize">
                            {e.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{fmtDateTime(e.startAt)} · {e.location}</p>
                        <p className="text-xs text-gray-400 mt-1">{e.description}</p>
                        <div className="mt-2 flex items-center gap-3 text-[11px]">
                          <a href={e.link} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                            Event page
                          </a>
                          <a
                            href={toGoogleCalendarUrl(e)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-2"
                          >
                            Add to Google Calendar
                          </a>
                          <button
                            onClick={() => downloadICS(e)}
                            className="text-primary underline underline-offset-2"
                          >
                            Download .ics
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleBookmark(e.id)}
                        className={`text-xs font-semibold rounded-xl px-2.5 py-1.5 border transition-colors ${
                          bookmarked
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 bg-white text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {bookmarked ? "★ Saved" : "☆ Save"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
