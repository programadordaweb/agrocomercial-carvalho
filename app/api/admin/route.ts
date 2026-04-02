import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data.json");

export const dynamic = "force-dynamic";

async function readData() {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Erro ao ler dados" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await readData();

    if (body.companyData) {
      data.companyData = {
        ...data.companyData,
        name: body.companyData.name,
        slogan: body.companyData.slogan,
        address: body.companyData.address,
        phone: body.companyData.phone,
        phoneRaw: body.companyData.phoneRaw,
        whatsappMessage: body.companyData.whatsappMessage || data.companyData.whatsappMessage,
        rating: body.companyData.rating,
        reviewCount: body.companyData.reviewCount,
        mapsEmbed: body.companyData.mapsEmbed,
        mapsLink: body.companyData.mapsLink,
      };
    }

    if (body.reviews) {
      data.reviews = body.reviews;
    }

    if (body.schedule) {
      data.schedule = body.schedule;
    }

    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}
