import { useCallback } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { operations } from "@/app/types/schema"

type FilterState = operations["houses_by_id_houses_location_ids__get"]["parameters"]["query"]

export function FilterDialog({ isOpen, setIsOpenDialog }: { isOpen: boolean, setIsOpenDialog: (open: boolean) => void }) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSubmit = useCallback((filters: FilterState) => {
        const params = new URLSearchParams(searchParams)
        const ids = searchParams.getAll('ids')

        // Helper function to handle array parameters
        const setArrayParam = (key: string, values: string[] | null) => {
            params.delete(key) // Remove all existing values for this key
            if (values) {
                values.forEach(value => params.append(key, value))
            }
        }

        // Update URL parameters based on the filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'rooms' || key === 'bathrooms' || key === 'categories') {
                    setArrayParam(key, value as string[] | null)
                } else if (typeof value === 'number') {
                    params.set(key, value.toString())
                } else {
                    params.set(key, value as string)
                }
            } else {
                params.delete(key)
            }
        })

        if (ids.length > 0) {
            ids.forEach(id => params.append('ids', id))
        } else {
            params.delete('ids')
        }

        // Use router.push to update the URL and trigger a server refetch
        router.push(`?${params.toString()}`)
        setIsOpenDialog(false)
    }, [router, searchParams, setIsOpenDialog])

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpenDialog}>
            <DrawerContent className="flex flex-col h-[100dvh] max-h-[100dvh] z-[10000000000000000000]">
                <DrawerHeader className="flex-shrink-0">
                    <DrawerTitle>Modifica ricerca</DrawerTitle>
                </DrawerHeader>
                <ScrollArea className="flex-grow">
                    <div className="px-4 pb-4">
                        <ProfileForm onSubmit={(filters) => {
                            handleSubmit(filters)
                            setIsOpenDialog(false)
                        }} />
                    </div>
                </ScrollArea>
                <DrawerFooter className="flex-shrink-0 flex justify-between flex-row gap-4">
                    <DrawerClose asChild>
                        <Button className="w-full" variant="outline">Chiudi</Button>
                    </DrawerClose>
                    <Button className="w-full bg-[#0070f3]" type="submit" form="filter-form">Applica Filtri</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const FilterGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        {children}
    </div>
)

