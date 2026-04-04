import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get("date");

  let conn;
  try {
    conn = await pool.getConnection();
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const [todayV] = await conn.query("SELECT COUNT(*) as c FROM analytics_visits WHERE DATE(timestamp) = ?", [today]);
    const [todayC] = await conn.query("SELECT COUNT(*) as c FROM analytics_whatsapp WHERE DATE(timestamp) = ?", [today]);
    const [last30V] = await conn.query("SELECT COUNT(*) as c FROM analytics_visits WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    const [last30C] = await conn.query("SELECT COUNT(*) as c FROM analytics_whatsapp WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    const [totalV] = await conn.query("SELECT COUNT(*) as c FROM analytics_visits");
    const [totalC] = await conn.query("SELECT COUNT(*) as c FROM analytics_whatsapp");

    // Chart: last 30 days
    const [vByDay] = await conn.query(
      "SELECT DATE(timestamp) as d, COUNT(*) as c FROM analytics_visits WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(timestamp)"
    );
    const [cByDay] = await conn.query(
      "SELECT DATE(timestamp) as d, COUNT(*) as c FROM analytics_whatsapp WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(timestamp)"
    );

    const vMap: Record<string, number> = {};
    const cMap: Record<string, number> = {};
    for (const r of vByDay as { d: string; c: number }[]) vMap[new Date(r.d).toISOString().split("T")[0]] = r.c;
    for (const r of cByDay as { d: string; c: number }[]) cMap[new Date(r.d).toISOString().split("T")[0]] = r.c;

    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().split("T")[0];
      chartData.push({
        date: key,
        label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        visits: vMap[key] || 0,
        whatsapp: cMap[key] || 0,
      });
    }

    // Recent WhatsApp
    const [recentWpp] = await conn.query("SELECT timestamp, page FROM analytics_whatsapp ORDER BY id DESC LIMIT 20");

    // Day detail
    let dayDetail = null;
    if (selectedDate) {
      const [dv] = await conn.query("SELECT COUNT(*) as c FROM analytics_visits WHERE DATE(timestamp) = ?", [selectedDate]);
      const [dc] = await conn.query("SELECT COUNT(*) as c FROM analytics_whatsapp WHERE DATE(timestamp) = ?", [selectedDate]);
      const [dvList] = await conn.query("SELECT TIME_FORMAT(timestamp, '%H:%i') as time, page, referrer FROM analytics_visits WHERE DATE(timestamp) = ? ORDER BY timestamp", [selectedDate]);
      const [dcList] = await conn.query("SELECT TIME_FORMAT(timestamp, '%H:%i') as time, page FROM analytics_whatsapp WHERE DATE(timestamp) = ? ORDER BY timestamp", [selectedDate]);
      dayDetail = {
        date: selectedDate,
        visits: (dv as { c: number }[])[0].c,
        whatsappClicks: (dc as { c: number }[])[0].c,
        visitsList: dvList,
        clicksList: dcList,
      };
    }

    // Days with data for calendar
    const [dVisits] = await conn.query("SELECT DATE(timestamp) as d, COUNT(*) as c FROM analytics_visits GROUP BY DATE(timestamp)");
    const [dClicks] = await conn.query("SELECT DATE(timestamp) as d, COUNT(*) as c FROM analytics_whatsapp GROUP BY DATE(timestamp)");
    const daysWithData: Record<string, { visits: number; clicks: number }> = {};
    for (const r of dVisits as { d: string; c: number }[]) {
      const k = new Date(r.d).toISOString().split("T")[0];
      daysWithData[k] = { visits: r.c, clicks: 0 };
    }
    for (const r of dClicks as { d: string; c: number }[]) {
      const k = new Date(r.d).toISOString().split("T")[0];
      if (!daysWithData[k]) daysWithData[k] = { visits: 0, clicks: 0 };
      daysWithData[k].clicks = r.c;
    }

    return NextResponse.json({
      totalVisits: (totalV as { c: number }[])[0].c,
      totalClicks: (totalC as { c: number }[])[0].c,
      todayVisits: (todayV as { c: number }[])[0].c,
      todayClicks: (todayC as { c: number }[])[0].c,
      last30Visits: (last30V as { c: number }[])[0].c,
      last30Clicks: (last30C as { c: number }[])[0].c,
      chartData,
      recentWhatsApp: recentWpp,
      dayDetail,
      daysWithData,
    });
  } catch (err) {
    console.error("Analytics GET error:", err);
    return NextResponse.json({ error: "Erro ao ler analytics" }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

export async function POST(request: Request) {
  let conn;
  try {
    conn = await pool.getConnection();
    const body = await request.json();

    if (body.type === "visit") {
      await conn.query("INSERT INTO analytics_visits (page, referrer, user_agent) VALUES (?, ?, ?)", [body.page || "/", body.referrer || "", body.userAgent || ""]);
    } else if (body.type === "whatsapp") {
      await conn.query("INSERT INTO analytics_whatsapp (page) VALUES (?)", [body.page || "/"]);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Analytics POST error:", err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
