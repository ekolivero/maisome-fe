import React from 'react';
import { components } from "@/app/types/schema"
import { SearchParamsProps } from '../page';
import client from "@/app/utils/client";
import DeleteLocationBadge from './delete-location-badge';

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
    searchParams
}: {
    location: Location,
    searchParams: SearchParamsProps
}) {

    const { id: locationId } = location;
    const ids = Array.isArray(searchParams.ids) ? searchParams.ids : [searchParams.ids].filter(Boolean);
    const hasMultipleLocations = ids.length > 1;

    const { data } = await client.GET("/houses/location_ids/", {
        params: {
            query: {
                ...searchParams,
                ids: hasMultipleLocations ? searchParams.ids : [locationId],
                per_page: 42,
            },
        }
    })

    const locations = await Promise.allSettled(ids.map((id) => resolveLocations(id)));
    const resolvedLocations = locations
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);


    const totalResults = data?.total_results

    return (
        <div className="w-full px-4 justify-center align-middle">
            <h3 className="text-2xl font-bold mb-2 text-primary">
                {totalResults} case in vendita a{hasMultipleLocations ? ':' : ` ${location.label}`}
            </h3>
            <div className="mt-2">
                {hasMultipleLocations && (
                    <DeleteLocationBadge resolvedLocations={resolvedLocations} />
                )}
            </div>
        </div>
    );
}
