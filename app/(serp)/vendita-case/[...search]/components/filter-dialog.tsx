import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function FilterDialog({ isOpen, setIsOpenDialog }: { isOpen: boolean, setIsOpenDialog: (open: boolean) => void }) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpenDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Modifica ricerca</DialogTitle>
                        <DialogDescription>
                            Applica i filtri di tuo interesse. Clicca su Salva per confermare.
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm setIsOpenDialog={setIsOpenDialog} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpenDialog}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Modifica ricerca</DrawerTitle>
                    <DrawerDescription>
                        Applica i filtri di tuo interesse. Clicca su Salva per confermare.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" setIsOpenDialog={setIsOpenDialog} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Chiudi</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const priceRanges = [
    { value: '0', label: '€0' },
    { value: '50000', label: '€50,000' },
    { value: '100000', label: '€100,000' },
    { value: '200000', label: '€200,000' },
    { value: '300000', label: '€300,000' },
    { value: '400000', label: '€400,000' },
    { value: '500000', label: '€500,000' },
    { value: '750000', label: '€750,000' },
    { value: '1000000', label: '€1,000,000' },
    { value: '1000001', label: '€1,000,000+' },
]

function ProfileForm({ className, setIsOpenDialog }: { className?: string, setIsOpenDialog: (open: boolean) => void}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [minPrice, setMinPrice] = useState(searchParams.get('prezzoMinimo') || '')
    const [maxPrice, setMaxPrice] = useState(searchParams.get('prezzoMassimo') || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        if (minPrice) params.set('prezzoMinimo', minPrice)
        else params.delete('prezzoMinimo')
        if (maxPrice) params.set('prezzoMassimo', maxPrice)
        else params.delete('prezzoMassimo')
        router.push('?' + params.toString())
        setIsOpenDialog(false)
    }

    return (
        <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-2">
                <Label htmlFor="minPrice">Prezzo Minimo</Label>
                <Select onValueChange={setMinPrice} value={minPrice}>
                    <SelectTrigger id="minPrice">
                        <SelectValue placeholder="Select minimum price" />
                    </SelectTrigger>
                    <SelectContent>
                        {priceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="maxPrice">Prezzo Massimo</Label>
                <Select onValueChange={setMaxPrice} value={maxPrice}>
                    <SelectTrigger id="maxPrice">
                        <SelectValue placeholder="Select maximum price" />
                    </SelectTrigger>
                    <SelectContent>
                        {priceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">Applica filtro</Button>
        </form>
    )
}
