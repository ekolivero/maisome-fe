'use client'
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import { FilterDialog } from "./filter-dialog";

export default function SmartFilter() {

    const placeholders = [
        "Mostrami solo case a meno di 200k",
        "solo appartamenti",
        "casa con garage a meno di 150k",
        "appartamento primo piano con giardino",
    ];
    const [isDialogOpen, setIsOpenDialog] = useState(false);

    return (
        <>
        <div
            className={"sticky top-0"}
        >
            <div className={`bg-white dark:bg-black transition-all duration-300 ease-in-out`}>
                <div className="bg-white shadow-lg py-4 px-6">
                    <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onSubmit={console.log}
                        onChange={console.log}
                        setIsOpenDialog={setIsOpenDialog}
                    />
                </div>
            </div>
        </div>
        <FilterDialog isOpen={isDialogOpen} setIsOpenDialog={setIsOpenDialog} />
        </>
    )
}