import { ImagesSliderDemo } from "@/components/image-slider";
import SeoRegionAndProvince from "@/components/seo-region-and-province";
import { FooterComponent } from "@/components/footer";
import { type SearchParams } from 'nuqs/server'
import { searchParamsCache } from '@/lib/nuqs/searchParams'
import { getFilters } from "@/ai/actions/filters";
import SEOMainPage from "@/components/seo-main-page";

type PageProps = {
  searchParams: Promise<SearchParams> // Next.js 15+: async searchParams prop
}


export default async function Home({ 
  searchParams
}: PageProps) {

  // const { q: query } = searchParamsCache.parse(await searchParams)

  // if (query) {
  //   await getFilters({ q: query || "" })
  // }

  return (
    <main className="flex flex-col">
      <ImagesSliderDemo />
      <div className="h-max w-full relative flex flex-col gap-8 pt-8 px-2">
        <SEOMainPage />
      </div>
      <FooterComponent />
    </main>
  );
}
