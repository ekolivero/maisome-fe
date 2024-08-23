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
    const [categories, setCategories] = useState<string[]>(searchParams.get('categories')?.split(',') || [])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)

    const isCategoryFilterActive = categories.length > 0
    const formattedCategory = isCategoryFilterActive
        ? `${categories[0]}${categories.length > 1 ? ` + ${categories.length - 1}` : ''}`
        : "Tipologia"

    const handleDelete = () => {
        const params = new URLSearchParams(searchParams)
        setCategories([])
        params.delete('categories')
        router.push(`?${params.toString()}`)
    }

    const handleToggleCategory = (selectedCategory: string) => {
        setSelectedCategories(prev => 
            prev.includes(selectedCategory)
                ? prev.filter(cat => cat !== selectedCategory)
                : [...prev, selectedCategory]
        )
    }

    const handleApply = () => {
        const params = new URLSearchParams(searchParams)
        if (selectedCategories.length > 0) {
            params.delete('categories')
            selectedCategories.forEach(category => {
                params.append('categories', category)
            })
        } else {
            params.delete('categories')
        }
        setCategories(selectedCategories)
        router.push(`?${params.toString()}`)
        setIsOpen(false)
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
                        className={`h-auto flex-col items-center justify-center hover:bg-accent ${selectedCategories.includes(type.name) ? 'bg-accent' : ''}`}
                        onClick={() => handleToggleCategory(type.name)}
                    >
                        <type.icon className={`mb-2 h-6 w-6 ${selectedCategories.includes(type.name) ? 'text-primary' : ''}`} />
                        <span className={`text-sm font-normal text-center ${selectedCategories.includes(type.name) ? 'font-semibold' : ''}`}>{type.name}</span>
                    </Button>
                ))}
            </div>
            <Button 
                className="w-full mt-4" 
                onClick={handleApply}
            >
                Applica
            </Button>
        </FilterButton>
    )
}