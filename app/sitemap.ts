import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "http://localhost:3000";

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
    sitemaps.push({ id: region.url });
    region.province.forEach((province) => {
      sitemaps.push({ id: `${region.url}-${province.url}` });
    });
  });

  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const data = loadJsonData("app/sitemap/sitemap.json");

  if (id === "index") {
    return data.map((region) => ({
      url: `${BASE_URL}/sitemap/${region.url}.xml`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    })) as MetadataRoute.Sitemap;
  }

  const [regionUrl, ...provinceUrlParts] = id.split("-");
  const provinceUrl = provinceUrlParts.join("-"); // Rejoin in case there are hyphens in the province name
  const region = data.find((r) => r.url === regionUrl);

  if (!region) {
    return [];
  }

  if (!provinceUrl) {
    return region.province.map((province) => ({
      url: `${BASE_URL}/sitemap/${region.url}-${province.url}.xml`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })) as MetadataRoute.Sitemap;
  }

  const province = region.province.find((p) => p.url === provinceUrl);

  if (!province) {
    return [];
  }

  const sitemap: SitemapItem[] = [
    {
      url: `${BASE_URL}/${region.url}/${province.url.replace(
        "-provincia",
        ""
      )}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  province.comuni.forEach((comune) => {
    sitemap.push({
      url: `${BASE_URL}/vendita-case/${province.url.replace(
        "-provincia",
        ""
      )}/${comune.url.split("/").pop()}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  return sitemap as MetadataRoute.Sitemap;
}
