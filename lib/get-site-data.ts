import { db } from "./prisma";

export async function getSiteData() {
  try {
    const prisma = db();
    const company = await prisma.companyData.findFirst();
    const schedule = await prisma.schedule.findMany({ orderBy: { id: "asc" } });
    const reviews = await prisma.review.findMany({ orderBy: { id: "asc" } });
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    const features = await prisma.aboutFeature.findMany({ orderBy: { id: "asc" } });

    const msg = company?.whatsappMessage || "Olá, Quero saber mais de como funciona !";

    return {
      companyData: {
        name: company?.name || "Agrocomercial Carvalho",
        slogan: company?.slogan || "",
        address: company?.address || "",
        phone: company?.phone || "",
        phoneRaw: company?.phoneRaw || "",
        whatsappLink: `https://wa.me/${company?.phoneRaw || "5551997313009"}?text=${encodeURIComponent(msg)}`,
        whatsappMessage: msg,
        rating: Number(company?.rating) || 4.7,
        reviewCount: company?.reviewCount || 0,
        mapsEmbed: company?.mapsEmbed || "",
        mapsLink: company?.mapsLink || "",
      },
      schedule: schedule.map((s) => ({ day: s.day, hours: s.hours || "", open: s.isOpen })),
      reviews: reviews.map((r) => ({ name: r.name, text: r.text || "", stars: r.stars })),
      products: products.map((p) => ({ emoji: p.emoji || "", name: p.name, description: p.description || "" })),
      aboutFeatures: features.map((f) => ({ emoji: f.emoji || "", title: f.title, description: f.description || "" })),
      navLinks: [
        { label: "Início", href: "#inicio" }, { label: "Sobre", href: "#sobre" },
        { label: "Produtos", href: "#produtos" }, { label: "Serviços", href: "#servicos" },
        { label: "Horários", href: "#horarios" }, { label: "Avaliações", href: "#avaliacoes" },
        { label: "Contato", href: "#contato" },
      ],
    };
  } catch {
    const { companyData, schedule, reviews, products, aboutFeatures, navLinks } = await import("./data");
    return { companyData, schedule, reviews, products, aboutFeatures, navLinks };
  }
}
