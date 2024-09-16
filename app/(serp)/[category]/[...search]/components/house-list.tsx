import ListingCard from "./listing-card"
import PaginationComponent from "./pagination"
import React from "react";
import { components } from "@/app/types/schema";

export default async function HouseList({
    propertyListing,
    pageRange,
    currentPage,
    totalPages,

}: {
    propertyListing: components["schemas"]["House"][] | undefined;
    pageRange: (string | number | '...')[],
    currentPage: number;
    totalPages: number;
}) {
    return (
        <div className="px-2 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertyListing?.map((house, index) => (
                    <ListingCard house={house} index={index} key={index} />
                ))}
            </div>
            <div className="mt-8">
                <PaginationComponent
                    pageRange={pageRange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    )
}