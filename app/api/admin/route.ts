import { NextResponse } from "next/server";
import pool, { getSiteData } from "@/lib/db";

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

export async function POST(request: Request) {
  const conn = await pool.getConnection();
  try {
    const body = await request.json();

    if (body.companyData) {
      const c = body.companyData;
      await conn.query(
        `UPDATE company_data SET name=?, slogan=?, address=?, phone=?, phone_raw=?, whatsapp_message=?, rating=?, review_count=?, maps_embed=?, maps_link=? WHERE id=1`,
        [c.name, c.slogan, c.address, c.phone, c.phoneRaw, c.whatsappMessage || c.whatsapp_message, c.rating, c.reviewCount, c.mapsEmbed, c.mapsLink]
      );
    }

    if (body.reviews) {
      await conn.query("DELETE FROM reviews");
      for (const r of body.reviews) {
        await conn.query("INSERT INTO reviews (name, text, stars) VALUES (?, ?, ?)", [r.name, r.text, r.stars]);
      }
    }

    if (body.schedule) {
      await conn.query("DELETE FROM schedule");
      for (const s of body.schedule) {
        await conn.query("INSERT INTO schedule (day, hours, is_open) VALUES (?, ?, ?)", [s.day, s.hours, s.open]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  } finally {
    conn.release();
  }
}
