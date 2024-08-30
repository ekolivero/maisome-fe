import React from 'react';
import { components } from "@/app/types/schema"
import client from "@/app/utils/client";
import DeleteLocationBadge from './delete-location-badge';
import { searchParamsCache } from '@/lib/nuqs/searchParams';

type Location = components["schemas"]["Location"];

async function resolveLocations(id: string) {
    const { data } = await client.GET("/locations/lookup_page/", {
        params: {
            query: {
                id,
            }
        }
    });
    return data?.location
}

export async function HeaderTitle({
    location,
}: {
    location: Location,
}) {

    const searchParams = searchParamsCache.all();

    const { id: locationId } = location;
    const ids = Array.isArray(searchParams.ids) ? searchParams.ids : [searchParams.ids].filter(Boolean);
    const hasMultipleLocations = ids.length > 1;

    const { data } = await client.GET("/houses/location_ids/", {
        params: {
            query: {
                ...searchParams,
                ids: hasMultipleLocations ? searchParams.ids! : [locationId],
                per_page: 42,
                page_number: searchParams.page_number ?? undefined,
            },
        }
    })

    const locations = await Promise.allSettled(ids.filter((id): id is string => id !== null).map(resolveLocations));
    const resolvedLocations = locations
        .filter((result): result is PromiseFulfilledResult<Location> => result.status === 'fulfilled')
        .map(result => result.value);


    const totalResults = data?.total_results

    return (
        <div className="w-full px-4 justify-center align-middle">
            <h1 className="text-2xl font-bold mb-2 text-primary">
                {totalResults?.toLocaleString('it-IT')} Case in Vendita {hasMultipleLocations ? 'nelle Zone Selezionate' : `a ${location.label}`}
            </h1>
            {hasMultipleLocations ? (
                <p className="text-lg text-gray-600 mb-4">
                    Esplora le migliori opportunità immobiliari nelle aree da te scelte
                </p>
            ) : (
                <p className="text-lg text-gray-600 mb-4">
                    Scopri le migliori offerte immobiliari a {location.label}
                </p>
            )}
            <div className="mt-2">
                {hasMultipleLocations && (
                    <DeleteLocationBadge resolvedLocations={resolvedLocations} />
                )}
            </div>
        </div>
    );
}
