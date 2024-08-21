import { Suspense } from "react";
import { LoadingListingCard } from "./components/loading-listing-card";
import HouseList from "./components/house-list";
import createClient from "openapi-fetch";
import type { paths } from "@/app/types/schema";
import { operations } from "@/app/types/schema";
import { notFound } from "next/navigation";
import { NeighboorsCarousel } from "./components/neighbors-carousel";
import SmartFilter from "./components/smart-filter";
import SEO from "./components/seo";

export type SearchParamsProps = operations["houses_by_id_houses_location_ids__get"]["parameters"]["query"];

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

import type { Metadata, ResolvingMetadata } from 'next'
import { BreadcrumbsParentAndChildren } from "./components/breadcrumb-list";
import { createBreadcrumbJsonLD, createItemListJsonLD } from "./utils/breadcrumb";

type Props = {
    params: { search: string[] }
    searchParams: SearchParamsProps
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const { data: lookupData } = await client.GET("/locations/lookup_id/", {
        params: {
            query: {
                page: params.search.join("/"),
            }
        }
    })

    const { data } = await client.GET("/houses/location_ids/", {
        params: {
            query: {
                ...searchParams,
                ids: [lookupData?.location.id!]
            },
        },
    })

    const formattedTitle = `${data?.total_results} case in vendita a ${lookupData?.location.label}`

    const previousImages = (await parent).openGraph?.images || []

    return {
        title: formattedTitle,
        publisher: 'Maisome.com - Case in vendita',
        category: 'Real Estate in Italy',
        description: `Scopri ${data?.total_results} case in vendita a ${lookupData?.location.label} su Maisome.com`,
        openGraph: {
            images: [...previousImages],
        },
    }
}

async function ListingItems({ search, searchParams }: { search: string[], searchParams: SearchParamsProps }) {

    const { data: lookupData } = await client.GET("/locations/lookup_id/", {
        params: {
            query: {
                page: search.join("/"),
            }
        }    
    })

    if (!lookupData) return notFound();

    const { id: locationId, neighbors } = lookupData.location;

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

    const breadcrumbJsonLD = createBreadcrumbJsonLD(lookupData.location);

    const listingJsonLD = createItemListJsonLD({
        propertyListing: data?.houses,
        currentPage: currentPage,
        pageSize: data?.per_page,
        totalResults: data?.total_results,
        baseUrl: `https://maisome.com/vendita-case/${lookupData.page}`,
    });

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={listingJsonLD}
                key="srp-collection-page"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={breadcrumbJsonLD}
                key="srp-breadcrumb-jsonld"
            />
        <div className="flex flex-col w-full">
            <HouseList propertyListing={data?.houses} currentPage={currentPage} pageRange={pageRange} totalPages={totalPages} />
                {neighbors
                    ?.filter(neighbor => !searchParams.ids?.includes(neighbor.id))
                    .splice(0, 2)
                    ?.map((neighbor, index) => (
                        <NeighboorsCarousel key={neighbor.id} neighbor={neighbor} />
                    ))
                }
        </div>
        </section>
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
        <>
            <div className="flex flex-1 w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex-col">
                <SmartFilter location={location} />
                <div className="mt-6">
                    <div className="flex px-2 md:max-w-xl md:mx-auto h-full flex-col gap-6">
                        <Suspense fallback={<LoadingListingCard />} key={`${JSON.stringify(searchParams)}`}>
                            <BreadcrumbsParentAndChildren location={lookupData?.location!} />
                            <ListingItems search={search} searchParams={searchParams} />
                            <SEO location={lookupData?.location!} city={lookupData?.page!} page={lookupData?.page!} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    )
}