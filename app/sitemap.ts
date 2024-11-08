import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";

const BASE_URL =
  `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` ||
  "http://localhost:3000";

type Region = {
  name: string;
  url: string;
  province: Province[];
};

type Province = {
  name: string;
  url: string;
  comuni: Comune[];
};

type Comune = {
  name: string;
  url: string;
};

type SitemapItem = {
  url: string;
  lastModified: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

function loadJsonData(filePath: string): Region[] {
  const fullPath = path.join(process.cwd(), filePath);
  const jsonString = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(jsonString) as Region[];
}

export async function generateSitemaps() {
  const data = loadJsonData("app/sitemap/sitemap.json");
  const sitemaps = [{ id: "index" }];

  // Add region and province sitemaps with simplified IDs
  data.forEach((region) => {
    sitemaps.push({ id: region.url });
    region.province.forEach((province) => {
      sitemaps.push({ id: province.url });
    });
  });

  const sitemapListPath = path.join(process.cwd(), "app/sitemap/sitemap-list.json");
  fs.writeFileSync(sitemapListPath, JSON.stringify(sitemaps, null, 2));

  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const data = loadJsonData("app/sitemap/sitemap.json");

  if (id === "index") {
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      // Region pages with lower priority
      ...data.map((region) => ({
        url: `${BASE_URL}/vendita-case/${region.url}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      // Links to region sitemaps with simplified URLs
      ...data.map((region) => ({
        url: `${BASE_URL}/sitemap/${region.url}.xml`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ];
  }

  // Region sitemap
  const region = data.find((r) => r.url === id);
  if (region) {
    return [
      ...region.province.map((province) => ({
        url: `${BASE_URL}/vendita-case/${province.url}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      // Links to province sitemaps with simplified URLs
      ...region.province.map((province) => ({
        url: `${BASE_URL}/sitemap/${province.url}.xml`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ];
  }

  // Province sitemap
  for (const region of data) {
    const province = region.province.find((p) => p.url === id);
    if (province) {
      return [
        {
          url: `${BASE_URL}/vendita-case/${province.url}`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.8,
        },
        ...province.comuni.map((comune) => ({
          url: `${BASE_URL}/vendita-case/${comune.url}`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.9,
        })),
      ];
    }
  }

  return [];
}
