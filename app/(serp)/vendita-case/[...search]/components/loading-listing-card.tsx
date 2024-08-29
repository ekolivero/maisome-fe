import { Skeleton } from "@/components/ui/skeleton"

export function LoadingListingCard() {
    return (
        <div className="flex flex-1 w-full">
            <div className="mt-0 w-full md:max-w-screen-2xl mx-auto">
                <div className="flex h-full flex-col gap-4">
                    <Skeleton className="h-8 w-3/4 mb-4" /> {/* Breadcrumbs placeholder */}
                    <Skeleton className="h-16 w-full mb-4" /> {/* HeaderTitle placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div className="flex flex-col gap-4" key={i}>
                                <Skeleton className="h-[225px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-12 w-full mt-6" /> {/* Pagination placeholder */}
                    <Skeleton className="h-[300px] w-full mt-6" /> {/* NeighboorsCarousel placeholder */}
                </div>
            </div>
        </div>
    )
}