import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "lib", "data.ts");

export async function GET() {
  try {
    const content = await readFile(DATA_PATH, "utf-8");
    // Parse companyData
    const companyMatch = content.match(
      /export const companyData = ({[\s\S]*?});/
    );
    const reviewsMatch = content.match(
      /export const reviews = (\[[\s\S]*?\]);/
    );
    const scheduleMatch = content.match(
      /export const schedule = (\[[\s\S]*?\]);/
    );

    // Use Function constructor to safely evaluate the object literals
    const companyData = companyMatch
      ? new Function(`return ${companyMatch[1]}`)()
      : null;
    const reviews = reviewsMatch
      ? new Function(`return ${reviewsMatch[1]}`)()
      : [];
    const schedule = scheduleMatch
      ? new Function(`return ${scheduleMatch[1]}`)()
      : [];

    return NextResponse.json({ companyData, reviews, schedule });
  } catch {
    return NextResponse.json({ error: "Erro ao ler dados" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyData, reviews, schedule } = body;

    const content = await readFile(DATA_PATH, "utf-8");

    let updated = content;

    if (companyData) {
      const whatsappLink = `https://wa.me/${companyData.phoneRaw}?text=${encodeURIComponent(companyData.whatsappMessage || "Olá, Quero saber mais de como funciona !")}`;
      const companyStr = `export const companyData = {
  name: ${JSON.stringify(companyData.name)},
  slogan: ${JSON.stringify(companyData.slogan)},
  address: ${JSON.stringify(companyData.address)},
  phone: ${JSON.stringify(companyData.phone)},
  phoneRaw: ${JSON.stringify(companyData.phoneRaw)},
  whatsappLink: ${JSON.stringify(whatsappLink)},
  rating: ${companyData.rating},
  reviewCount: ${companyData.reviewCount},
  mapsEmbed:
    ${JSON.stringify(companyData.mapsEmbed)},
  mapsLink:
    ${JSON.stringify(companyData.mapsLink)},
};`;
      updated = updated.replace(
        /export const companyData = {[\s\S]*?};/,
        companyStr
      );
    }

    if (reviews) {
      const reviewsStr = `export const reviews = ${JSON.stringify(reviews, null, 2)};`;
      updated = updated.replace(
        /export const reviews = \[[\s\S]*?\];/,
        reviewsStr
      );
    }

    if (schedule) {
      const scheduleStr = `export const schedule = ${JSON.stringify(schedule, null, 2)};`;
      updated = updated.replace(
        /export const schedule = \[[\s\S]*?\];/,
        scheduleStr
      );
    }

    await writeFile(DATA_PATH, updated, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar dados" },
      { status: 500 }
    );
  }
}
