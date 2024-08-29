"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type DialogProps } from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useCallback, useState, useEffect } from "react"
import { SanityDocument } from "next-sanity"
import { useDebounce } from "@/lib/hooks/use-debounce"

export function CommandMenu({ ...props }: DialogProps) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [searchResults, setSearchResults] = useState<SanityDocument[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300) // 300ms delay

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return
                }

                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    const fetchLatestArticles = useCallback(async () => {
        const response = await fetch('/api/latest-posts')
        if (response.ok) {
            const posts = await response.json()
            setSearchResults(posts)
        }
    }, [])

    const handleSearch = useCallback(async (value: string) => {
        if (value.length > 2) {
            const response = await fetch(`/api/search-posts?searchTerm=${encodeURIComponent(value)}`)
            if (response.ok) {
                const posts = await response.json()
                setSearchResults(posts)
            } else {
                setSearchResults([])
            }
        } else {
            fetchLatestArticles()
        }
    }, [fetchLatestArticles])

    useEffect(() => {
        if (open) {
            fetchLatestArticles()
        }
    }, [open, fetchLatestArticles])

    useEffect(() => {
        if (debouncedSearchTerm) {
            handleSearch(debouncedSearchTerm)
        }
    }, [debouncedSearchTerm, handleSearch])

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                )}
                onClick={() => setOpen(true)}
                {...props}
            >
                <span className="hidden lg:inline-flex">Cerca articolo...</span>
                <span className="inline-flex lg:hidden">Cerca...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput 
                    placeholder="Inserisci argomento..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                />
                <CommandList>
                    <CommandEmpty>
                        {searchResults.length === 0 ? "Nessun risultato" : "Caricamento articoli..."}
                    </CommandEmpty>
                    <CommandGroup heading={searchResults.length > 0 ? "Risultati" : "Ultimi articoli"}>
                        {searchResults.map((post) => (
                            <CommandItem
                                key={post._id}
                                onSelect={() => runCommand(() => router.push(`/blog/${post.slug.current}`))}
                            >
                                {post.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                </CommandList>
            </CommandDialog>
        </>
    )
}