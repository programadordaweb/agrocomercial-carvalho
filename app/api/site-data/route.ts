import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json({ error: "Erro ao ler dados" }, { status: 500 });
  }
}
