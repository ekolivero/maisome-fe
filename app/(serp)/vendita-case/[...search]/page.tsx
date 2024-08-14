import { Suspense } from "react";
import { LoadingListingCard } from "./components/loading-listing-card";
import HouseList from "./components/house-list";
import createClient from "openapi-fetch";
import type { paths } from "@/app/types/schema";
import { operations } from "@/app/types/schema";
import { notFound } from "next/navigation";
import { NeighboorsCarousel } from "./components/neighbors-carousel";
import SmartFilter from "./components/smart-filter";

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

export type SearchParamsProps = operations["houses_by_id_houses_location_ids__get"]["parameters"]["query"];

async function ListingItems({ search, searchParams }: { search: string[], searchParams: SearchParamsProps }) {

    const { data: lookupData } = await client.GET("/locations/lookup_id/", {
        params: {
            query: {
                page: search.join("/"),
            }
        }
    })

    if (!lookupData) return notFound();

    const { id: locationId, level: locationLevel, neighbors } = lookupData.location;

    const hasIds = searchParams.ids !== undefined;

    const { data, error } = await client.GET("/houses/location_ids/", {
        params: {
            query: {
                ...searchParams,
                ids: hasIds ? searchParams.ids : [locationId],
            },
        }
    })

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

    return (
        <div className="flex flex-col w-full">
            <HouseList propertyListing={data?.houses} currentPage={currentPage} pageRange={pageRange} totalPages={totalPages} />
            {
                neighbors?.splice(0, 3)?.map((neighbor, index) => (
                    <NeighboorsCarousel key={index} neighbor={neighbor} />
                ))
            }
        </div>
    )
}

export default async function Page({ params: { search }, searchParams }: { params: { search: string[] }, searchParams: SearchParamsProps }) {
    const { data: lookupData } = await client.GET("/locations/lookup_id/", {
        params: {
            query: {
                page: search.join("/"),
            }
        }
    })

    const { location } = lookupData!;

    return (
        <div className="flex flex-1 w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex-col">
            <SmartFilter location={location} />
            <div className="mt-8">
                <div className="flex px-2 md:max-w-xl md:mx-auto h-full">
                    <Suspense fallback={<LoadingListingCard />} key={`${JSON.stringify(searchParams)}`}>
                        <ListingItems search={search} searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>
        </div>

    )
}