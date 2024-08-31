import { useState, useEffect } from "react"
import { FilterButton } from "../filter-button-popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useQueryStates } from "nuqs"
import { searchParams } from "@/lib/nuqs/searchParams"

export function RoomsFilter() {
    const [{ rooms, bathrooms }, setQueryStates] = useQueryStates(
        { 
            rooms: searchParams.rooms,
            bathrooms: searchParams.bathrooms
        },
        { shallow: false }
    )

    const [isOpen, setIsOpen] = useState(false)
    const [selectedRooms, setSelectedRooms] = useState<string[]>(rooms || [])
    const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>(bathrooms || [])

    const isRoomsFilterActive = (rooms && rooms.length > 0) || (bathrooms && bathrooms.length > 0)
    const formattedRoomsRange = isRoomsFilterActive
        ? `${(rooms || []).sort((a, b) => parseInt(a) - parseInt(b)).join(', ')} camere / ${(bathrooms || []).sort((a, b) => parseInt(a) - parseInt(b)).join(', ')} bagni`
        : 'Locali'

    const handleDelete = () => {
        setQueryStates({ rooms: null, bathrooms: null })
        setSelectedRooms([])
        setSelectedBathrooms([])
    }

    const handleApply = () => {
        setQueryStates({
            rooms: selectedRooms.length > 0 ? selectedRooms : null,
            bathrooms: selectedBathrooms.length > 0 ? selectedBathrooms : null
        })
        setIsOpen(false)
    }

    useEffect(() => {
        setSelectedRooms(rooms || [])
        setSelectedBathrooms(bathrooms || [])
    }, [rooms, bathrooms])

    return (
        <FilterButton label={formattedRoomsRange}
            onDelete={handleDelete}
            showDeleteIcon={isRoomsFilterActive ?? false}
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
                                    selectedRooms.includes(room) ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <Checkbox
                                    checked={selectedRooms.includes(room)}
                                    onCheckedChange={(checked) => {
                                        setSelectedRooms(prev => 
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
                                    selectedBathrooms.includes(bathroom) ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <Checkbox
                                    checked={selectedBathrooms.includes(bathroom)}
                                    onCheckedChange={(checked) => {
                                        setSelectedBathrooms(prev => 
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