import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://drivemaster-app.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/settings",
          "/dashboard",
          "/quiz",
          "/onboarding",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
