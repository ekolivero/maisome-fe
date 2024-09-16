import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Warehouse, Home, Building2, Castle, HouseIcon, Factory } from "lucide-react"
import { FilterButton } from "../filter-button-popover"
import { HouseType, HouseTypeInfo, getHouseTypeFromString } from "@/lib/types/house-enum"
import { useRouter, usePathname } from 'next/navigation'

const propertyTypes: { type: HouseType; icon: React.ElementType }[] = [
    { type: HouseType.RUSTICO, icon: Warehouse },
    { type: HouseType.APPARTAMENTO, icon: Building2 },
    { type: HouseType.VILLA, icon: Castle },
    { type: HouseType.VILLA_BIFAMILIARE, icon: HouseIcon },
    { type: HouseType.LOFT, icon: Factory },
    { type: HouseType.CASA_INDIPENDENTE, icon: Home },
    // Add other types as needed
]

export function CategoryFilter() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<HouseTypeInfo | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const currentCategory = pathname.split('/')[1]
        try {
            const houseTypeInfo = getHouseTypeFromString(currentCategory)
            setSelectedCategory(houseTypeInfo)
        } catch {
            setSelectedCategory(null)
        }
    }, [pathname])

    const handleCategoryClick = (type: HouseType) => {
        const currentPath = pathname.split('/')
        const newType = `vendita-${type.toLowerCase().replace(/ /g, '-')}`
        
        // Replace the current house type with the new one
        currentPath[1] = newType
        
        const newPath = currentPath.join('/')
        router.push(newPath)
        setIsOpen(false)
    }

    const handleDelete = () => {
        const currentPath = pathname.split('/')
        currentPath[1] = 'vendita-case'
        const newPath = currentPath.join('/')
        router.push(newPath)
        setSelectedCategory(null)
    }

    return (
        <FilterButton 
            label={selectedCategory?.singular === HouseType.CASE ? "Tipologia" : selectedCategory?.singular || "Tipologia"}
            onDelete={handleDelete}
            showDeleteIcon={selectedCategory?.singular !== HouseType.CASE}
            open={isOpen}
            setOpen={setIsOpen}
        >
            <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map(({ type, icon: Icon }) => (
                    <Button
                        key={type}
                        variant="outline"
                        className={`h-auto flex-col items-center justify-center hover:bg-accent ${selectedCategory?.singular === type ? 'bg-accent' : ''}`}
                        onClick={() => handleCategoryClick(type)}
                    >
                        <Icon className={`mb-2 h-6 w-6 ${selectedCategory?.singular === type ? 'text-primary' : ''}`} />
                        <span className={`text-sm font-normal text-center ${selectedCategory?.singular === type ? 'font-semibold' : ''}`}>{type}</span>
                    </Button>
                ))}
            </div>
        </FilterButton>
    )
}