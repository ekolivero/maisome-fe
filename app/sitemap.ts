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

  // Add region and province sitemaps
  data.forEach((region) => {
    sitemaps.push({ id: `region-${region.url}` });
    region.province.forEach((province) => {
      sitemaps.push({ id: `province-${region.url}-${province.url}` });
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
    // Root sitemap with homepage and region pages
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      // Add region pages
      ...data.map((region) => ({
        url: `${BASE_URL}/${region.url}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
      // Links to region sitemaps
      ...data.map((region) => ({
        url: `${BASE_URL}/sitemap/region-${region.url}.xml`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ];
  }

  if (id.startsWith("region-")) {
    const regionUrl = id.replace("region-", "");
    const region = data.find((r) => r.url === regionUrl);

    if (!region) return [];

    return [
      // Add province pages
      ...region.province.map((province) => ({
        url: `${BASE_URL}/${region.url}/${province.url}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      // Links to province sitemaps
      ...region.province.map((province) => ({
        url: `${BASE_URL}/sitemap/province-${region.url}-${province.url}.xml`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ];
  }

  if (id.startsWith("province-")) {
    // Extract the region and province URLs
    // The current split isn't handling the full province URL correctly
    const parts = id.replace("province-", "").split("-");
    const regionUrl = parts[0];
    const provinceUrl = parts.slice(1).join("-"); // Handle province URLs that might contain hyphens
    
    const region = data.find((r) => r.url === regionUrl);
    const province = region?.province.find((p) => p.url === provinceUrl);

    if (!province || !region) return [];

    return [
      // Add the province landing page
      {
        url: `${BASE_URL}/${region.url}/${province.url}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      // Add all comuni pages for this province
      ...province.comuni.map((comune) => ({
        url: `${BASE_URL}/${region.url}/${province.url}/${comune.url}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      })),
    ];
  }

  return [];
}
