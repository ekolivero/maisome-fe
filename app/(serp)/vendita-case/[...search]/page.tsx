import { Suspense } from "react";
import { LoadingListingCard } from "./components/loading-listing-card";
import { operations } from "@/app/types/schema";
import type { Metadata, ResolvingMetadata } from 'next'
import { BreadcrumbsParentAndChildren } from "./components/breadcrumb-list";
import Header from "./components/header";
import { HeaderTitle } from "./components/header-title";
import { searchParamsCache } from "@/lib/nuqs/searchParams";
import { HouseListing } from "./components/house-listing";
import SEO from "./components/seo";
import { fetchLookupData } from "./utils/fetch";
import { fetchHouses } from "./utils/fetch";
export type SearchParamsProps = operations["houses_by_id_houses_location_ids__get"]["parameters"]["query"];

type Props = {
    params: { search: string[] }
    searchParams: SearchParamsProps
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const hasMultipleLocations = searchParams.ids !== undefined && searchParams.ids.length > 1;

    const { data: lookupData } = await fetchLookupData(params.search)
    const { data: housesData } = await fetchHouses(hasMultipleLocations ? searchParams.ids : [lookupData?.location.id!])

    const formattedTitle = `${housesData?.total_results} case in vendita a ${lookupData?.location.label}`

    const previousImages = (await parent).openGraph?.images || []

    return {
        title: formattedTitle,
        publisher: 'Maisome.com - Case in vendita',
        category: 'Real Estate in Italy',
        description: `${housesData?.total_results.toLocaleString('it-IT')} annunci di case in vendita a ${lookupData?.location.label}. Scopri tutte le offerte, confronta i prezzi e trova la tua casa ideale su Maisome.com.`,
        openGraph: {
            images: [...previousImages],
        },
    }
}

export default async function Page({ params: { search }, searchParams }: { params: { search: string[] }, searchParams: Record<string, string | string[] | undefined> }) {
    const { data: lookupData } = await fetchLookupData(search)
    searchParamsCache.parse(searchParams);
    const { location } = lookupData!;

    return (
        <>
            <div className="flex flex-1 w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex-col">
                <Header location={location} />
                <div className="mt-6 w-full md:max-w-screen-2xl mx-auto">
                    <div className="flex h-full flex-col gap-6">
                        <Suspense fallback={<LoadingListingCard />} key={`${JSON.stringify(searchParams)}`}>
                            <BreadcrumbsParentAndChildren location={lookupData?.location!} />
                            <HeaderTitle location={lookupData?.location!} />
                            <HouseListing search={search} />
                            <SEO location={lookupData?.location!} city={lookupData?.page!} page={lookupData?.page!} /> 
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    )
}