function ProfileForm({ onSubmit }: { onSubmit: (filters: FilterState) => void }) {
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState<FilterState>({
        ids: [],
        categories: searchParams.get('categories')?.split(',') || null,
        contract: searchParams.get('contract') || null,
        condition: searchParams.get('condition') || null,
        price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : null,
        price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : null,
        surface_min: searchParams.get('surface_min') ? Number(searchParams.get('surface_min')) : null,
        surface_max: searchParams.get('surface_max') ? Number(searchParams.get('surface_max')) : null,
        rooms: searchParams.get('rooms')?.split(',') || null,
        bathrooms: searchParams.get('bathrooms')?.split(',') || null,
        furniture: searchParams.get('furniture') || null,
        terrace: searchParams.get('terrace') || null,
        elevator: searchParams.get('elevator') || null,
        balcony: searchParams.get('balcony') || null,
    })

    const handleChange = (field: keyof FilterState, value: string | string[] | number | null) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    return (
        <form id="filter-form" onSubmit={(e) => {
            e.preventDefault();
            onSubmit(filters);
        }} className={cn("flex flex-col h-full bg-background")}>
            <ScrollArea className="flex-grow pr-4">
                <div className="space-y-4">
                    <FilterGroup title="Prezzo (€)">
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.price_min || ''}
                                onChange={(e) => handleChange('price_min', e.target.value ? Number(e.target.value) : null)}
                                className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:!ring-transparent"
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.price_max || ''}
                                onChange={(e) => handleChange('price_max', e.target.value ? Number(e.target.value) : null)}
                                className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:!ring-transparent"
                            />
                        </div>
                    </FilterGroup>

                    <Separator className="my-2" />

                    <FilterGroup title="Tipo di Proprietà">
                        <div className="grid grid-cols-2 gap-2">
                            {['Appartamento', 'Bilocale', 'Monolocale', 'Mansarda', 'Villa unifamiliare'].map(category => (
                                <Label key={category} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-accent rounded-md">
                                    <Checkbox
                                        checked={filters.categories?.includes(category)}
                                        onCheckedChange={(checked) => {
                                            const newCategories = checked
                                                ? [...(filters.categories || []), category]
                                                : filters.categories?.filter(c => c !== category) || []
                                            handleChange('categories', newCategories.length > 0 ? newCategories : null)
                                        }}
                                    />
                                    <span className="text-sm">{category}</span>
                                </Label>
                            ))}
                        </div>
                    </FilterGroup>

                    <Separator className="my-2" />

                    <FilterGroup title="Superficie (m²)">
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.surface_min || ''}
                                onChange={(e) => handleChange('surface_min', e.target.value ? Number(e.target.value) : null)}
                                className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:!ring-transparent"
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.surface_max || ''}
                                onChange={(e) => handleChange('surface_max', e.target.value ? Number(e.target.value) : null)}
                                className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:!ring-transparent" 
                            />
                        </div>
                    </FilterGroup>

                    <Separator className="my-2" />

                    <FilterGroup title="Stanze">
                        <div className="flex flex-wrap gap-2">
                            {['1', '2', '3', '4', '5', '5+'].map(room => (
                                <Button
                                    key={room}
                                    type="button"
                                    variant={filters.rooms?.includes(room) ? "default" : "outline"}
                                    onClick={() => {
                                        const newRooms = filters.rooms?.includes(room)
                                            ? filters.rooms.filter(r => r !== room)
                                            : [...(filters.rooms || []), room]
                                        handleChange('rooms', newRooms.length > 0 ? newRooms : null)
                                    }}
                                    className="flex-1"
                                >
                                    {room}
                                </Button>
                            ))}
                        </div>
                    </FilterGroup>

                    <FilterGroup title="Bagni">
                        <div className="flex flex-wrap gap-2">
                            {['1', '2', '3+'].map(bathroom => (
                                <Button
                                    key={bathroom}
                                    type="button"
                                    variant={filters.bathrooms?.includes(bathroom) ? "default" : "outline"}
                                    onClick={() => {
                                        const newBathrooms = filters.bathrooms?.includes(bathroom)
                                            ? filters.bathrooms.filter(b => b !== bathroom)
                                            : [...(filters.bathrooms || []), bathroom]
                                        handleChange('bathrooms', newBathrooms.length > 0 ? newBathrooms : null)
                                    }}
                                    className="flex-1"
                                >
                                    {bathroom}
                                </Button>
                            ))}
                        </div>
                    </FilterGroup>

                    <Separator className="my-2" />

                    <FilterGroup title="Caratteristiche Aggiuntive">
                        <div className="grid grid-cols-2 gap-2">
                            <Label key={'arredato'} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-accent rounded-md">
                                <Checkbox
                                    checked={filters.furniture === 'Arredato'}
                                    onCheckedChange={(checked) => handleChange('furniture', checked ? 'Arredato' : null)}
                                />
                                <span className="text-sm">Arredato</span>
                            </Label>

                            {[
                                { key: 'terrace', label: 'Terrazza' },
                                { key: 'elevator', label: 'Ascensore' },
                                { key: 'balcony', label: 'Balcone' }
                            ].map(feature => (
                                <Label key={feature.key} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-accent rounded-md">
                                    <Checkbox
                                        checked={filters[feature.key as keyof FilterState] === 'True'}
                                        onCheckedChange={(checked) => handleChange(feature.key as keyof FilterState, checked ? 'True' : null)}
                                    />
                                    <span className="text-sm">{feature.label}</span>
                                </Label>
                            ))}
                        </div>
                    </FilterGroup>
                </div>
            </ScrollArea>
        </form>
    )
}

export default ProfileForm