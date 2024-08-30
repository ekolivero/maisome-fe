import HouseList from "@/app/(serp)/vendita-case/[...search]/components/house-list";
import { notFound } from "next/navigation";
import { NeighboorsCarousel } from "@/app/(serp)/vendita-case/[...search]/components/neighbors-carousel";
import client from "@/app/utils/client";
import { createItemListJsonLD } from "@/app/(serp)/vendita-case/[...search]/utils/breadcrumb";
import { searchParamsCache } from "@/lib/nuqs/searchParams";
import { fetchHouses, fetchLookupData } from "../utils/fetch";

export async function HouseListing({ search }: { search: string[] }) {

    const searchParams = searchParamsCache.all();

    const { data: lookupData } = await fetchLookupData(search)

    if (!lookupData) return notFound();

    const { id: locationId, neighbors } = lookupData.location;

    const hasIds = searchParams.ids !== null;

    const { data, error } = await fetchHouses(hasIds ? searchParams.ids! : [locationId])

    if (error) return notFound();

    const currentPage = data?.page_number!
    const totalPages = data?.total_pages!

    const getPageRange = (current: number, total: number) => {
        if (current === undefined) return [];
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const pageRange = getPageRange(currentPage, totalPages);

    const jsonLd = createItemListJsonLD({
        propertyListing: data?.houses,
        currentPage: currentPage,
        pageSize: data?.per_page,
        totalResults: data?.total_results,
        baseUrl: `https://maisome.com/vendita-case/${lookupData.page}`,
        location: lookupData.location
    });

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd}
                key="srp-collection-page"
            />
            <div className="flex flex-col w-full">
                <HouseList propertyListing={data?.houses} currentPage={currentPage} pageRange={pageRange} totalPages={totalPages} />
                {neighbors
                    ?.filter(neighbor => !searchParams.ids?.includes(neighbor.id))
                    .splice(0, 2)
                    ?.map((neighbor) => (
                        <NeighboorsCarousel key={neighbor.id} neighbor={neighbor} />
                    ))
                }
            </div>
        </section>
    )
}