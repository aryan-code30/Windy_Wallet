import type { ChicagoEvent } from "@/types";

function dateAtOffset(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

interface EventTemplate {
  seriesId: string;
  title: string;
  description: string;
  category: ChicagoEvent["category"];
  costType: ChicagoEvent["costType"];
  costLabel: string;
  neighborhood: string;
  location: string;
  link: string;
  startOffsetDays: number;
  startHour: number;
  startMinute?: number;
  durationMins: number;
  recurrence?: ChicagoEvent["recurrence"];
}

const TEMPLATES: EventTemplate[] = [
  {
    seriesId: "millennium-concert",
    title: "Millennium Park Summer Music Series",
    description: "Outdoor evening concert at Pritzker Pavilion.",
    category: "music",
    costType: "free",
    costLabel: "Free",
    neighborhood: "The Loop",
    location: "Jay Pritzker Pavilion, Millennium Park",
    startOffsetDays: 2,
    startHour: 18,
    startMinute: 30,
    durationMins: 120,
    recurrence: "weekly",
    link: "https://www.chicago.gov/city/en/depts/dca/supp_info/millennium_park9.html",
  },
  {
    seriesId: "lakefront-fun-run",
    title: "Lakefront Sunset Fun Run",
    description: "Community 5K run/walk with meet-up pace groups.",
    category: "fitness",
    costType: "free",
    costLabel: "Free",
    neighborhood: "Near Loop",
    location: "Lakefront Trail (Monroe Harbor start)",
    startOffsetDays: 3,
    startHour: 18,
    durationMins: 75,
    recurrence: "weekly",
    link: "https://www.chicagoparkdistrict.com/parks-facilities/lakefront-trail",
  },
  {
    seriesId: "daley-plaza-market",
    title: "Daley Plaza Farmers Market",
    description: "Fresh produce, breads, and local vendors in the Loop.",
    category: "market",
    costType: "free",
    costLabel: "Free entry",
    neighborhood: "The Loop",
    location: "Daley Plaza",
    startOffsetDays: 4,
    startHour: 8,
    durationMins: 360,
    recurrence: "weekly",
    link: "https://www.chicago.gov/city/en/depts/dca/supp_info/farmers_markets.html",
  },
  {
    seriesId: "museum-campus-free-day",
    title: "Illinois Resident Museum Free Day",
    description: "Select museums offering free or reduced admission days.",
    category: "museum",
    costType: "free",
    costLabel: "Free / reduced",
    neighborhood: "Museum Campus",
    location: "Participating Chicago Museums",
    startOffsetDays: 5,
    startHour: 10,
    durationMins: 420,
    recurrence: "monthly",
    link: "https://www.choosechicago.com/articles/museums-art/free-museum-days-in-chicago/",
  },
  {
    seriesId: "riverwalk-yoga",
    title: "Riverwalk Morning Yoga",
    description: "Beginner-friendly outdoor yoga session by the river.",
    category: "fitness",
    costType: "low-cost",
    costLabel: "$5 suggested",
    neighborhood: "The Loop",
    location: "Chicago Riverwalk (Franklin St steps)",
    startOffsetDays: 6,
    startHour: 8,
    durationMins: 60,
    recurrence: "weekly",
    link: "https://www.chicagoriverwalk.us/",
  },
  {
    seriesId: "neighborhood-street-fest",
    title: "Neighborhood Street Fest",
    description: "Local food vendors, live sets, and family activities.",
    category: "community",
    costType: "low-cost",
    costLabel: "$10 suggested donation",
    neighborhood: "West Loop",
    location: "Fulton Market District",
    startOffsetDays: 7,
    startHour: 12,
    durationMins: 420,
    link: "https://www.choosechicago.com/articles/festivals-special-events/chicago-festival-event-guide/",
  },
  {
    seriesId: "grant-park-movie-night",
    title: "Grant Park Movie Night",
    description: "Bring-a-blanket outdoor movie screening.",
    category: "community",
    costType: "free",
    costLabel: "Free",
    neighborhood: "The Loop",
    location: "Grant Park",
    startOffsetDays: 9,
    startHour: 20,
    durationMins: 120,
    recurrence: "weekly",
    link: "https://www.chicagoparkdistrict.com/parks-facilities/grant-park",
  },
  {
    seriesId: "millennium-lunch-concert",
    title: "Millennium Park Lunch Concert",
    description: "Midday live music break near work/school.",
    category: "music",
    costType: "free",
    costLabel: "Free",
    neighborhood: "The Loop",
    location: "Millennium Park",
    startOffsetDays: 10,
    startHour: 12,
    startMinute: 15,
    durationMins: 45,
    recurrence: "weekly",
    link: "https://www.chicago.gov/city/en/depts/dca/supp_info/millennium_park9.html",
  },
  {
    seriesId: "south-loop-market",
    title: "South Loop Pop-Up Market",
    description: "Budget-friendly local food + handmade goods.",
    category: "market",
    costType: "free",
    costLabel: "Free entry",
    neighborhood: "South Loop",
    location: "Printers Row Plaza",
    startOffsetDays: 11,
    startHour: 11,
    durationMins: 300,
    recurrence: "weekly",
    link: "https://www.choosechicago.com/articles/neighborhoods/chicago-south-loop-neighborhood-guide/",
  },
  {
    seriesId: "lakefront-group-run",
    title: "Lakefront Weekend Group Run",
    description: "Casual pace run club with 3K and 8K options.",
    category: "fitness",
    costType: "free",
    costLabel: "Free",
    neighborhood: "Near Loop",
    location: "Lakefront Trail (Buckingham Fountain meet point)",
    startOffsetDays: 12,
    startHour: 9,
    durationMins: 90,
    recurrence: "weekly",
    link: "https://www.chicagoparkdistrict.com/parks-facilities/lakefront-trail",
  },
  {
    seriesId: "community-art-walk",
    title: "Community Art Walk",
    description: "Guided walk through Loop murals and public art.",
    category: "community",
    costType: "low-cost",
    costLabel: "$8",
    neighborhood: "The Loop",
    location: "Chicago Cultural Center (start)",
    startOffsetDays: 13,
    startHour: 15,
    durationMins: 90,
    recurrence: "weekly",
    link: "https://www.chicago.gov/city/en/depts/dca/supp_info/chicago_culturalcenter.html",
  },
  {
    seriesId: "field-museum-discount-day",
    title: "Field Museum Discount Day",
    description: "Reduced ticket day for Chicago residents.",
    category: "museum",
    costType: "low-cost",
    costLabel: "$10–$15",
    neighborhood: "Museum Campus",
    location: "Field Museum",
    startOffsetDays: 14,
    startHour: 10,
    durationMins: 420,
    recurrence: "monthly",
    link: "https://www.fieldmuseum.org/visit/free-days",
  },
];

function occurrenceId(seriesId: string, startAtIso: string) {
  return `${seriesId}-${startAtIso.slice(0, 10)}`;
}

function toEvent(template: EventTemplate, startAtIso: string): ChicagoEvent {
  const start = new Date(startAtIso);
  const end = new Date(start.getTime() + template.durationMins * 60 * 1000);
  return {
    id: occurrenceId(template.seriesId, startAtIso),
    seriesId: template.seriesId,
    title: template.title,
    description: template.description,
    category: template.category,
    costType: template.costType,
    costLabel: template.costLabel,
    neighborhood: template.neighborhood,
    location: template.location,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    link: template.link,
    recurrence: template.recurrence ?? "none",
  };
}

function expandTemplate(template: EventTemplate): ChicagoEvent[] {
  const first = dateAtOffset(template.startOffsetDays, template.startHour, template.startMinute ?? 0);
  const baseStart = new Date(first);
  const windowEnd = Date.now() + 28 * 24 * 60 * 60 * 1000;
  const out: ChicagoEvent[] = [];

  let cursor = new Date(baseStart);
  while (cursor.getTime() <= windowEnd) {
    out.push(toEvent(template, cursor.toISOString()));

    if (template.recurrence === "weekly") {
      cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (template.recurrence === "monthly") {
      const next = new Date(cursor);
      next.setMonth(next.getMonth() + 1);
      cursor = next;
    } else {
      break;
    }
  }

  return out;
}

export const CHICAGO_EVENTS = TEMPLATES.flatMap(expandTemplate).sort(
  (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
);
