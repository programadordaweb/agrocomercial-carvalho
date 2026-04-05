import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prisma = db();
    if (body.type === "visit") {
      await prisma.analyticsVisit.create({ data: { page: body.page || "/", referrer: body.referrer || "", userAgent: body.userAgent || "" } });
    } else if (body.type === "whatsapp") {
      await prisma.analyticsWhatsapp.create({ data: { page: body.page || "/" } });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
