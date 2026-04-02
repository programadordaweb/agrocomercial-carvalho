import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    // Build whatsappLink dynamically from stored data
    const msg = data.companyData.whatsappMessage || "Olá, Quero saber mais de como funciona !";
    data.companyData.whatsappLink = `https://wa.me/${data.companyData.phoneRaw}?text=${encodeURIComponent(msg)}`;

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Erro ao ler dados" }, { status: 500 });
  }
}
