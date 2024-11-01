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

  // For each region, create a region sitemap, and for each province, create a province sitemap
  data.forEach((region) => {
    sitemaps.push({ id: `region-${region.url}` }); // region sitemap (e.g., region-piemonte.xml)

    region.province.forEach((province) => {
      sitemaps.push({ id: `province-${region.url}-${province.url}` }); // province sitemap (e.g., province-piemonte-alessandria.xml)
    });
  });

  // Save the generated sitemap list
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
    // Index sitemap that links to each region’s sitemap
    return [
      {
        url: `${BASE_URL}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      ...data.map((region) => ({
        url: `${BASE_URL}/sitemap/${region.url}.xml`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  }

  if (id.startsWith("region-")) {
    // Extract the region URL
    const regionUrl = id.replace("region-", "");
    const region = data.find((r) => r.url === regionUrl);

    if (!region) return [];

    return region.province.map((province) => ({
      url: `${BASE_URL}/sitemap/${region.url}/${province.url}.xml`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) as MetadataRoute.Sitemap;
  }

  if (id.startsWith("province-")) {
    // Extract the region and province URLs
    const [, regionUrl, provinceUrl] = id.split("-");
    const region = data.find((r) => r.url === regionUrl);
    const province = region?.province.find((p) => p.url === provinceUrl);

    if (!province) return [];

    return province.comuni.map((comune) => ({
      url: `${BASE_URL}/vendita-case/${regionUrl}/${provinceUrl}/${comune.url}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })) as MetadataRoute.Sitemap;
  }

  return [];
}
