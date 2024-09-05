/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/locations/suggest/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Suggest */
        get: operations["suggest_locations_suggest__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/locations/lookup_id/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lookup */
        get: operations["lookup_locations_lookup_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/locations/lookup_page/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lookup */
        get: operations["lookup_locations_lookup_page__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/houses/location_ids/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Houses By Id */
        get: operations["houses_by_id_houses_location_ids__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/houses/aggregation/location_ids": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Houses Aggregation By Id */
        get: operations["houses_aggregation_by_id_houses_aggregation_location_ids_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/houses/aggregation/homepage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Houses Aggregation By Regions And Provinces */
        get: operations["houses_aggregation_by_regions_and_provinces_houses_aggregation_homepage_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** BaseLocation */
        BaseLocation: {
            /** Id */
            id: string;
            /** Label */
            label: string;
            /** Level */
            level: number;
            /** Page */
            page: string;
        };
        /** Coordinates */
        Coordinates: {
            /** Latitude */
            latitude: number;
            /** Longitude */
            longitude: number;
        };
        /** FeatureAggregationBucket */
        FeatureAggregationBucket: {
            /** Key */
            key: string;
            /** Count */
            count: number;
            range?: components["schemas"]["FeatureRange"] | null;
        };
        /** FeatureAggregationResponse */
        FeatureAggregationResponse: {
            /** Ids */
            ids: string[];
            /** Aggregation */
            aggregation: {
                [key: string]: components["schemas"]["FeatureAggregationBucket"][];
            };
        };
        /** FeatureRange */
        FeatureRange: {
            /** Min */
            min: number | null;
            /** Max */
            max: number | null;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** HomeAggregationProvince */
        HomeAggregationProvince: {
            /** Province */
            province: string;
            /** Count */
            count: number;
        };
        /** HomeAggregationRegion */
        HomeAggregationRegion: {
            /** Region */
            region: string;
            /** Count */
            count: number;
            /** Provinces */
            provinces: components["schemas"]["HomeAggregationProvince"][];
        };
        /** HomeAggregationResponse */
        HomeAggregationResponse: {
            /** Aggregation */
            aggregation: components["schemas"]["HomeAggregationRegion"][];
        };
        /** House */
        House: {
            /** Title */
            title: string;
            /**
             * Description
             * @default
             */
            description: string;
            location: components["schemas"]["LocationInfo"];
            /** Link */
            link: string;
            /** Image */
            image: string;
            /** Images */
            images: components["schemas"]["Image"][];
            /** Category */
            category: string;
            price: components["schemas"]["Price"];
            /** Contract */
            contract: string;
            /** Condition */
            condition: string;
            surface: components["schemas"]["Surface"];
            /** Rooms */
            rooms: string;
            /** Bedrooms */
            bedrooms: string;
            /** Bathrooms */
            bathrooms: string;
            /** Furniture */
            furniture?: string | null;
            /** Balcony */
            balcony?: string | null;
            /** Terrace */
            terrace?: string | null;
            /** Elevator */
            elevator?: string | null;
        };
        /** HousesResponse */
        HousesResponse: {
            /** Ids */
            ids: string[];
            /** Houses */
            houses: components["schemas"]["House"][];
            /** Page Number */
            page_number: number;
            /** Per Page */
            per_page: number;
            /** Total Results */
            total_results: number;
            /** Total Pages */
            total_pages: number;
        };
        /** Image */
        Image: {
            /** Id */
            id: string;
            /** Url */
            url: string;
            /** Caption */
            caption: string;
        };
        /** Location */
        Location: {
            /** Id */
            id: string;
            /** Label */
            label: string;
            /** Level */
            level: number;
            /** Page */
            page: string;
            /** Parents */
            parents?: components["schemas"]["BaseLocation"][] | null;
            /** Children */
            children?: components["schemas"]["BaseLocation"][] | null;
            /** Neighbors */
            neighbors?: components["schemas"]["BaseLocation"][] | null;
        };
        /** LocationHierarchy */
        LocationHierarchy: {
            /** Id */
            id: string;
            /** Label */
            label: string;
            /** Level */
            level: string;
        };
        /** LocationInfo */
        LocationInfo: {
            coordinates: components["schemas"]["Coordinates"];
            /** Hierarchy */
            hierarchy: {
                [key: string]: components["schemas"]["LocationHierarchy"];
            };
        };
        /** LookupIdResponse */
        LookupIdResponse: {
            /** Page */
            page: string;
            location: components["schemas"]["Location"];
        };
        /** LookupPageResponse */
        LookupPageResponse: {
            /** Id */
            id: string;
            location: components["schemas"]["Location"];
        };
        /** Price */
        Price: {
            /** Value */
            value?: number | null;
            /** Text */
            text: string;
            /** Enum */
            enum: string;
        };
        /** SuggestResponse */
        SuggestResponse: {
            /** Query */
            query: string;
            /** Suggestions */
            suggestions: components["schemas"]["Suggestion"][];
        };
        /** Suggestion */
        Suggestion: {
            /** Id */
            id: string;
            /** Label */
            label: string;
            /** Level */
            level: number;
            /** Page */
            page: string;
            /** Autocomplete */
            autocomplete: string;
        };
        /** Surface */
        Surface: {
            /** Value */
            value: number;
            /** Text */
            text: string;
            /** Enum */
            enum: string;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    suggest_locations_suggest__get: {
        parameters: {
            query: {
                query: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuggestResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    lookup_locations_lookup_id__get: {
        parameters: {
            query: {
                page: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LookupIdResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    lookup_locations_lookup_page__get: {
        parameters: {
            query: {
                id: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LookupPageResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    houses_by_id_houses_location_ids__get: {
        parameters: {
            query: {
                ids: string[];
                categories?: string[] | null;
                contract?: string | null;
                condition?: string | null;
                price_min?: number | null;
                price_max?: number | null;
                surface_min?: number | null;
                surface_max?: number | null;
                rooms?: string[] | null;
                bathrooms?: string[] | null;
                furniture?: string | null;
                terrace?: string | null;
                elevator?: string | null;
                balcony?: string | null;
                page_number?: number;
                per_page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HousesResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    houses_aggregation_by_id_houses_aggregation_location_ids_get: {
        parameters: {
            query: {
                ids: string[];
                categories?: string[] | null;
                contract?: string | null;
                condition?: string | null;
                price_min?: number | null;
                price_max?: number | null;
                surface_min?: number | null;
                surface_max?: number | null;
                rooms?: string[] | null;
                bathrooms?: string[] | null;
                furniture?: string | null;
                terrace?: string | null;
                elevator?: string | null;
                balcony?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeatureAggregationResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    houses_aggregation_by_regions_and_provinces_houses_aggregation_homepage_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeAggregationResponse"];
                };
            };
        };
    };
}
