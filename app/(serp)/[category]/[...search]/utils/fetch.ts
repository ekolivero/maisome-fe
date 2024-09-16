import "server-only";
import client from "@/app/utils/client";
import { searchParamsCache } from "@/lib/nuqs/searchParams";
import { cache } from "react";
import { HouseType } from "@/lib/types/house-enum";

export const fetchLookupData = cache((search: string[]) => {
  return client.GET("/locations/lookup_id/", {
    params: {
      query: {
        page: search.join("/"),
      },
    },
  });
});

export const fetchHouses = cache((ids: string | string[], category = "") => {
  const searchParams = searchParamsCache.all();
  
  return client.GET("/houses/location_ids/", {
    params: {
      query: {
        ...searchParams,
        ids: Array.isArray(ids) ? ids : [ids],
        per_page: 42,
        page_number: searchParams.page_number ?? undefined,
        categories: category === HouseType.CASE ? undefined : [category],
      },
    },
  });
});