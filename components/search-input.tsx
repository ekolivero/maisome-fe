import { Input } from "./ui/input";
import {
    Popover,
    PopoverContent,
} from "@/components/ui/popover"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"
import { useState } from "react";
import {
    SewingPinIcon
} from "@radix-ui/react-icons"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useRouter } from "next/navigation";
import type { paths } from "@/app/types/schema";
import createClient from "openapi-fetch";

const frameworks = [
    {
        value: "Dronero",
        label: "Dronero - Cuneo",
    },
    {
        value: "Dro",
        label: "Dro - Trento",
    },
    {
        value: "Madonna del Dro",
        label: "Madoinna del Dro - Milano",
    },
]


const commonCities = [
    {
        value: "milano/milano",
        label: "Milano"
    },
    {
        value: "roma/roma",
        label: "Roma"
    },
    {
        value: "napoli/napoli",
        label: "Napoli"
    }
]

type Parents = {
    id: string;
    level: number;
    label: string;
}

type Location = {
    label: string;
    id: string;
    level: number;
    page: string;
    parents: Parents[];
}

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

export default function SearchInput() {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [value, setValue] = useState("")

    const router = useRouter()

    const [locations, setLocations] = useState([])

    const handleSearch = async (value: string) => {
        setSearch(value)

        const { data } = await client.GET("/locations/suggest/", {
            params: {
                query: {
                    query: value,
                },
            }
        })

        // @ts-ignore
        setLocations(() => {
            if (!data) return []
            return data.suggestions.map((location) => ({
                label: location.autocomplete,
                id: location.id,
                page: location.page,
            }))
        })
    }


    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <PopoverPrimitive.Anchor asChild>
                        <CommandPrimitive.Input
                            asChild
                            value={search}
                            onValueChange={handleSearch}
                            onKeyDown={(e) => setOpen(e.key !== "Escape")}
                            onMouseDown={() => setOpen((open) => !!search || !open)}
                            onFocus={() => setOpen(true)}
                            onBlur={(e) => {
                                if (!e.relatedTarget?.hasAttribute("cmdk-list")) {
                                    setSearch(
                                        value
                                            ? frameworks.find(
                                                (framework) => framework.value === value
                                            )?.label ?? ""
                                            : ""
                                    )
                                }
                            }}
                        >
                            <Input
                                placeholder="Inserisci un comune, quartiere ..."
                                className="w-full h-12 text-base px-4 rounded-lg md:h-16 md:text-xl md:px-6"
                            />
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
                        className="w-[--radix-popover-trigger-width] p-0"
                    >
                        <CommandList>
                            <CommandEmpty>Non abbiamo trovato risultati</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    key="current-location"
                                    value="current-location"
                                    onMouseDown={(e) => console.log("use current location")}
                                >
                                    <SewingPinIcon className="mr-2 h-4 w-4" />
                                    Usa la tua posizione
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            {
                                !search && (<CommandGroup heading="Ricerche frequenti">
                                    {
                                        commonCities.map((city) => (
                                            <CommandItem
                                                key={city.value}
                                                value={city.value}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setSearch(
                                                        currentValue === value
                                                            ? ""
                                                            : frameworks.find(
                                                                (framework) => framework.value === currentValue
                                                            )?.label ?? ""
                                                    )
                                                    router.push(`/vendita-case/${city.value}`)
                                                    setOpen(false)
                                                }}
                                            >
                                                {city.label}
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>)
                            }
                            {
                                search && (
                                    <CommandGroup heading="Risultati ricerca">
                                        {locations?.map((address: any) => (
                                            <CommandItem
                                                key={address.label}
                                                value={address.label}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setSearch(
                                                        currentValue === value
                                                            ? ""
                                                            : frameworks.find(
                                                                (framework) => framework.value === currentValue
                                                            )?.label ?? ""
                                                    )
                                                    router.push(`/vendita-case/${address.page}`)
                                                    setOpen(false)
                                                }}
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
        </>
    )
}


const HighlightedText = ({ text, highlight }: { text: string, highlight: string}) => {
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