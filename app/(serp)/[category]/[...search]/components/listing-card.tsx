'use client'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { components } from "@/app/types/schema"
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapIcon, HouseIcon } from "lucide-react";
import { ImageCarousel } from './image-carousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const MapView = dynamic(() => import('./map-view').then((mod) => mod.MapView), {
    loading: () => <Skeleton />,
    ssr: false
});

export default function ListingCard({ house, index }: { house: components["schemas"]["House"], index: number }) {
    return (
        <Card className="w-full rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl hover:cursor-pointer relative group">
            <Tabs defaultValue="list" className="w-full h-full">
                <div className="relative">
                    <TabsContent value="list" className="mt-0">
                        <ImageCarousel images={house.images} priority={index < 6} mainImage={house.image} />
                    </TabsContent>
                    <TabsContent value="map" className="mt-0 h-60">
                        <MapView lat={house.location.coordinates.latitude} long={house.location.coordinates.longitude} />
                    </TabsContent>
                    <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                        <TabsList className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg hidden md:flex" onClick={(e) => e.preventDefault()}>
                            <TabsTrigger
                                value="list"
                                className="data-[state=inactive]:flex data-[state=active]:hidden items-center p-2 rounded-full transition-all hover:bg-white"
                            >
                                <HouseIcon className="h-5 w-5 mr-1" /> Vedi offerta
                            </TabsTrigger>
                            <TabsTrigger
                                value="map"
                                className="data-[state=inactive]:flex data-[state=active]:hidden items-center p-2 rounded-full transition-all hover:bg-white"
                            >
                                <MapIcon className="h-5 w-5 mr-1" /> Vedi su mappa
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>
                    <CardContent className="px-2 pt-4 pb-2 md:p-6 bg-background">
                        <Link href={house.link} className="block" prefetch={false} target="_blank" rel="nofollow noopener noreferrer">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h5 className="text-sm md:text-md font-semibold line-clamp-1">
                                    {house.title}
                                </h5>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between mb-2 items-center">
                            <p className="text-2xl font-bold truncate">{house.price.text}</p>
                            <p className="text-muted-foreground text-sm justify-center truncate">{house.location.hierarchy.city?.label}</p>
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
                        </Link>
                        <Accordion type="single" collapsible className="mt-2 pt-2 md:hidden">
                            <AccordionItem value="item-1" className="border-none">
                                <AccordionTrigger 
                                    onClick={(e) => e.stopPropagation()} 
                                    className="flex items-center justify-between py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                                >
                                    <span className="flex items-center">
                                        Vedi su mappa
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2">
                                    <div className="overflow-hidden shadow-md">
                                        <MapView 
                                            lat={house.location.coordinates.latitude} 
                                            long={house.location.coordinates.longitude} 
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
            </Tabs>
        </Card>
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
