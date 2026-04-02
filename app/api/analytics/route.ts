import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get("date");
  const conn = await pool.getConnection();

  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Today stats
    const [todayVisitsRows] = await conn.query(
      "SELECT COUNT(*) as c FROM analytics_visits WHERE DATE(timestamp) = ?", [today]
    );
    const [todayClicksRows] = await conn.query(
      "SELECT COUNT(*) as c FROM analytics_whatsapp WHERE DATE(timestamp) = ?", [today]
    );

    // Last 30 days
    const [last30VisitsRows] = await conn.query(
      "SELECT COUNT(*) as c FROM analytics_visits WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
    );
    const [last30ClicksRows] = await conn.query(
      "SELECT COUNT(*) as c FROM analytics_whatsapp WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
    );

    // Chart data (last 30 days grouped by day)
    const [visitsByDay] = await conn.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as visits FROM analytics_visits
       WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(timestamp)`
    );
    const [clicksByDay] = await conn.query(
      `SELECT DATE(timestamp) as date, COUNT(*) as clicks FROM analytics_whatsapp
       WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(timestamp)`
    );

    const visitMap: Record<string, number> = {};
    const clickMap: Record<string, number> = {};
    (visitsByDay as { date: string; visits: number }[]).forEach((r) => {
      visitMap[new Date(r.date).toISOString().split("T")[0]] = r.visits;
    });
    (clicksByDay as { date: string; clicks: number }[]).forEach((r) => {
      clickMap[new Date(r.date).toISOString().split("T")[0]] = r.clicks;
    });

    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      chartData.push({
        date: key,
        label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        visits: visitMap[key] || 0,
        whatsapp: clickMap[key] || 0,
      });
    }

    // Recent WhatsApp
    const [recentWpp] = await conn.query(
      "SELECT timestamp, page FROM analytics_whatsapp ORDER BY id DESC LIMIT 20"
    );

    // Day detail
    let dayDetail = null;
    if (selectedDate) {
      const [dv] = await conn.query(
        "SELECT COUNT(*) as c FROM analytics_visits WHERE DATE(timestamp) = ?", [selectedDate]
      );
      const [dc] = await conn.query(
        "SELECT COUNT(*) as c FROM analytics_whatsapp WHERE DATE(timestamp) = ?", [selectedDate]
      );
      const [dvList] = await conn.query(
        "SELECT TIME_FORMAT(timestamp, '%H:%i') as time, page, referrer FROM analytics_visits WHERE DATE(timestamp) = ? ORDER BY timestamp", [selectedDate]
      );
      const [dcList] = await conn.query(
        "SELECT TIME_FORMAT(timestamp, '%H:%i') as time, page FROM analytics_whatsapp WHERE DATE(timestamp) = ? ORDER BY timestamp", [selectedDate]
      );
      dayDetail = {
        date: selectedDate,
        visits: (dv as { c: number }[])[0].c,
        whatsappClicks: (dc as { c: number }[])[0].c,
        visitsList: dvList,
        clicksList: dcList,
      };
    }

    // Days with data
    const [daysVisits] = await conn.query(
      "SELECT DATE(timestamp) as date, COUNT(*) as visits FROM analytics_visits GROUP BY DATE(timestamp)"
    );
    const [daysClicks] = await conn.query(
      "SELECT DATE(timestamp) as date, COUNT(*) as clicks FROM analytics_whatsapp GROUP BY DATE(timestamp)"
    );
    const daysWithData: Record<string, { visits: number; clicks: number }> = {};
    (daysVisits as { date: string; visits: number }[]).forEach((r) => {
      const k = new Date(r.date).toISOString().split("T")[0];
      if (!daysWithData[k]) daysWithData[k] = { visits: 0, clicks: 0 };
      daysWithData[k].visits = r.visits;
    });
    (daysClicks as { date: string; clicks: number }[]).forEach((r) => {
      const k = new Date(r.date).toISOString().split("T")[0];
      if (!daysWithData[k]) daysWithData[k] = { visits: 0, clicks: 0 };
      daysWithData[k].clicks = r.clicks;
    });

    // Totals
    const [totalV] = await conn.query("SELECT COUNT(*) as c FROM analytics_visits");
    const [totalC] = await conn.query("SELECT COUNT(*) as c FROM analytics_whatsapp");

    return NextResponse.json({
      totalVisits: (totalV as { c: number }[])[0].c,
      totalClicks: (totalC as { c: number }[])[0].c,
      todayVisits: (todayVisitsRows as { c: number }[])[0].c,
      todayClicks: (todayClicksRows as { c: number }[])[0].c,
      last30Visits: (last30VisitsRows as { c: number }[])[0].c,
      last30Clicks: (last30ClicksRows as { c: number }[])[0].c,
      chartData,
      recentWhatsApp: recentWpp,
      dayDetail,
      daysWithData,
    });
  } finally {
    conn.release();
  }
}

export async function POST(request: Request) {
  const conn = await pool.getConnection();
  try {
    const body = await request.json();

    if (body.type === "visit") {
      await conn.query(
        "INSERT INTO analytics_visits (page, referrer, user_agent) VALUES (?, ?, ?)",
        [body.page || "/", body.referrer || "", body.userAgent || ""]
      );
    } else if (body.type === "whatsapp") {
      await conn.query(
        "INSERT INTO analytics_whatsapp (page) VALUES (?)",
        [body.page || "/"]
      );
    }

    return NextResponse.json({ ok: true });
  } finally {
    conn.release();
  }
}
