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
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

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

const lastResearch = [
    {
        value: "Dronero",
        label: "Dronero - Cuneo",
    },
    {
        value: "Borgo",
        label: "Borgo san Dalmazzo - Cuneo",
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
    parents: Parents[];
}

export default function SearchInput() {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [value, setValue] = useState("")


    const [locations, setLocations] = useState([])

    const handleSearch = async (value: string) => {
        setSearch(value)

        const response = await fetch(`https://test-locations-kohl.vercel.app/suggest/?query=${value}`)

        const jsonResponse = await response.json()

        setLocations(jsonResponse.suggestions?.map((location: Location) => ({
            label: location.label + ' • ' + (location.level === 1 ? "Provincia" : (location.level === 2 && location.parents[0].label === location.label ? "Comune" : location.parents.find((l) => l.level === 1)?.label) ?? "Regione"),
            id: location.id,
            level: location.level,
            parent: location.parents.find((parent) => parent.level === 1)?.label ?? "Comune"
        })))
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
                            <Input placeholder="Inserisci indirizzo" className="w-[20rem] md:w-full h-12 text-xl px-4 rounded-lg" />
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
                                !search && (<CommandGroup heading="Ricerche recenti">
                                    {
                                        lastResearch.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
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
                                                    setOpen(false)
                                                }}
                                            >
                                                {framework.label}
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