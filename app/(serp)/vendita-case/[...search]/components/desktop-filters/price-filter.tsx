import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { FilterButton } from "../filter-button-popover"

export function PriceFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [priceMin, setPriceMin] = useState<number | null>(searchParams.get('price_min') ? Number(searchParams.get('price_min')) : null)
    const [priceMax, setPriceMax] = useState<number | null>(searchParams.get('price_max') ? Number(searchParams.get('price_max')) : null)
    const [appliedPriceMin, setAppliedPriceMin] = useState<number | null>(searchParams.get('price_min') ? Number(searchParams.get('price_min')) : null)
    const [appliedPriceMax, setAppliedPriceMax] = useState<number | null>(searchParams.get('price_max') ? Number(searchParams.get('price_max')) : null)
    const [isOpen, setIsOpen] = useState(false)

    const maxPriceRef = useRef<HTMLInputElement>(null);

    const formatPrice = (price: number) => price.toLocaleString('it-IT') + ' €';
    const isPriceFilterActive = appliedPriceMin !== null || appliedPriceMax !== null;
    const formattedPriceRange = isPriceFilterActive
        ? `${appliedPriceMin ? formatPrice(appliedPriceMin) : 'Min'} - ${appliedPriceMax ? formatPrice(appliedPriceMax) : 'Max'}`
        : 'Prezzo';

    useEffect(() => {
        // Ensure priceMin and priceMax are always in the correct order
        if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
            setPriceMin(priceMax);
            setPriceMax(priceMin);
        }
        // eslint-disable-next-line
    }, [isOpen]);

    const handleDelete = () => {
        const params = new URLSearchParams(searchParams);
        setPriceMin(null);
        setPriceMax(null);
        setAppliedPriceMin(null);
        setAppliedPriceMax(null);
        params.delete('price_min');
        params.delete('price_max');
        router.push(`?${params.toString()}`);
    };

    useEffect(() => {
        if (maxPriceRef.current) {
            maxPriceRef.current.focus();
        }
    }, []);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams)
        let newPriceMin = priceMin
        let newPriceMax = priceMax

        if (newPriceMin !== null && newPriceMax !== null) {
            if (newPriceMin > newPriceMax) {
                [newPriceMin, newPriceMax] = [newPriceMax, newPriceMin]
            }
            params.set('price_min', newPriceMin.toString())
            params.set('price_max', newPriceMax.toString())
            setAppliedPriceMin(newPriceMin)
            setAppliedPriceMax(newPriceMax)
        } else if (newPriceMin !== null) {
            params.set('price_min', newPriceMin.toString())
            params.delete('price_max')
            setAppliedPriceMin(newPriceMin)
            setAppliedPriceMax(null)
        } else if (newPriceMax !== null) {
            params.set('price_max', newPriceMax.toString())
            params.delete('price_min')
            setAppliedPriceMin(null)
            setAppliedPriceMax(newPriceMax)
        } else {
            params.delete('price_min')
            params.delete('price_max')
            setAppliedPriceMin(null)
            setAppliedPriceMax(null)
        }

        setPriceMin(newPriceMin)
        setPriceMax(newPriceMax)
        setIsOpen(false)
        router.push(`?${params.toString()}`)
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
                    value={priceMin?.toLocaleString('it-IT') || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/\./g, '');
                        if (!/^\d*$/.test(value)) {
                            return;
                        }
                        setPriceMin(value ? Number(value) : null);
                    }}
                    className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:!ring-transparent"
                />
                <Input
                    ref={maxPriceRef}
                    placeholder="Max"
                    value={priceMax?.toLocaleString('it-IT') || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/\./g, '');
                        if (!/^\d*$/.test(value)) {
                            return;
                        }
                        setPriceMax(value ? Number(value) : null);
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
