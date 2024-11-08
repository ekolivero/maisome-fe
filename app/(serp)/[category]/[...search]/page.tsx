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
import { FooterComponent } from "@/components/footer";
import { getHouseTypeFromString } from '@/lib/types/house-enum';
import { notFound } from "next/navigation";

export type SearchParamsProps = operations["houses_by_id_houses_location_ids__get"]["parameters"]["query"];

const BASE_URL =
    `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` ||
    "http://localhost:3000";

type Props = {
    params: { search: string[], category: string }
    searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const category = getHouseTypeFromString(params.category);
    
    const hasMultipleLocations = searchParams.ids !== undefined && searchParams.ids.length > 1;
    const parsedSearchParams = searchParamsCache.parse(searchParams);

    const { data: lookupData } = await fetchLookupData(params.search)
    const { data: housesData } = await fetchHouses(hasMultipleLocations ? parsedSearchParams.ids! : [lookupData?.location.id!], category.singular)

    const formattedTitle = `Case in vendita a ${lookupData?.location.label}`;
    const previousImages = (await parent).openGraph?.images || []

    const canonicalUrl = `${BASE_URL}/vendita-case/${lookupData?.page}`

    return {
        title: formattedTitle,
        publisher: 'Maisome.com - Case in vendita',
        category: 'Immobili in vendita in Italia',
        description: `Cerca e trova case in vendita a ${lookupData?.location.label}. ${housesData?.total_results.toLocaleString('it-IT')} annunci immobiliari selezionati per te. Scopri le migliori offerte su Maisome.com`,
        openGraph: {
            images: [...previousImages],
        },
        alternates: {
            canonical: canonicalUrl
        }
    }
}

export default async function Page({ params: { search, category }, searchParams }: { params: { search: string[], category: string }, searchParams: Record<string, string | string[] | undefined> }) {

    const { data: lookupData } = await fetchLookupData(search)

    if (lookupData?.location.id === '') return notFound()

    const parsedSearchParams = searchParamsCache.parse(searchParams);
    const { location } = lookupData!;

    const houseCategory = getHouseTypeFromString(category);

    return (
        <>
            <div className="flex flex-1 w-full flex-col">
                <Header location={location} />
                <div className="mt-6 w-full md:max-w-screen-2xl mx-auto">
                    <div className="flex h-full flex-col gap-2 md:gap-6">
                        <Suspense fallback={<LoadingListingCard />} key={`${JSON.stringify(parsedSearchParams)}`}>
                            <BreadcrumbsParentAndChildren location={lookupData?.location!} />
                            <HeaderTitle location={lookupData?.location!} category={houseCategory} />
                            <HouseListing search={search} category={houseCategory} />
                            <SEO location={lookupData?.location!} city={lookupData?.page!} page={lookupData?.page!} /> 
                        </Suspense>
                    </div>
                </div>
                <FooterComponent />
            </div>
        </>
    )
}