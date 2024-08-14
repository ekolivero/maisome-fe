import * as React from "react"

import { components } from "@/app/types/schema"
import createClient from "openapi-fetch"
import type { paths } from "@/app/types/schema"; 
import { Carousel, Card } from "@/components/ui/card-carousel";


const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });


export async function NeighboorsCarousel({ neighbor }: { neighbor: components["schemas"]["BaseLocation"] }) {
    const { data } = await client.GET("/houses/location_ids/", {
        params: {
            query: {
                ids: [neighbor.id],
                location_level: neighbor.level
            }
        }
    })

    const neighborsData = data?.houses.map((n, idx) => ({
        category: n.location.hierarchy[0]?.label ?? "",
        title: n.title,
        src: n.image,
        content: <p> Hello </p>
    }))

    const cards = neighborsData?.map((card, index) => (
        <Card key={index} card={card} index={index} />
    ));

    if (!cards) return null;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Prova anche a cercare a {neighbor.label}
                    </h2>
                    <p className="text-sm md:text-xl md  text-muted-foreground">
                        Basato sui tuoi interessi
                    </p>
                </div>
            </div>
            <Carousel items={cards} />
        </div>
    );
}