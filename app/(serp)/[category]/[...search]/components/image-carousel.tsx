'use client'

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { components } from "@/app/types/schema"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from 'embla-carousel-react'

interface ImageCarouselProps {
    images: components["schemas"]["Image"][];
    priority: boolean;
    mainImage: string;
}

export function ImageCarousel({ images, priority, mainImage }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        loop: true,
        // @ts-ignore
    }, [])

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
        return () => {
            emblaApi.off("select", onSelect)
            emblaApi.off("reInit", onSelect)
        }
    }, [emblaApi, onSelect])

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const renderNavigationDots = () => {
        const totalImages = allImages.length;
        const maxVisibleDots = 3;
        const showAllDots = totalImages <= maxVisibleDots;

        let startIndex: number;
        let endIndex: number;

        if (showAllDots) {
            startIndex = 0;
            endIndex = totalImages - 1;
        } else {
            const halfVisible = Math.floor(maxVisibleDots / 2);
            
            if (currentIndex <= halfVisible) {
                startIndex = 0;
                endIndex = maxVisibleDots - 1;
            } else if (currentIndex >= totalImages - halfVisible - 1) {
                startIndex = totalImages - maxVisibleDots;
                endIndex = totalImages - 1;
            } else {
                startIndex = currentIndex - halfVisible;
                endIndex = currentIndex + halfVisible;
            }
        }

        return (
            <div className="flex items-center justify-center space-x-2 bg-black bg-opacity-20 rounded-full px-3 py-2" role="navigation" aria-label="Image navigation">
                {!showAllDots && startIndex > 0 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/50" aria-hidden="true" />
                )}
                {Array.from({ length: showAllDots ? totalImages : maxVisibleDots }).map((_, index) => {
                    const dotIndex = startIndex + index;
                    const isActive = dotIndex === currentIndex;
                    return (
                        <span
                            key={dotIndex}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all duration-300",
                                isActive ? "bg-white scale-125" : "bg-white/50"
                            )}
                            role="button"
                            aria-label={`Go to image ${dotIndex + 1} of ${totalImages}`}
                            aria-current={isActive ? 'true' : 'false'}
                        />
                    );
                })}
                {!showAllDots && endIndex < totalImages - 1 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/50" aria-hidden="true" />
                )}
            </div>
        );
    };

    return (
        <div className="relative p-0 w-full max-w-md mx-auto h-[240px] group hover:cursor-default min-w-full">
            <div ref={emblaRef} className="overflow-hidden w-full">
                <div className="flex">
                    {allImages.map((image, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-square h-[240px]">
                            <Image
                                src={index === 0 ? image.url : image.url.replace("m-c.jpg", "xs-c.jpg")}
                                alt={image.alt || `Property Image ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                                priority={index === 0 && priority}
                            />
                        </div>
                    ))}
                </div>
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
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center pointer-events-none">
                {renderNavigationDots()}
            </div>
        </div>
    )
}