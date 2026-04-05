"use server";

import { db } from "./prisma";
import { revalidatePath } from "next/cache";

export async function saveCompanyData(data: {
  name: string; slogan: string; address: string; phone: string; phoneRaw: string;
  whatsappMessage: string; rating: number; reviewCount: number; mapsEmbed: string; mapsLink: string;
}) {
  try {
    await db().companyData.update({
      where: { id: 1 },
      data: {
        name: data.name, slogan: data.slogan, address: data.address,
        phone: data.phone, phoneRaw: data.phoneRaw, whatsappMessage: data.whatsappMessage,
        rating: data.rating, reviewCount: data.reviewCount,
        mapsEmbed: data.mapsEmbed, mapsLink: data.mapsLink,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao salvar" };
  }
}

export async function saveSchedule(schedule: { day: string; hours: string; open: boolean }[]) {
  try {
    await db().schedule.deleteMany();
    await db().schedule.createMany({
      data: schedule.map((s) => ({ day: s.day, hours: s.hours, isOpen: s.open })),
    });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao salvar" };
  }
}

export async function saveReviews(reviews: { name: string; text: string; stars: number }[]) {
  try {
    await db().review.deleteMany();
    await db().review.createMany({ data: reviews });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao salvar" };
  }
}
