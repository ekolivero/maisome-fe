import createClient from "openapi-fetch"
import type { paths } from "@/app/types/schema"; 
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { components } from "@/app/types/schema"


type Location = components["schemas"]["Location"];

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

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

    const priceHouses = data.aggregation.price!

    const furnitureHouses = data.aggregation.furniture!

    const surfaceHouses = data.aggregation.surface!

    return (
        <div className="flex flex-col gap-4">
            <h6 className="text-2xl md:text-xl font-semibold tracking-tight"> Trova la tua casa ideale </h6>
            <Accordion type="multiple" className="w-full" defaultValue={["rooms", "condition", "price", "furniture", "category", "surface", "neightboors"]}>
                <AccordionItem value="rooms">
                    <AccordionTrigger>Ricerca per numero di stanze</AccordionTrigger>
                    <AccordionContent>
                        {
                            topThreeRooms.map((room, index) => (
                                <Link key={index} href={`/vendita-case/${page}?rooms=${encodeURIComponent(room.key)}`}>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <p className="text-md text-muted-foreground text-blue-500"> {room.key} stanze in vendita a {city.split("/")[1]!.charAt(0).toUpperCase() + city.split("/")[1]!.slice(1)}</p>
                                        <p className="text-md text-muted-foreground"> {room.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="condition">
                    <AccordionTrigger>Ricerca per stato immobile</AccordionTrigger>
                    <AccordionContent>
                        {
                            topThreeConditions.map((condition, index) => (
                                <Link key={index} href={`/vendita-case/${page}?condition=${encodeURIComponent(condition.key)}`}>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <p className="text-md text-muted-foreground text-blue-500"> Stato {condition.key} in {city.split("/")[1]!.charAt(0).toUpperCase() + city.split("/")[1]!.slice(1)}</p>
                                        <p className="text-md text-muted-foreground"> {condition.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                    <AccordionTrigger>Ricerca per prezzo</AccordionTrigger>
                    <AccordionContent>
                        {
                            priceHouses.map((price, index) => (
                                <Link key={index} href={`/vendita-case/${page}`}>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <p className="text-md text-muted-foreground text-blue-500"> Case a {price.key} in {city.split("/")[1]!.charAt(0).toUpperCase() + city.split("/")[1]!.slice(1)}</p>
                                        <p className="text-md text-muted-foreground"> {price.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="category">
                    <AccordionTrigger>Ricerca per tipologia</AccordionTrigger>
                    <AccordionContent>
                        {
                            categoryHouses.map((category, index) => (
                                <Link key={index} href={`/vendita-case/${page}?categories=${encodeURIComponent(category.key)}`}>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <p className="text-md text-muted-foreground text-blue-500"> {category.key} in {city.split("/")[1]!.charAt(0).toUpperCase() + city.split("/")[1]!.slice(1)}</p>
                                        <p className="text-md text-muted-foreground"> {category.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="surface">
                    <AccordionTrigger>Ricerca per superficie</AccordionTrigger>
                    <AccordionContent>
                        {
                            surfaceHouses.map((surface, index) => (
                                <Link key={index} href={`/vendita-case/${page}`}>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <p className="text-md text-muted-foreground text-blue-500"> Case di {surface.key} mq in {city.split("/")[1]!.charAt(0).toUpperCase() + city.split("/")[1]!.slice(1)}</p>
                                        <p className="text-md text-muted-foreground"> {surface.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="furniture">
                    <AccordionTrigger>Ricerca per arredo</AccordionTrigger>
                    <AccordionContent>
                        {
                            furnitureHouses.map((furniture, index) => (
                                <Link key={index} href={`/vendita-case/${page}`}>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <p className="text-md text-muted-foreground text-blue-500"> Case {furniture.key || "Non arredate"} in {city.split("/")[1]!.charAt(0).toUpperCase() + city.split("/")[1]!.slice(1)}</p>
                                        <p className="text-md text-muted-foreground"> {furniture.count} risultati </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="neightboors">
                    <AccordionTrigger>Ricerca per località vicine</AccordionTrigger>
                    <AccordionContent>
                        {
                            location?.neighbors?.map((neightboors, index) => (
                                <Link key={index} href={`/vendita-case/${neightboors.page}`}>
                                    <div className="flex flex-row justify-between items-center gap-4">
                                        <p className="text-md text-muted-foreground text-blue-500"> Case in vendita a {neightboors.label} </p>
                                    </div>
                                </Link>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}