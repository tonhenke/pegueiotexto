import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://pegueiotexto.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/afiliados/painel",
          "/afiliados/admin",
          "/t/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
