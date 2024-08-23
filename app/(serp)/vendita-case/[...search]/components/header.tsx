'use client'
import MultiSelectInput from "@/components/ui/multi-select";
import { components } from "@/app/types/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterDialog } from "./filter-dialog";
import { useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

export type FilterProps = {
    location: components["schemas"]["Location"];
}

export default function SmartFilter({ location }: FilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [showChangeSearch, setShowChangeSearch] = useState(false)
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const handleScroll = () => {
            if (isMobile) {
                const vh = window.innerHeight * 0.01;
                setShowChangeSearch(window.scrollY > 100 * vh);
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isMobile])

    const handleChangeLocation = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                    <Button size="sm" onClick={() => setIsOpen(!isOpen)} variant={"outline"} className="text-sm px-2 py-1 h-10"> Applica filtri </Button>
                    {showChangeSearch && (
                        <Button size="sm" variant={"outline"} onClick={handleChangeLocation} className="text-sm px-2 py-1 h-10">
                            <SearchIcon className="w-3 h-3 mr-1" />
                            Cambia località
                        </Button>
                    )}
                    <Button size="sm" className="bg-[#0070f3] text-sm px-2 py-1 h-10"> Salva ricerca </Button>
  
                </div>
            </div>
            <FilterDialog isOpen={isOpen} setIsOpenDialog={setIsOpen}/>
        </>
    )
}