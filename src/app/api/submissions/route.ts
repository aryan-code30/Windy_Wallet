import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// There are no user accounts, so each browser gets an anonymous owner id in an
// httpOnly cookie. Submissions can only be read or deleted by the browser that saved them.
const OWNER_COOKIE = "ww_owner";

function getOwnerId(req: NextRequest): string | undefined {
  const id = req.cookies.get(OWNER_COOKIE)?.value;
  return id && /^[0-9a-f-]{36}$/i.test(id) ? id : undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date();
    const existingOwner = getOwnerId(req);
    const ownerId = existingOwner ?? crypto.randomUUID();
    const doc = await prisma.submission.create({
      data: {
        ownerId,
        zip:            body.zip ?? "",
        categories:     JSON.stringify(body.categories ?? []),
        discounts:      JSON.stringify(body.discounts ?? []),
        totalSavings:   body.totalSavings   ?? 0,
        annualSavings:  body.annualSavings  ?? 0,
        optimizedCount: body.optimizedCount ?? 0,
        month:          body.month ?? (now.getMonth() + 1),
        year:           body.year  ?? now.getFullYear(),
        billsSnapshot:  JSON.stringify(body.billsSnapshot ?? {}),
      },
    });
    const res = NextResponse.json({ success: true, id: doc.id }, { status: 201 });
    if (!existingOwner) {
      res.cookies.set(OWNER_COOKIE, ownerId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      });
    }
    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const ownerId = getOwnerId(req);
    if (!ownerId) return NextResponse.json({ rows: [], grouped: [] });

    const { searchParams } = new URL(req.url);
    const year  = searchParams.get("year")  ? parseInt(searchParams.get("year")!)  : undefined;
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;

    const rows = await prisma.submission.findMany({
      where: {
        ownerId,
        ...(year  ? { year }  : {}),
        ...(month ? { month } : {}),
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: 50,
    });

    // Group by year/month for history view
    const grouped: Record<string, any> = {};
    for (const row of rows) {
      const key = `${row.year}-${String(row.month).padStart(2, "0")}`;
      if (!grouped[key]) {
        grouped[key] = {
          year: row.year,
          month: row.month,
          label: new Date(row.year, row.month - 1).toLocaleString("en-US", { month: "long", year: "numeric" }),
          entries: [],
          bestSavings: 0,
        };
      }
      grouped[key].entries.push({
        id: row.id,
        zip: row.zip,
        categories: JSON.parse(row.categories),
        discounts: JSON.parse(row.discounts),
        totalSavings: row.totalSavings,
        annualSavings: row.annualSavings,
        optimizedCount: row.optimizedCount,
        billsSnapshot: JSON.parse(row.billsSnapshot),
        createdAt: row.createdAt,
      });
      if (row.totalSavings > grouped[key].bestSavings) {
        grouped[key].bestSavings = row.totalSavings;
      }
    }

    return NextResponse.json({
      rows,
      grouped: Object.values(grouped).sort((a: any, b: any) =>
        b.year !== a.year ? b.year - a.year : b.month - a.month
      ),
    });
  } catch {
    return NextResponse.json({ error: "Could not fetch." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ownerId = getOwnerId(req);
    if (!ownerId) return NextResponse.json({ error: "Nothing to delete." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id    = searchParams.get("id");
    const year  = searchParams.get("year")  ? parseInt(searchParams.get("year")!)  : undefined;
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;

    // Delete a single entry by id
    if (id) {
      const { count } = await prisma.submission.deleteMany({ where: { id, ownerId } });
      if (!count) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ success: true, deleted: "entry", id });
    }

    // Delete all entries for a whole month
    if (year && month) {
      const { count } = await prisma.submission.deleteMany({ where: { year, month, ownerId } });
      return NextResponse.json({ success: true, deleted: "month", count });
    }

    return NextResponse.json({ error: "Provide ?id= or ?year=&month=" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

