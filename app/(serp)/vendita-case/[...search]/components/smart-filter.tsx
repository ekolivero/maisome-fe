'use client'
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function SmartFilter() {
    const placeholders = [
        "Mostrami solo case a meno di 200k",
        "solo appartamenti",
        "casa con garage a meno di 150k",
        "appartamento primo piano con giardino",
    ];

    return (
        <PlaceholdersAndVanishInput placeholders={placeholders} onSubmit={console.log} onChange={console.log} />
    )
}