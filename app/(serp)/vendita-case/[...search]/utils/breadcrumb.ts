import { components } from "@/app/types/schema";
import {BreadcrumbList, Person, WithContext, CollectionPage, ItemList, ListItem, RealEstateListing, SingleFamilyResidence } from 'schema-dts';

type BaseLocation = components["schemas"]["BaseLocation"];
type Location = components["schemas"]["Location"];
type PropertyListings = components["schemas"]["House"][] | undefined;
type PropertyListing = components["schemas"]["House"];


export function JsonLd<T extends BreadcrumbList>(json: WithContext<T>): string {
  return `<script type="application/ld+json">
${JSON.stringify(json)}
</script>`;
}

type TypeListingJsonLD = {
  propertyListing: PropertyListings;
  currentPage: number;
  pageSize: number;
  totalResults: number;
  baseUrl: string;
  location: Location
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
  location
}: TypeListingJsonLD): { __html: string } {

  const breadcrumbPath = [...(location.parents || []), location].sort(
    (a, b) => a.level - b.level
  );


  const itemList: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Case in vendita a ${location.label}`,
    audience: {
      "@type": "Audience",
      audienceType: "Acquirenti di case",
      geographicArea: {
        "@type": "Country",
        name: "Italia",
      },
    },
    contentLocation: {
      "@type": "Place",
      name: location.label,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: location.parents && location.parents[0]?.label || "Italia",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "http://schema.org/ItemListUnordered",
      numberOfItems: totalResults,
      url: `${baseUrl}?page=${currentPage}`,
      itemListElement: propertyListing?.map(
        (property, index): RealEstateListing => ({
          "@type": "RealEstateListing",
          name: property.title,
          position: (currentPage - 1) * pageSize + index + 1,
          url: property.link,
          image: property.image,
          potentialAction: {
            "@type": "BuyAction",
          },
          offers: {
            "@type": "Offer",
            price: property.price.value!,
            priceCurrency: "EUR",
          },
          mainEntity: {
            "@type": "SingleFamilyResidence",
            name: property.title,
            description: property.description,
            url: property.link,
            image: property.image,
            numberOfRooms: Number(property.rooms) + Number(property.bathrooms),
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.surface.value,
              unitCode: "MTK",
            },
            numberOfBedrooms: Number(property.bedrooms),
            numberOfBathroomsTotal: Number(property.bathrooms),
          },
        })
      ),
      // Todo implement FaQ
      // subjectOf: {
      //   "@type": "FAQPage",
      //   mainEntity: [
      //     {
      //       "@type": "Question",
      //       name: "What is the median home price in Kings Point, NY?",
      //       acceptedAnswer: {
      //         "@type": "Answer",
      //         text: "Homes for sale in Kings Point, NY have a median listing home price of $3,500,000.",
      //       },
      //     },
      //     {
      //       "@type": "Question",
      //       name: "What is the average time to sell a house in Kings Point, NY?",
      //       acceptedAnswer: {
      //         "@type": "Answer",
      //         text: "On Average the houses for sale in Kings Point, NY spend an average of 64 days on the market.",
      //       },
      //     },
      //     {
      //       "@type": "Question",
      //       name: "What is the number of active homes for sale in Kings Point, NY?",
      //       acceptedAnswer: {
      //         "@type": "Answer",
      //         text: "There are 26 active homes for sale in Kings Point, NY.",
      //       },
      //     },
      //     {
      //       "@type": "Question",
      //       name: "What are some of the most popular neighborhoods near Kings Point, NY?",
      //       acceptedAnswer: {
      //         "@type": "Answer",
      //         text: "Some of the hottest neighborhoods near Kings Point, NY are {ne_upper_east_side}, {ne_tribeca}, {ne_throgs_neck}, {ne_battery_park_city}, {ne_cobble_hill}.",
      //       },
      //     },
      //     {
      //       "@type": "Question",
      //       name: "What are some popular zip codes and neighborhoods around Kings Point, NY?",
      //       acceptedAnswer: {
      //         "@type": "Answer",
      //         text: "You may also be interested in single family homes and condo/townhomes for sale in popular zip codes like {11050}, {10022}, or three bedroom homes for sale in neighboring cities, such as {new_york}, {manhattan}, {queens}, {great_neck}, {flushing}.",
      //       },
      //     },
      //   ],
      // },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbPath.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@id": `https://maisome.com/vendita-case/${item.page}`,
          name: item.label,
        },
      })),
    },
  };

  return {
    __html: JSON.stringify(itemList),
  };
}
