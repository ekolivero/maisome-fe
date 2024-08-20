import { components } from "@/app/types/schema";
import {BreadcrumbList, Person, WithContext, CollectionPage, ItemList, ListItem, RealEstateListing } from 'schema-dts';

type BaseLocation = components["schemas"]["BaseLocation"];
type Location = components["schemas"]["Location"];
type PropertyListing = components["schemas"]["House"][] | undefined;

export function JsonLd<T extends BreadcrumbList>(json: WithContext<T>): string {
  return `<script type="application/ld+json">
${JSON.stringify(json)}
</script>`;
}

type TypeListingJsonLD = {
  propertyListing: PropertyListing;
  currentPage: number;
  pageSize: number;
  totalResults: number;
  baseUrl: string;
}

export function getBreadcrumbPath(location: Location): BaseLocation[] {
  const path: BaseLocation[] = location.parents
    ? [...location.parents].sort((a, b) => a.level - b.level)
    : [];
  path.push(location);
  return path;
}

export function getChildrenForLocation(
  location: Location | BaseLocation
): BaseLocation[] {
  return "children" in location ? location.children || [] : [];
}

export function getNeighborsForLocation(location: Location): BaseLocation[] {
  return location.neighbors || [];
}

export function createBreadcrumbJsonLD(location: Location): any {
  const breadcrumbPath = [...(location.parents || []), location].sort(
    (a, b) => a.level - b.level
  );

  // TODO: Here we should add the page. This way we can reference everywhere the page.

  const breadcrumbList: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbPath.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        "@id": `https://maisome.com/vendita-case/${item.page}`,
        name: item.label,
      },
    })),
  };

  return {
    __html: JSON.stringify(breadcrumbList),
  };
}

// Helper function to check if a location is of type Location
export function isLocation(
  location: Location | BaseLocation
): location is Location {
  return "page" in location;
}

export function createItemListJsonLD({
  propertyListing,
  currentPage,
  pageSize,
  totalResults,
  baseUrl,
}: TypeListingJsonLD): { __html: string } {
  const itemList: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: propertyListing?.map(
        (property, index): ListItem => ({
          "@type": "ListItem",
          position: (currentPage - 1) * pageSize + index + 1,
          item: {
            "@type": "RealEstateListing",
            name: property.title,
            description: property.description,
            url: property.link,
            image: property.image,
            numberOfRooms: property.rooms,
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.surface.value,
              unitCode: property.surface.text,
            },
            price: property.price.value,
            priceCurrency: property.price.text,
          } as RealEstateListing,
        })
      ),
      numberOfItems: totalResults,
      itemListOrder: "https://schema.org/ItemListOrderAscending" as const,
    },
    url: `${baseUrl}?page=${currentPage}`,
  };

  return {
    __html: JSON.stringify(itemList),
  };
}
