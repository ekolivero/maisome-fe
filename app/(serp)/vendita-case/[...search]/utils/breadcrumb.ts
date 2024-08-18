import { components } from "@/app/types/schema";

type BaseLocation = components["schemas"]["BaseLocation"];
type Location = components["schemas"]["Location"];

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

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbPath.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": `https://maisome.com/${item.label}`,
        name: item.label,
      },
    })),
  };
}

// Helper function to check if a location is of type Location
export function isLocation(
  location: Location | BaseLocation
): location is Location {
  return "page" in location;
}
