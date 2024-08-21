"use client";
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
} from "@/components/ui/popover"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"
import { useState, useEffect } from "react";
import {
    Cross2Icon
} from "@radix-ui/react-icons"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import type { paths } from "@/app/types/schema";
import createClient from "openapi-fetch";
import { Badge } from "@/components/ui/badge";
import { FilterProps } from "@/app/(serp)/vendita-case/[...search]/components/smart-filter";
import { useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"


type Location = {
    label: string;
    id: string;
}

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

export default function MultiSelectInput({ location }: FilterProps) {
    const { neighbors, label, id } = location
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([{
        id,
        label
    }])
    const [locations, setLocations] = useState<Location[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const searchParams = useSearchParams()


    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoading(true)
            const ids = searchParams.getAll('ids')
            if (ids.length > 0) {
                const results = await Promise.allSettled(ids.map(async (id: string) => {
                    try {
                        const { data } = await client.GET("/locations/lookup_page/", {
                            params: {
                                query: {
                                    id,
                                }
                            }
                        })
                        return { id, label: data?.location.label }
                    } catch (error) {
                        console.error(`Failed to fetch location for id ${id}`, error)
                        return null
                    }
                }))

                const validLocations = results
                    .filter((result): result is PromiseFulfilledResult<Location | null> => result.status === 'fulfilled' && result.value !== null)
                    .map(result => result.value as Location)

                setSelectedLocations(validLocations)
            }
            setIsLoading(false)
        }

        fetchLocations()
    }, [])

    const updateSearchParams = (location: Location[]) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.delete('ids')
        location.forEach(loc => {
            newSearchParams.append('ids', loc.id)
        })
        router.push(`?${newSearchParams.toString()}`, { scroll: false })
    }

    const handleSearch = async (value: string) => {
        setSearch(value)

        const { data } = await client.GET("/locations/suggest/", {
            params: {
                query: {
                    query: value,
                },
            }
        })

        setLocations(() => {
            if (!data) return []
            return data.suggestions.map((location) => ({
                label: location.autocomplete,
                id: location.id,
                page: location.page,
            }))
        })
    }

    const handleSelect = async (location: Location) => {
        if (selectedLocations.length === 0) {
            const { data } = await client.GET("/locations/lookup_page/", {
                params: {
                    query: {
                        id: location.id
                    }
                }
            })

            router.push(`/vendita-case/${data?.location.page}`, { scroll: false })
            return
        }
        if (!selectedLocations.some(sel => sel.id === location.id)) {
            const newLocations = [...selectedLocations, location]
            setSelectedLocations(newLocations)
            updateSearchParams(newLocations)
        }
        setSearch("")
        setOpen(false)
    }

    const handleRemove = (location: Location) => {
        const newLocations = selectedLocations.filter(sel => sel.id !== location.id)
        setSelectedLocations(newLocations)
        updateSearchParams(newLocations)
    }

    return (
        <div className="flex flex-wrap flex-col items-center p-1 border rounded-lg bg-white md:max-w-xl mx-auto">
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <div className="flex flex-row gap-1.5 whitespace-nowrap overflow-x-auto scrollbar-hide">
                        {
                            isLoading ? (
                                <Skeleton className="h-4 w-[80%] opacity-80" />
                            ) : (
                                <>
                                    {selectedLocations.map((location) => (
                                        <Badge key={location.id} variant="secondary" className="h-4 gap-1">
                                            <p className="text-xs">{location.label.split(" • ")[0]} </p>
                                            <button onClick={() => handleRemove(location)} className="ml-1">
                                                <Cross2Icon className="h-2 w-2" />
                                            </button>
                                        </Badge>
                                    ))}
                                </>
                            )
                        }
                    </div>
                    <PopoverPrimitive.Anchor asChild>
                        <CommandPrimitive.Input
                            asChild
                            value={search}
                            onValueChange={handleSearch}
                            onKeyDown={(e) => setOpen(e.key !== "Escape")}
                            onMouseDown={() => setOpen((open) => !!search || !open)}
                            onFocus={() => setOpen(true)}
                        >
                            <Input placeholder="Aggiungi un altro comune o quartiere" className="flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent mt-1" />
                        </CommandPrimitive.Input>
                    </PopoverPrimitive.Anchor>
                    {!open && <CommandList aria-hidden="true" className="hidden" />}
                    <PopoverContent
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            if (
                                e.target instanceof Element &&
                                e.target.hasAttribute("cmdk-input")
                            ) {
                                e.preventDefault()
                            }
                        }}
                        className="w-[--radix-popover-trigger-width] p-0 z-[10000000000]"
                    >
                        <CommandList>
                            <CommandEmpty>Non abbiamo trovato risultati</CommandEmpty>
                            <CommandSeparator />
                            {
                                !search && (
                                    <CommandGroup heading="Località nelle vicinanze">
                                        {neighbors?.map((neighbor) => (
                                            <CommandItem
                                                key={neighbor.id}
                                                value={neighbor.id}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onSelect={() => handleSelect({ label: neighbor.label, id: neighbor.id })}
                                            >
                                                {neighbor.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )
                            }
                            {
                                search && (
                                    <CommandGroup heading="Risultati ricerca">
                                        {locations.map((address) => (
                                            <CommandItem
                                                key={address.id}
                                                value={address.label}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onSelect={() => handleSelect(address)}
                                            >
                                                <HighlightedText text={address.label} highlight={search} />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )
                            }
                        </CommandList>
                    </PopoverContent>
                </Command>
            </Popover>
        </div>
    )
}

const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="font-bold text-black hover:text-gray-700 transition-colors">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};