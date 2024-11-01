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

  data.forEach((region) => {
    sitemaps.push({ id: `region__${region.url}` });
  });

  // Store the generated sitemap list in a file
  const sitemapListPath = path.join(
    process.cwd(),
    "app/sitemap/sitemap-list.json"
  );
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
        url: `${BASE_URL}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      ...data.map((region) => ({
        url: `${BASE_URL}/vendita-case/${region.url}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      })),
    ] as MetadataRoute.Sitemap;
  }

  const [, regionUrl] = id.split("__");
  const region = data.find((r) => r.url === regionUrl);

  if (!region) {
    return [];
  }

  const sitemap: SitemapItem[] = [
    {
      url: `${BASE_URL}/vendita-case/${region.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  region.province.forEach((province) => {
    sitemap.push({
      url: `${BASE_URL}/vendita-case/${region.url}/${province.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });

    province.comuni.forEach((comune) => {
      sitemap.push({
        url: `${BASE_URL}/vendita-case/${region.url}/${province.url}/${comune.url}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    });
  });

  return sitemap as MetadataRoute.Sitemap;
}
