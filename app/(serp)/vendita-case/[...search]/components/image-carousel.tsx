'use client'

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { components } from "@/app/types/schema"
import Fade from "embla-carousel-fade"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
    images: components["schemas"]["Image"][];
    priority: boolean;
    mainImage: string;
}

export function ImageCarousel({ images, priority, mainImage }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [emblaApi, setEmblaApi] = React.useState<any | null>(null)

    const allImages = React.useMemo(() => {
        return [
            { url: mainImage, alt: "Main image" },
            ...images.slice(1).map((img, index) => ({
                url: img.url,
                alt: img.caption || `Image ${index + 2}`
            }))
        ];
    }, [mainImage, images])

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return
        setCurrentIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    React.useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
    }, [emblaApi, onSelect])

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const renderNavigationDots = () => {
        const totalDots = 3 // Show only 3 dots
        const halfDots = Math.floor(totalDots / 2)

        let startDot = Math.max(0, currentIndex - halfDots)
        let endDot = Math.min(allImages.length - 1, startDot + totalDots - 1)

        if (endDot - startDot < totalDots - 1) {
            startDot = Math.max(0, endDot - totalDots + 1)
        }

        return (
            <>
                {startDot > 0 && <div className="w-2 h-2 rounded-full bg-white/50" />}
                {Array.from({ length: endDot - startDot + 1 }, (_, i) => i + startDot).map((idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300 ease-in-out",
                            currentIndex === idx ? "bg-white scale-125" : "bg-white/50"
                        )}
                    />
                ))}
                {endDot < allImages.length - 1 && <div className="w-2 h-2 rounded-full bg-white/50" />}
            </>
        )
    }

    return (
        <div className="relative p-0 w-full max-w-md mx-auto h-[240px] group hover:cursor-default min-w-full">
            <Carousel
                setApi={setEmblaApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
                // @ts-ignore
                plugins={[Fade()]}
            >
                <CarouselContent>
                    {allImages.map((image, index) => (
                        <CarouselItem key={index} className="pl-0 w-full">
                            <div className="relative aspect-square h-[240px] w-full">
                                <Image
                                    src={index === 0 ? image.url : image.url.replace("m-c.jpg", "xs-c.jpg")}
                                    alt={image.alt || `Property Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    priority={index === 0 && priority}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 flex sm:hidden">
                <div
                    className="w-1/2 h-[240px] cursor-pointer"
                    onClick={scrollPrev}
                />
                <div
                    className="w-1/2 h-[240px] cursor-pointer"
                    onClick={scrollNext}
                />
            </div>
            <div className="hidden sm:flex absolute top-1/2 left-2 right-2 -translate-y-1/2 justify-between">
                <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={scrollPrev}
                >
                    <ChevronLeft className="h-9 w-9 text-white" />
                </button>
                <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={scrollNext}
                >
                    <ChevronRight className="h-9 w-9 text-white" />
                </button>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-2 pointer-events-none">
                {renderNavigationDots()}
            </div>
        </div>
    )
}