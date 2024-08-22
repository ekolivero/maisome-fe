'use client'

import client from '@/app/utils/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function DeleteLocationBadge({
    resolvedLocations
}: {
    resolvedLocations: any[]
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const removeLocation = useCallback(async (locationToRemove: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        const ids = current.getAll('ids')
        current.delete('ids')

        const remainingIds = ids.filter(id => id !== locationToRemove)

        if (remainingIds.length === 1) {
            try {
                const response = await client.GET(`/locations/lookup_page/`, {
                    params: {
                        query: {
                            id: remainingIds[0]!
                        }
                    }
                });
                router.push(`/vendita-case/${response.data?.location.page}`);
                return;
            } catch (error) {
                console.error('Error fetching location page:', error);
                // If there's an error, fall back to updating the URL with the remaining ID
                current.append('ids', remainingIds[0]!);
            }
        } else if (remainingIds.length > 1) {
            // If there are still multiple IDs, add them back to the URL
            remainingIds.forEach(id => {
                current.append('ids', id)
            })
        }

        // Create the new URL
        const search = current.toString()
        const query = search ? `?${search}` : ""

        // Update the URL
        router.push(`${window.location.pathname}${query}`)
    }, [searchParams, router])

    return (
        <div className="flex flex-wrap gap-2">
            {resolvedLocations.map((city) => (
                <Badge
                    key={city.id}
                    variant="secondary"
                    className="text-sm py-1.5 pl-3 pr-1.5 bg-secondary text-secondary-foreground shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                >
                    <span className="mr-1">{city.label}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent focus:bg-transparent"
                        aria-label={`Remove ${city.label}`}
                        onClick={() => removeLocation(city.id)}
                    >
                        <X className="h-3 w-3 text-muted-foreground transition-colors duration-200" />
                    </Button>
                </Badge>
            ))}
        </div>
    )
}