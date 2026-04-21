import type { MetadataRoute } from "next";

// TODO: add these routes to the sitemap once their pages exist:
//   /illinois-permit-test
//   /rules-of-the-road
//   /illinois-road-signs
//   /free-illinois-dmv-practice-test

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://drivemaster-app.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
