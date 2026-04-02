import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agrocomercial Carvalho",
    short_name: "AgroCarvalho",
    description:
      "Sua loja agropecuária de confiança em Vera Cruz – RS",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f0",
    theme_color: "#2e7d32",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
