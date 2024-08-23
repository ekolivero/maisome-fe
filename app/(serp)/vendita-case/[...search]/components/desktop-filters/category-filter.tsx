import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Warehouse, Home, Building2, Castle, HouseIcon, Factory } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { FilterButton } from "../filter-button-popover"

const propertyTypes = [
    { name: "Rustico", icon: Warehouse },
    { name: "Mansarda", icon: Home },
    { name: "Appartamento", icon: Building2 },
    { name: "Villa unifamiliare", icon: Castle },
    { name: "Villa bifamiliare", icon: HouseIcon },
    { name: "Loft", icon: Factory },
]

export function CategoryFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [category, setCategory] = useState<string | null>(searchParams.get('category'))
    const [isOpen, setIsOpen] = useState(false)

    const isCategoryFilterActive = category !== null
    const formattedCategory = isCategoryFilterActive ? category : "Categoria"

    const handleDelete = () => {
        const params = new URLSearchParams(searchParams)
        setCategory(null)
        params.delete('category')
        router.push(`?${params.toString()}`)
    }

    const handleApply = (selectedCategory: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('category', selectedCategory)
        setCategory(selectedCategory)
        setIsOpen(false)
        router.push(`?${params.toString()}`)
    }

    return (
        <FilterButton 
            label={formattedCategory}
            onDelete={handleDelete}
            showDeleteIcon={isCategoryFilterActive}
            open={isOpen}
            setOpen={setIsOpen}
        >
            <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map((type) => (
                    <Button
                        key={type.name}
                        variant="outline"
                        className={`h-auto flex-col items-center justify-center hover:bg-accent ${category === type.name ? 'bg-accent' : ''}`}
                        onClick={() => handleApply(type.name)}
                    >
                        <type.icon className={`mb-2 h-6 w-6 ${category === type.name ? 'text-primary' : ''}`} />
                        <span className={`text-sm font-normal text-center ${category === type.name ? 'font-semibold' : ''}`}>{type.name}</span>
                    </Button>
                ))}
            </div>
        </FilterButton>
    )
}