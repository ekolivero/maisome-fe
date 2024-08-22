'use client'
import MultiSelectInput from "@/components/ui/multi-select";
import { components } from "@/app/types/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterDialog } from "./filter-dialog";

export type FilterProps = {
    location: components["schemas"]["Location"];
}

export default function SmartFilter({ location }: FilterProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div
                className={"md:sticky top-0 z-[20000000]"}
            >
                <div className={`bg-white`}>
                    <div className="bg-white border-b-2 border-gray-50 px-4 py-2">
                        <MultiSelectInput location={location} />
                    </div>
                </div>
            </div>
            <div className="sticky top-0 z-[20000000] md:hidden">
                <div className="bg-white border-b-2 border-gray-50 px-4 py-2 sticky md:hidden flex flex-row justify-between">
                    <Button onClick={() => setIsOpen(!isOpen)} variant={"outline"}> Applica filtri </Button>
                    <Button className="bg-[#0070f3]"> Salva ricerca </Button>
  
                </div>
            </div>
            <FilterDialog isOpen={isOpen} setIsOpenDialog={setIsOpen}/>
        </>
    )
}