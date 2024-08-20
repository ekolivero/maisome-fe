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
        <div className="flex flex-1 flex-col gap-8 mb-8">
            <div className="px-2 gap-4 flex flex-col">
                {propertyListing?.map((house, index) => (
                    <ListingCard house={house} index={index} key={index} />
                ))}
                <PaginationComponent pageRange={pageRange} currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}