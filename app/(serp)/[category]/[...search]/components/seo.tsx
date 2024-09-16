import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { components } from "@/app/types/schema"
import { ArmchairIcon, BedIcon, EuroIcon, HouseIcon, HousePlusIcon, MapPinIcon, Scale3DIcon } from "lucide-react"
import client from "@/app/utils/client";
import { serialize } from "@/lib/nuqs/searchParams";

type Location = components["schemas"]["Location"];

export default async function SEO({
    location,
    city,
    page
}: {
    location: Location;
    city: string;
    page: string;
}) {

    const { data } = await client.GET("/houses/aggregation/location_ids", {
        params: {
            query: {
                ids: [location.id]
            }
        }
    })

    if (!data?.aggregation) return null

    const topThreeRooms = data.aggregation.rooms!
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);


    const topThreeConditions = data.aggregation.condition!
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const categoryHouses = data.aggregation.category!

    const furnitureHouses = data.aggregation.furniture!

    let formattedLocationName = "";

    switch (location.level) {
        case 0: {
            formattedLocationName = location.label
            break
        }
        case 1: {
            formattedLocationName = location.label
            break
        }
        default: {
            formattedLocationName = city.split("/")[1]!
                .split("-")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            break;
        }
    }


    return (
        <div className="flex flex-col gap-4 px-4">
            <h6 className="text-2xl md:text-xl font-semibold tracking-tight"> Trova la tua casa ideale </h6>
            <Accordion type="multiple" className="w-full" defaultValue={["rooms", "condition", "price", "furniture", "category", "surface", "neightboors"]}>
                <AccordionItem value="rooms">
                    <AccordionTrigger>
                        <span className="flex gap-2 items-center">
                            <BedIcon size={18} />
                            Ricerca per stanze
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {
                            topThreeRooms.map((room, index) => (
                                <Link key={index} href={`/vendita-case/${page}${serialize({ rooms: [room.key] })}`}>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-md text-blue-500"> {room.key} stanze in vendita a {formattedLocationName}</p>
                                        <p className="text-md text-muted-foreground"> {room.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="condition">
                    <AccordionTrigger>
                        <span className="flex gap-2 items-center">
                            <HouseIcon size={18} />
                            Ricerca per stato dell&apos; immobile
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {
                            topThreeConditions.map((condition, index) => (
                                <Link key={index} href={`/vendita-case/${page}${serialize({ condition: condition.key })}`}>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-md  text-blue-500"> Stato {condition.key} in {formattedLocationName}</p>
                                        <p className="text-md text-muted-foreground"> {condition.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                    <AccordionTrigger>
                        <span className="flex gap-2 items-center">
                            <EuroIcon size={18} />
                            Ricerca per prezzo
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {
                            data.aggregation.price!
                                .sort((a, b) => {
                                    if (a.key === 'Prezzo su richiesta') return 1;
                                    if (b.key === 'Prezzo su richiesta') return -1;
                                    return (a.range?.min ?? 0) - (b.range?.min ?? 0);
                                })
                                .map((price, index) => (
                                    <Link key={index} href={`/vendita-case/${page}${serialize({
                                        price_min: price?.range?.min,
                                        price_max: price?.range?.max
                                    })}`}>
                                        <div className="flex flex-row justify-between">
                                            <p className="text-md text-blue-500">
                                                {price.key === 'Prezzo su richiesta' ? 'Prezzo su richiesta' :
                                                    price?.range?.min === 0 ? `Case fino a ${price?.range?.max?.toLocaleString()}€` :
                                                    price?.range?.max === null ? `Case oltre ${price?.range?.min?.toLocaleString()}€` :
                                                    `Case da ${price?.range?.min?.toLocaleString()}€ a ${price?.range?.max?.toLocaleString()}€`} in {formattedLocationName}
                                            </p>
                                            <p className="text-md text-muted-foreground"> {price.count} risultati </p>
                                        </div>
                                    </Link>
                                ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="category">
                    <AccordionTrigger>
                        <span className="flex gap-2 items-center">
                            <HousePlusIcon size={18} />
                            Ricerca per tipologia
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {
                            categoryHouses.map((category, index) => (
                                <Link key={index} href={`/vendita-${category.key.toLowerCase().replace(/\s+/g, '-')}/${page}`}>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-md  text-blue-500"> {category.key} in {formattedLocationName}</p>
                                        <p className="text-md text-muted-foreground"> {category.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="surface">
                    <AccordionTrigger>
                        <span className="flex gap-2 items-center">
                            <Scale3DIcon size={18} />
                            Ricerca per superficie
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {
                            data.aggregation.surface!
                                .sort((a, b) => (a.range?.min ?? 0) - (b.range?.min ?? 0))
                                .map((surface, index) => (
                                    <Link key={index} href={`/vendita-case/${page}${serialize({
                                        surface_min: surface.range?.min,
                                        surface_max: surface.range?.max
                                    })}`}>
                                        <div className="flex flex-row justify-between items-center">
                                            <p className="text-md text-blue-500">
                                                {surface.range?.min === 0 ? `Case fino a ${surface.range?.max} mq` :
                                                 surface.range?.max === null ? `Case oltre ${surface.range?.min} mq` :
                                                 `Case da ${surface.range?.min} a ${surface.range?.max} mq`} in {formattedLocationName}
                                            </p>
                                            <p className="text-md text-muted-foreground"> {surface.count} risultati </p>
                                        </div>
                                    </Link>
                                ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="furniture">
                    <AccordionTrigger>
                        <span className="flex gap-2 items-center">
                            <ArmchairIcon size={18} />
                            Ricerca per arredo
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {
                            furnitureHouses.map((furniture, index) => (
                                <Link key={index} href={`/vendita-case/${page}${serialize({ furniture: furniture.key || null })}`}>
                                    <div className="flex flex-row justify-between items-center">
                                        <p className="text-md text-blue-500"> Case {furniture.key || "Non arredate"} in {formattedLocationName}</p>
                                        <p className="text-md text-muted-foreground"> {furniture.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="neightboors">
                    <AccordionTrigger>
                        <span className="flex gap-2 items-center">
                            <MapPinIcon size={18} />
                            Ricerca per località vicine
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {
                            location?.neighbors?.map((neightboors, index) => (
                                <Link key={index} href={`/vendita-case/${neightboors.page}`}>
                                        <p className="text-md text-blue-500"> Case in vendita a {neightboors.label} </p>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}