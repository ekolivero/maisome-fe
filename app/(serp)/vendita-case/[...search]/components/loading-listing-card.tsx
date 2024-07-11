import { Skeleton } from "@/components/ui/skeleton"

export function LoadingListingCard() {
    return (
        <>
        {Array.from({ length: 5 }).map((_, i) => (
            <div className="flex flex-1 flex-col gap-4" key={i}>
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        ))}
        </>
    )
}