import { Suspense } from "react";
import ListingCard from "./components/listing-card";
import { LoadingListingCard } from "./components/loading-listing-card";

export type PropertyListing = {
    title: string;
    description: string;
    link: string;
    price: {
        value: number;
        formattedValue: string;
    };
    contract: string;
    yearBuilt: string;
    propertyType: string;
    typology: string;
    condition: string;
    surface: string;
    publicationDate: string;
    image: Array<{
        url: string;
        caption: string;
    }>;
    features: string[];
    rooms: string;
    bedrooms: string;
    bathrooms: string;
    floor: string;
    elevator: string;
    garage: string;
    energy: {
        class: string;
        heating: {
            type: string;
            value: string;
        };
        airConditioning: string;
    };
    advertiser: {
        type: string;
        name: string;
        url: string;
    };
    crawler: {
        id: string;
        source: string;
        timestamp: string;
        url: string;
    };
    location: {
        location: {
            coordinates: {
                latitude: number;
                longitude: number;
            };
            address: string;
            hierarchy: {
                region: {
                    id: string;
                    label: string;
                };
                province: {
                    id: string;
                    label: string;
                };
                city: {
                    id: string;
                    label: string;
                };
            };
        };
    };
}

type PropertyListingResponse = {
    houses: PropertyListing[];
}

const constructUrl = (baseUrl: string, search: string[], prezzoMinimo: string, prezzoMassimo: string) => {
    const url = new URL(baseUrl);
    url.searchParams.set('page', search.join('/'));

    if (prezzoMinimo !== undefined && prezzoMinimo !== '') {
        url.searchParams.set('prezzoMinimo', prezzoMinimo);
    }

    if (prezzoMassimo !== undefined && prezzoMassimo !== '') {
        url.searchParams.set('prezzoMassimo', prezzoMassimo);
    }

    return url.toString();
};

async function ListingItems({ search, prezzoMinimo, prezzoMassimo }: { search: string[], prezzoMinimo: string, prezzoMassimo: string }) {

    const baseUrl = 'https://test-locations-kohl.vercel.app/houses/';
    const url = constructUrl(baseUrl, search, prezzoMinimo, prezzoMassimo);

    const response = await fetch(url);
    const propertyListing = await response.json() as PropertyListingResponse

    return (
        <div className="px-4 flex flex-1 flex-col gap-8">
            {
                propertyListing?.houses?.map((house) => (
                    <ListingCard key={house.title} house={house} />
                ))
            }
        </div>
    )

}


export default async function Page({ params: { search }, searchParams: {
    prezzoMinimo,
    prezzoMassimo
} }: { params: { search: string[] }, searchParams: { prezzoMinimo: string, prezzoMassimo: string} }) {
    return (
        <div className="flex px-2 md:max-w-xl md:mx-auto h-full">
            <Suspense fallback={<LoadingListingCard />} key={`${prezzoMinimo}-${prezzoMassimo}`}>
                <ListingItems search={search} prezzoMinimo={prezzoMinimo} prezzoMassimo={prezzoMassimo} />
            </Suspense>
        </div>
    )
}