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
import { FilterProps } from "@/app/(serp)/vendita-case/[...search]/components/header";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown as ChevronDownIcon, X as XIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./button";
import client from "@/app/utils/client";

type Location = {
    label: string;
    id: string;
    page: string;
}


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
    const ids = searchParams.getAll('ids')

    const updateSearchParams = (newId: string) => {
        const current = new URLSearchParams(searchParams.toString());
        if (ids.length === 0) {
            current.append('ids', location.id)
        }
        if (!ids.includes(newId)) {
            current.append('ids', newId);
        }
        router.push(`?${current.toString()}`, { scroll: false });
    };

    const handleSearch = async (value: string) => {
        setSearch(value);

        const { data } = await client.GET("/locations/suggest/", {
            params: {
                query: {
                    query: value,
                },
            }
        });

        setLocations(() => {
            if (!data) return [];
            return data.suggestions.map((location) => ({
                label: location.autocomplete,
                id: location.id,
                page: location.page,
            }));
        });
    };

    const handleAppendLocation = async (selectedLocation: Location) => {
        updateSearchParams(selectedLocation.id);
        setSearch("");
        setOpen(false);
    };

    return (
        <div className="flex flex-wrap flex-col p-1 items-center border rounded-sm bg-white md:max-w-xl mx-auto">
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <div className="flex items-center p-1 px-3 bg-white rounded-md">
                        <PopoverTrigger asChild>
                            <div className="flex-grow flex items-center cursor-text" onClick={() => inputRef.current?.focus()}>
                                <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <Input
                                    ref={inputRef}
                                    placeholder="Inserisci un altro comune o quartiere ..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-transparent p-0 text-[16px]"
                                />
                            </div>
                        </PopoverTrigger>
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
                                                        handleAppendLocation(neighbor)
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
                                                        handleAppendLocation(address)
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