import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "analytics.json");

interface Visit {
  timestamp: string;
  page: string;
  referrer: string;
  userAgent: string;
}

interface WhatsAppClick {
  timestamp: string;
  page: string;
}

interface AnalyticsData {
  visits: Visit[];
  whatsappClicks: WhatsAppClick[];
}

async function readData(): Promise<AnalyticsData> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { visits: [], whatsappClicks: [] };
  }
}

async function writeData(data: AnalyticsData) {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get("date");
  const data = await readData();

  const now = new Date();
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentVisits = data.visits.filter(
    (v) => new Date(v.timestamp) >= last30
  );
  const recentClicks = data.whatsappClicks.filter(
    (c) => new Date(c.timestamp) >= last30
  );

  // Group by day
  const visitsByDay: Record<string, number> = {};
  const clicksByDay: Record<string, number> = {};

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    visitsByDay[key] = 0;
    clicksByDay[key] = 0;
  }

  recentVisits.forEach((v) => {
    const key = v.timestamp.split("T")[0];
    if (visitsByDay[key] !== undefined) visitsByDay[key]++;
  });

  recentClicks.forEach((c) => {
    const key = c.timestamp.split("T")[0];
    if (clicksByDay[key] !== undefined) clicksByDay[key]++;
  });

  // Today
  const today = now.toISOString().split("T")[0];
  const todayVisits = recentVisits.filter(
    (v) => v.timestamp.split("T")[0] === today
  );
  const todayClicks = recentClicks.filter(
    (c) => c.timestamp.split("T")[0] === today
  );

  // Selected date details
  let dayDetail = null;
  if (selectedDate) {
    const dayVisits = data.visits.filter(
      (v) => v.timestamp.split("T")[0] === selectedDate
    );
    const dayClicks = data.whatsappClicks.filter(
      (c) => c.timestamp.split("T")[0] === selectedDate
    );
    dayDetail = {
      date: selectedDate,
      visits: dayVisits.length,
      whatsappClicks: dayClicks.length,
      visitsList: dayVisits.map((v) => ({
        time: new Date(v.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        page: v.page,
        referrer: v.referrer,
      })),
      clicksList: dayClicks.map((c) => ({
        time: new Date(c.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        page: c.page,
      })),
    };
  }

  // Recent WhatsApp
  const recentWhatsApp = recentClicks
    .slice(-20)
    .reverse()
    .map((c) => ({ timestamp: c.timestamp, page: c.page }));

  // Days that have data (for calendar highlighting)
  const daysWithData: Record<string, { visits: number; clicks: number }> = {};
  data.visits.forEach((v) => {
    const key = v.timestamp.split("T")[0];
    if (!daysWithData[key]) daysWithData[key] = { visits: 0, clicks: 0 };
    daysWithData[key].visits++;
  });
  data.whatsappClicks.forEach((c) => {
    const key = c.timestamp.split("T")[0];
    if (!daysWithData[key]) daysWithData[key] = { visits: 0, clicks: 0 };
    daysWithData[key].clicks++;
  });

  return NextResponse.json({
    totalVisits: data.visits.length,
    totalClicks: data.whatsappClicks.length,
    todayVisits: todayVisits.length,
    todayClicks: todayClicks.length,
    last30Visits: recentVisits.length,
    last30Clicks: recentClicks.length,
    chartData: Object.entries(visitsByDay).map(([date, visits]) => ({
      date,
      label: new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      visits,
      whatsapp: clicksByDay[date] || 0,
    })),
    recentWhatsApp,
    dayDetail,
    daysWithData,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData();

  if (body.type === "visit") {
    data.visits.push({
      timestamp: new Date().toISOString(),
      page: body.page || "/",
      referrer: body.referrer || "",
      userAgent: body.userAgent || "",
    });
  } else if (body.type === "whatsapp") {
    data.whatsappClicks.push({
      timestamp: new Date().toISOString(),
      page: body.page || "/",
    });
  }

  await writeData(data);
  return NextResponse.json({ ok: true });
}
