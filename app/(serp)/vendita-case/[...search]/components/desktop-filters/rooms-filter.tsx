import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { FilterButton } from "../filter-button-popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function RoomsFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [rooms, setRooms] = useState<string[]>(searchParams.get('rooms')?.split(',') || [])
    const [bathrooms, setBathrooms] = useState<string[]>(searchParams.get('bathrooms')?.split(',') || [])
    const [isOpen, setIsOpen] = useState(false)

    const isRoomsFilterActive = rooms.length > 0 || bathrooms.length > 0
    const formattedRoomsRange = isRoomsFilterActive
        ? `${rooms.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')} camere / ${bathrooms.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')} bagni`
        : 'Locali'

    const handleDelete = () => {
        const params = new URLSearchParams(searchParams);
        setRooms([]);
        setBathrooms([]);
        params.delete('rooms');
        params.delete('bathrooms');
        router.push(`?${params.toString()}`);
    };

    const handleApply = () => {
        const params = new URLSearchParams(searchParams)
        
        rooms.forEach(room => {
            params.append('rooms', room)
        })

        bathrooms.forEach(bathroom => {
            params.append('bathrooms', bathroom)
        })

        if (rooms.length === 0) {
            params.delete('rooms')
        }

        if (bathrooms.length === 0) {
            params.delete('bathrooms')
        }

        setIsOpen(false)
        router.push(`?${params.toString()}`)
    }

    return (
        <FilterButton label={formattedRoomsRange}
            onDelete={handleDelete}
            showDeleteIcon={isRoomsFilterActive}
            open={isOpen}
            setOpen={setIsOpen}
        >
            <div className="space-y-6">
                <div>
                    <h3 className="text-base font-semibold mb-3 text-gray-700">Stanze</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['1', '2', '3', '4', '5', '5+'].map(room => (
                            <Label
                                key={room}
                                className={`flex items-center justify-center space-x-2 cursor-pointer p-2 rounded-lg transition-colors duration-200 ${
                                    rooms.includes(room) ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <Checkbox
                                    checked={rooms.includes(room)}
                                    onCheckedChange={(checked) => {
                                        setRooms(prev => 
                                            checked 
                                                ? [...prev, room]
                                                : prev.filter(r => r !== room)
                                        )
                                    }}
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium">{room}</span>
                            </Label>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-semibold mb-3 text-gray-700">Bagni</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['1', '2', '3', '4', '5', '5+'].map(bathroom => (
                            <Label
                                key={bathroom}
                                className={`flex items-center justify-center space-x-2 cursor-pointer p-2 rounded-lg transition-colors duration-200 ${
                                    bathrooms.includes(bathroom) ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <Checkbox
                                    checked={bathrooms.includes(bathroom)}
                                    onCheckedChange={(checked) => {
                                        setBathrooms(prev => 
                                            checked 
                                                ? [...prev, bathroom]
                                                : prev.filter(b => b !== bathroom)
                                        )
                                    }}
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium">{bathroom}</span>
                            </Label>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <Button onClick={handleApply}>Applica</Button>
            </div>
        </FilterButton>
    )
}