import { Suspense } from "react";
import { LoadingListingCard } from "./components/loading-listing-card";
import HouseList from "./components/house-list";
import createClient from "openapi-fetch";
import type { paths } from "@/app/types/schema"; 
import { operations } from "@/app/types/schema";
import { notFound } from "next/navigation";

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

async function ListingItems({ search, searchParams }: { search: string[], searchParams: operations["houses_by_page_houses_page_name_get"]["parameters"]["query"] }) {
    const { data, error } = await client.GET("/houses/page_name", {
        params: {
            query: {
                ...searchParams,
                page_name: search.join("/"),
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
        <HouseList propertyListing={data?.houses} currentPage={currentPage} pageRange={pageRange} totalPages={totalPages} />
    )
}

export default async function Page({ params: { search }, searchParams }: { params: { search: string[] }, searchParams: operations["houses_by_page_houses_page_name_get"]["parameters"]["query"] }) {
    return (
        <div className="flex px-2 md:max-w-xl md:mx-auto h-full">
            <Suspense fallback={<LoadingListingCard />} key={`${JSON.stringify(searchParams)}`}>
                <ListingItems search={search} searchParams={searchParams} />
            </Suspense>
        </div>
    )
}