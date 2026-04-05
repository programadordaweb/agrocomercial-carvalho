import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/get-site-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}
