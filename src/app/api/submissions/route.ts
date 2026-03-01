import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc = await prisma.submission.create({
      data: {
        zip: body.zip ?? "",
        categories: JSON.stringify(body.categories ?? []),
        discounts:  JSON.stringify(body.discounts ?? []),
        totalSavings:   body.totalSavings   ?? 0,
        annualSavings:  body.annualSavings  ?? 0,
        optimizedCount: body.optimizedCount ?? 0,
      },
    });
    return NextResponse.json({ success: true, id: doc.id }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await prisma.submission.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Could not fetch." }, { status: 500 });
  }
}
