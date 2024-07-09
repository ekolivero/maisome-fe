import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Link from "next/link"
import Image from "next/image"
import mocks from "../mocks/houses_240702103623.json"

export function CarouselDemo() {
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {
                    mocks.slice(0, 5).map((house) => (
                        <CarouselItem key={house.title} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <Card className="w-full max-w-md flex flex-col h-full">
                                    <div className="relative">
                                        <Image
                                            src={house.images[0].url}
                                            alt={house.images[0].caption}
                                            width={300}
                                            height={100}
                                            className="rounded-t-lg object-cover w-full h-[200px]"
                                        />
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <div className="grid gap-1 mb-4">
                                            <div className="text-lg font-semibold">{house.title}</div>
                                            <div className="text-muted-foreground">{house.bedrooms} Camere, {house.bathrooms} Bagni </div>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="text-2xl font-bold">{house.price.formattedValue}</div>
                                            <Link
                                                href={house.link}
                                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                                prefetch={false}
                                            >
                                                Vedi offerta
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))
                }
            </CarouselContent>
        </Carousel>
    )
}