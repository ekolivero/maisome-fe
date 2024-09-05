'use client'
import MultiSelectInput from "@/components/ui/multi-select";
import { components } from "@/app/types/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterDialog } from "./filter-dialog";
import { PriceFilter } from "./desktop-filters/price-filter";
import { CategoryFilter } from "./desktop-filters/category-filter";
import { RoomsFilter } from "./desktop-filters/rooms-filter";
import Image from "next/image";

export type FilterProps = {
    location: components["schemas"]["Location"];
}

export default function SmartFilter({ location }: FilterProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="sticky top-0 z-[20000000] w-full md:mx-auto bg-white border-b-2 border-gray-50 shadow-lg">
                <div className="md:max-w-screen-2xl md:mx-auto">
                    <div className="py-2 px-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Image
                                    className="hidden md:block"
                                    src={"/logo.png"}
                                    alt="Logo"
                                    width={100}
                                    height={50}
                                    priority
                                />

                                <MultiSelectInput location={location} />
                                <Button
                                    size="sm"
                                    onClick={() => setIsOpen(!isOpen)}
                                    variant={"outline"}
                                    className="text-sm px-2 py-1 h-[58px] flex-shrink-0 md:hidden bg-[#0070f3] text-white"
                                >
                                    Applica filtri
                                </Button>
                            </div>
                            <div className="hidden md:flex gap-4">
                                <PriceFilter />
                                <CategoryFilter />
                                <RoomsFilter />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FilterDialog isOpen={isOpen} setIsOpenDialog={setIsOpen} />
        </>
    )
}