import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "gustavo_admin_gud",
  password: process.env.DB_PASS || "Ic[kDdj_s0V-}TA9",
  database: process.env.DB_NAME || "gustavo_admin_gudev",
  waitForConnections: true,
  connectionLimit: 5,
});

export default pool;

// ── Helper functions ──

export async function getSiteData() {
  const conn = await pool.getConnection();
  try {
    const [companyRows] = await conn.query("SELECT * FROM company_data LIMIT 1");
    const [scheduleRows] = await conn.query("SELECT * FROM schedule ORDER BY id");
    const [reviewRows] = await conn.query("SELECT * FROM reviews ORDER BY id");
    const [productRows] = await conn.query("SELECT * FROM products ORDER BY id");
    const [featureRows] = await conn.query("SELECT * FROM about_features ORDER BY id");

    const company = (companyRows as Record<string, unknown>[])[0] || null;

    // Build whatsappLink dynamically
    if (company) {
      const msg = (company.whatsapp_message as string) || "Olá, Quero saber mais de como funciona !";
      (company as Record<string, unknown>).whatsappLink = `https://wa.me/${company.phone_raw}?text=${encodeURIComponent(msg)}`;
    }

    return {
      companyData: company
        ? {
            name: company.name,
            slogan: company.slogan,
            address: company.address,
            phone: company.phone,
            phoneRaw: company.phone_raw,
            whatsappLink: (company as Record<string, unknown>).whatsappLink,
            whatsappMessage: company.whatsapp_message,
            rating: company.rating,
            reviewCount: company.review_count,
            mapsEmbed: company.maps_embed,
            mapsLink: company.maps_link,
          }
        : null,
      schedule: (scheduleRows as Record<string, unknown>[]).map((r) => ({
        day: r.day,
        hours: r.hours,
        open: Boolean(r.is_open),
      })),
      reviews: (reviewRows as Record<string, unknown>[]).map((r) => ({
        name: r.name,
        text: r.text,
        stars: r.stars,
      })),
      products: (productRows as Record<string, unknown>[]).map((r) => ({
        emoji: r.emoji,
        name: r.name,
        description: r.description,
      })),
      aboutFeatures: (featureRows as Record<string, unknown>[]).map((r) => ({
        emoji: r.emoji,
        title: r.title,
        description: r.description,
      })),
      navLinks: [
        { label: "Início", href: "#inicio" },
        { label: "Sobre", href: "#sobre" },
        { label: "Produtos", href: "#produtos" },
        { label: "Serviços", href: "#servicos" },
        { label: "Horários", href: "#horarios" },
        { label: "Avaliações", href: "#avaliacoes" },
        { label: "Contato", href: "#contato" },
      ],
    };
  } finally {
    conn.release();
  }
}
