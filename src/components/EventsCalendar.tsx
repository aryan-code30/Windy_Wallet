"use client";

import { useEffect, useMemo, useState } from "react";
import { CHICAGO_EVENTS } from "@/lib/events";
import type { ChicagoEvent, EventCategory, EventCostType } from "@/types";

const STORAGE_KEY = "ww_events_bookmarks";
const REMINDER_PREF_KEY = "ww_events_reminders";
const REMINDER_SENT_KEY = "ww_events_reminder_sent";

type CostFilter = "all" | EventCostType;
type CategoryFilter = "all" | EventCategory;
type QuickFilter = "all" | "today" | "weekend" | "free-tonight";

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

function loadReminderPref() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REMINDER_PREF_KEY) === "1";
}

function saveReminderPref(enabled: boolean) {
  localStorage.setItem(REMINDER_PREF_KEY, enabled ? "1" : "0");
}

function loadReminderSentIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REMINDER_SENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveReminderSentIds(ids: string[]) {
  localStorage.setItem(REMINDER_SENT_KEY, JSON.stringify(ids));
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

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isTonight(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return isToday(iso) && d.getHours() >= Math.max(17, now.getHours());
}

function hoursUntil(iso: string) {
  return (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60);
}

function toTransitDirectionsUrl(e: ChicagoEvent) {
  const params = new URLSearchParams({
    api: "1",
    origin: "233 S Wacker Dr, Chicago, IL",
    destination: `${e.location}, Chicago, IL`,
    travelmode: "transit",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
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
  const [savedOnly, setSavedOnly] = useState(false);
  const [quick, setQuick] = useState<QuickFilter>("all");
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [shareMsg, setShareMsg] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderMsg, setReminderMsg] = useState("");

  useEffect(() => {
    setBookmarks(loadBookmarks());
    setRemindersEnabled(loadReminderPref());
  }, []);

  const toggleReminders = async () => {
    if (!remindersEnabled) {
      if (typeof Notification === "undefined") {
        setReminderMsg("Browser reminders not supported here.");
        setTimeout(() => setReminderMsg(""), 2200);
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setReminderMsg("Reminder permission not granted.");
        setTimeout(() => setReminderMsg(""), 2200);
        return;
      }
      setRemindersEnabled(true);
      saveReminderPref(true);
      setReminderMsg("Event reminders enabled ✅");
      setTimeout(() => setReminderMsg(""), 2200);
      return;
    }
    setRemindersEnabled(false);
    saveReminderPref(false);
    setReminderMsg("Event reminders off");
    setTimeout(() => setReminderMsg(""), 2200);
  };

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id) ? bookmarks.filter((x) => x !== id) : [...bookmarks, id];
    setBookmarks(next);
    saveBookmarks(next);
  };

  const shareEvent = async (e: ChicagoEvent) => {
    const text = `Join me at ${e.title} (${fmtDateTime(e.startAt)}) at ${e.location}. ${e.link}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: e.title, text, url: e.link });
        setShareMsg("Invite shared ✅");
      } else {
        await navigator.clipboard.writeText(text);
        setShareMsg("Invite copied ✅");
      }
    } catch {
      setShareMsg("Invite canceled");
    }
    setTimeout(() => setShareMsg(""), 1800);
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
      if (savedOnly && !bookmarks.includes(e.id)) return false;
      if (quick === "today" && !isToday(e.startAt)) return false;
      if (quick === "weekend" && !isWeekend(e.startAt)) return false;
      if (quick === "free-tonight" && !(e.costType === "free" && isTonight(e.startAt))) return false;
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
  }, [bookmarks, category, cost, query, quick, savedOnly, weekendOnly]);

  const grouped = useMemo(() => {
    return events.reduce<Record<string, ChicagoEvent[]>>((acc, e) => {
      const key = dayKey(e.startAt);
      acc[key] ||= [];
      acc[key].push(e);
      return acc;
    }, {});
  }, [events]);

  const weekendCount = events.filter((e) => isWeekend(e.startAt)).length;
  const nextEvent = useMemo(
    () => CHICAGO_EVENTS.find((e) => new Date(e.startAt).getTime() > Date.now()),
    []
  );

  useEffect(() => {
    if (!remindersEnabled || typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const notified = new Set(loadReminderSentIds());
    const upcomingBookmarked = CHICAGO_EVENTS.filter(
      (e) => bookmarks.includes(e.id) && hoursUntil(e.startAt) > 0 && hoursUntil(e.startAt) <= 24
    );

    let changed = false;
    for (const e of upcomingBookmarked) {
      if (notified.has(e.id)) continue;
      new Notification("WindyWallet Event Reminder", {
        body: `${e.title} starts ${fmtDateTime(e.startAt)} at ${e.location}`,
      });
      notified.add(e.id);
      changed = true;
    }
    if (changed) saveReminderSentIds([...notified]);
  }, [bookmarks, remindersEnabled]);

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
          {shareMsg && (
            <span className="bg-indigo-50 text-indigo-700 font-semibold rounded-full px-2.5 py-1">
              {shareMsg}
            </span>
          )}
        </div>
      </div>

      {nextEvent && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">📱 Home Widget Preview</p>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-bold text-indigo-900">Up next: {nextEvent.title}</p>
              <p className="text-xs text-indigo-700 mt-0.5">{fmtDateTime(nextEvent.startAt)} · {nextEvent.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={toTransitDirectionsUrl(nextEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold rounded-full px-3 py-1 border border-indigo-200 text-indigo-700 bg-white"
              >
                🚇 Transit route
              </a>
              <button
                onClick={toggleReminders}
                className={`text-[11px] font-semibold rounded-full px-3 py-1 border ${
                  remindersEnabled
                    ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                    : "border-indigo-200 text-indigo-700 bg-white"
                }`}
              >
                {remindersEnabled ? "🔔 Reminders on" : "🔔 Enable reminders"}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-indigo-500 mt-2">
            Tip: Add this site to your phone home screen for a quick “weekend plans” check-in.
            {reminderMsg ? <span className="ml-2 font-semibold">{reminderMsg}</span> : null}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: "all", label: "All" },
          { id: "today", label: "Today" },
          { id: "weekend", label: "This weekend" },
          { id: "free-tonight", label: "Free tonight" },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setQuick(chip.id as QuickFilter)}
            className={`text-[11px] font-semibold rounded-full px-3 py-1 border transition-colors ${
              quick === chip.id
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-white text-gray-500 border-gray-200 hover:text-gray-700"
            }`}
          >
            {chip.label}
          </button>
        ))}
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

        <label className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(e) => setSavedOnly(e.target.checked)}
            className="rounded"
          />
          Saved only
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
                          {e.recurrence && e.recurrence !== "none" && (
                            <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                              {e.recurrence}
                            </span>
                          )}
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
                          <button
                            onClick={() => shareEvent(e)}
                            className="text-primary underline underline-offset-2"
                          >
                            Invite friends
                          </button>
                          <a
                            href={toTransitDirectionsUrl(e)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-2"
                          >
                            Transit directions
                          </a>
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
