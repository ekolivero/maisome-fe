import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Warehouse, Home, Building2, Castle, HouseIcon, Factory } from "lucide-react"
import { useQueryStates } from "nuqs"
import { FilterButton } from "../filter-button-popover"
import { searchParams } from "@/lib/nuqs/searchParams"

const propertyTypes = [
    { name: "Rustico", icon: Warehouse },
    { name: "Mansarda", icon: Home },
    { name: "Appartamento", icon: Building2 },
    { name: "Villa unifamiliare", icon: Castle },
    { name: "Villa bifamiliare", icon: HouseIcon },
    { name: "Loft", icon: Factory },
]

export function CategoryFilter() {
    const [{ categories }, setQueryStates] = useQueryStates(
        { categories: searchParams.categories },
        { shallow: false }
    )

    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || [])

    const isCategoryFilterActive = categories && categories.length > 0
    const formattedCategory = isCategoryFilterActive
        ? `${categories[0]}${categories.length > 1 ? ` + ${categories.length - 1}` : ''}`
        : "Tipologia"

    const handleDelete = () => {
        setQueryStates({ categories: null })
        setSelectedCategories([])
    }

    const handleToggleCategory = (selectedCategory: string) => {
        setSelectedCategories(prev => 
            prev.includes(selectedCategory)
                ? prev.filter(cat => cat !== selectedCategory)
                : [...prev, selectedCategory]
        )
    }

    const handleApply = () => {
        setQueryStates({ categories: selectedCategories.length > 0 ? selectedCategories : null })
        setIsOpen(false)
    }

    useEffect(() => {
        setSelectedCategories(categories || [])
    }, [categories])

    return (
        <FilterButton 
            label={formattedCategory}
            onDelete={handleDelete}
            showDeleteIcon={isCategoryFilterActive ?? false}
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