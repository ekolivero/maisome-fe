import { Suspense } from "react";
import ListingCard from "./components/listing-card";
import { LoadingListingCard } from "./components/loading-listing-card";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import SmartFilter from "./components/smart-filter";

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



async function ListingItems({ search }: { search: string[]}) {
    console.log(search.join('/'))
    const response = await fetch(`https://test-locations-kohl.vercel.app/houses/?page=${search.join("/")}`)
    const propertyListing = await response.json() as PropertyListingResponse

    return (
        <div className="flex flex-1 flex-col gap-8">
            <SmartFilter />
            {
                propertyListing.houses.map((house) => (
                    <ListingCard key={house.title} house={house} />
                ))
            }
        </div>
    )
    
}


export default async function Page({ params: { search } }: { params: { search: string[] } }) {

    
    return (
        <div className="flex flex-1 px-4 w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex-col gap-8 pt-8">
            <div className="flex px-2 max-w-xl md:mx-auto">
            <Suspense fallback={<LoadingListingCard />}>
                <ListingItems search={search} />
            </Suspense>
            </div>
        </div>
    )
}