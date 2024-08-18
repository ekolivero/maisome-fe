import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { MapView } from "./map-view"
import { components } from "@/app/types/schema"

export default function ListingCard({ house }: { house: components["schemas"]["House"] }) {
    return (
        <section>
            <Card className="w-full rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:cursor-pointer">
                <Link href={house.link} className="block" prefetch={false}>
                    <Image
                        unoptimized
                        src={house.image}
                        alt="Property Image"
                        width={400}
                        height={240}
                        className="w-full h-60 object-cover"
                    />
                </Link>
                <CardContent className="p-6 bg-background">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h5 className="text-sm md:text-md font-semibold">{house.title}</h5>
                        </div>

                    </div>
                    <div className="flex flex-row justify-between mb-2 items-center">
                        <p className="text-2xl font-bold">{house.price.text}</p>
                        <p className="text-muted-foreground text-sm justify-center">{house.location.hierarchy.city?.label}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <BedIcon className="w-5 h-5" />
                            <span>{house.rooms} locali</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BathIcon className="w-5 h-5" />
                            <span> {house.bathrooms} bagni </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RulerIcon className="w-5 h-5" />
                            <span> {house.surface.text}</span>
                        </div>
                    </div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Vedi su mappa</AccordionTrigger>
                            <AccordionContent>
                                <MapView lat={house.location.coordinates.latitude} long={house.location.coordinates.longitude} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </section>
    )
}

function BathIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
            <line x1="10" x2="8" y1="5" y2="7" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <line x1="7" x2="7" y1="19" y2="21" />
            <line x1="17" x2="17" y1="19" y2="21" />
        </svg>
    )
}


function BedIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 4v16" />
            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
            <path d="M2 17h20" />
            <path d="M6 8v9" />
        </svg>
    )
}


function RulerIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
            <path d="m14.5 12.5 2-2" />
            <path d="m11.5 9.5 2-2" />
            <path d="m8.5 6.5 2-2" />
            <path d="m17.5 15.5 2-2" />
        </svg>
    )
}


function XIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}