import {
  createSerializer,
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf
} from "nuqs/server";

export const searchParams = {
  ids: parseAsArrayOf(parseAsString),
  categories: parseAsArrayOf(parseAsString),
  contract: parseAsString,
  condition: parseAsString,
  price_min: parseAsInteger,
  price_max: parseAsInteger,
  surface_min: parseAsInteger,
  surface_max: parseAsInteger,
  rooms: parseAsArrayOf(parseAsString),
  bathrooms: parseAsArrayOf(parseAsString),
  furniture: parseAsString,
  terrace: parseAsString,
  elevator: parseAsString,
  balcony: parseAsString,
  page_number: parseAsInteger,
  per_page: parseAsInteger,
  q: parseAsString,
};

export const searchParamsCache = createSearchParamsCache({
  // List your search param keys and associated parsers here:
  ...searchParams,
});


export const serialize = createSerializer(searchParams);
