"use client";
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
} from "@/components/ui/popover"
import { useState, useEffect, useRef } from "react";
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
import { FilterProps } from "@/app/(serp)/vendita-case/[...search]/components/smart-filter";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown as ChevronDownIcon, X as XIcon, PlusIcon } from 'lucide-react'
import { PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./button";

type Location = {
    label: string;
    id: string;
    page: string;
}

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

export default function MultiSelectInput({ location }: FilterProps) {
    const { neighbors, label, id } = location
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([{
        id,
        label,
        page: location.page
    }])
    const [locations, setLocations] = useState<Location[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    const router = useRouter()
    const searchParams = useSearchParams()


    useEffect(() => {
        const fetchLocations = async () => {
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

        if (newLocations.length === 1) {
            router.push(`/vendita-case/${newLocations[0]!.page}`, { scroll: false })
        }
    }

    return (
        <div className="flex flex-wrap flex-col p-1 items-center border rounded-lg bg-white md:max-w-xl mx-auto">
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <div className="flex items-center px-3 p-1 bg-white rounded-md">
                        <PopoverTrigger asChild>
                            <div className="flex-grow flex items-center cursor-text" onClick={() => inputRef.current?.focus()}>
                                <Input
                                    ref={inputRef}
                                    placeholder="Inserisci un altro comune o quartiere ..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent p-0"
                                />
                            </div>
                        </PopoverTrigger>
                        <Popover>
                            {selectedLocations.length > 1 && (
                                <>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                        >
                                            <span>{selectedLocations.length}</span>
                                            <ChevronDownIcon className="w-4 h-4 ml-1" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[250px] p-0 z-[200000000000] mt-2">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup heading="Località selezionate">
                                                    {selectedLocations.map((location) => (
                                                        <CommandItem
                                                            key={location.id}
                                                            className="flex justify-between items-center"
                                                        >
                                                            <span>{location.label}</span>
                                                            <XIcon onClick={() => handleRemove(location)} className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </>
                            )}
                        </Popover>
                    </div>
                    {!open && <CommandList aria-hidden="true" className="hidden" />}
                    <PopoverContent
                        align="center"
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
                        className="w-[calc(100vw-1rem)] ml-2 md:ml-0 md:w-[--radix-popover-trigger-width] p-0 z-[10000000000] mt-2"
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
                                                onSelect={() => {
                                                    router.push(`/vendita-case/${neighbor.page}`, { scroll: false })
                                                }}
                                                className="flex justify-between items-center"
                                            >
                                                {neighbor.label}
                                                <Button
                                                    variant={"ghost"}
                                                    size={"sm"}
                                                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleSelect(neighbor)
                                                    }}
                                                >
                                                    Aggiungi
                                                    <PlusIcon className="w-4 h-4 ml-2" />
                                                </Button>
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
                                                onSelect={() => {
                                                    router.push(`/vendita-case/${address.page}`, { scroll: false })
                                                }}
                                                className="flex justify-between items-center"
                                            >
                                                <HighlightedText text={address.label} highlight={search} />
                                                <Button
                                                    variant={"ghost"}
                                                    size={"sm"}
                                                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleSelect(address)
                                                    }}
                                                >
                                                    Aggiungi
                                                    <PlusIcon className="w-4 h-4 ml-2" />
                                                </Button>
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