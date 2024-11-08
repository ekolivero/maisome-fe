import * as React from "react"
import Link from "next/link"

import { components } from "@/app/types/schema"
import { Carousel, Card } from "@/components/ui/card-carousel";
import client from "@/app/utils/client";

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
        <Card key={index} card={card} index={index} layout page={neighbor.page}/>
    ));

    if (!cards) return null;

    return (
        <div className="flex flex-col gap-4 px-2">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                        <Link 
                            href={`/vendita-case/${neighbor.page}`} 
                            className="hover:underline"
                        >
                            Cerca a {neighbor.label}
                        </Link>
                    </h2>
                    <p className="text-sm md:text-xl md text-muted-foreground">
                        Scopri case in vendita
                    </p>
                </div>
            </div>
            <Carousel items={cards} />
        </div>
    );
}