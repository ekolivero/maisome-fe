import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useQueryStates } from "nuqs"
import { FilterButton } from "../filter-button-popover"
import { searchParams } from "@/lib/nuqs/searchParams"

export function PriceFilter() {
    const [{ price_min, price_max }, setQueryStates] = useQueryStates(
        { 
            price_min: searchParams.price_min, 
            price_max: searchParams.price_max 
        },
        { shallow: false }
    )

    const [tempPriceMin, setTempPriceMin] = useState<number | null>(price_min ?? null)
    const [tempPriceMax, setTempPriceMax] = useState<number | null>(price_max ?? null)
    const [isOpen, setIsOpen] = useState(false)

    const maxPriceRef = useRef<HTMLInputElement>(null);

    const formatPrice = (price: number) => price.toLocaleString('it-IT') + ' €';
    const isPriceFilterActive = price_min !== null || price_max !== null;
    const formattedPriceRange = isPriceFilterActive
        ? `${price_min ? formatPrice(price_min) : 'Min'} - ${price_max ? formatPrice(price_max) : 'Max'}`
        : 'Prezzo';

    useEffect(() => {
        if (tempPriceMin !== null && tempPriceMax !== null && tempPriceMin > tempPriceMax) {
            setTempPriceMin(tempPriceMax);
            setTempPriceMax(tempPriceMin);
        }
    }, [isOpen]);

    const handleDelete = () => {
        setQueryStates({ price_min: null, price_max: null })
        setTempPriceMin(null)
        setTempPriceMax(null)
    };

    useEffect(() => {
        if (maxPriceRef.current) {
            maxPriceRef.current.focus();
        }
    }, []);

    const handleApply = () => {
        let newPriceMin = tempPriceMin
        let newPriceMax = tempPriceMax

        if (newPriceMin !== null && newPriceMax !== null && newPriceMin > newPriceMax) {
            [newPriceMin, newPriceMax] = [newPriceMax, newPriceMin]
        }

        setQueryStates({ price_min: newPriceMin, price_max: newPriceMax })
        setIsOpen(false)
    }

    return (
        <FilterButton label={formattedPriceRange}
            onDelete={handleDelete}
            showDeleteIcon={isPriceFilterActive}
            open={isOpen}
            setOpen={setIsOpen}
        >
            <label className="block text-sm font-medium text-gray-700">Prezzo</label>
            <div className="flex space-x-2 mt-2">
                <Input
                    placeholder="Min"
                    value={tempPriceMin?.toLocaleString('it-IT') || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/\./g, '');
                        if (!/^\d*$/.test(value)) {
                            return;
                        }
                        setTempPriceMin(value ? Number(value) : null);
                    }}
                    className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:!ring-transparent"
                />
                <Input
                    ref={maxPriceRef}
                    placeholder="Max"
                    value={tempPriceMax?.toLocaleString('it-IT') || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/\./g, '');
                        if (!/^\d*$/.test(value)) {
                            return;
                        }
                        setTempPriceMax(value ? Number(value) : null);
                    }}
                    className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:!ring-transparent"
                />
            </div>
            <div className="flex justify-end mt-4">
                <a href="#" className="mr-4 text-sm font-medium hover:underline">
                    Quanto posso permettermi?
                </a>
                <Button onClick={handleApply}>Applica</Button>
            </div>
        </FilterButton>
    )
}
