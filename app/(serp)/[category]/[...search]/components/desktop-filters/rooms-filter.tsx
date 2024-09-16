import { useState, useEffect } from "react"
import { FilterButton } from "../filter-button-popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'

export function RoomsFilter() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedRooms, setSelectedRooms] = useState<string[]>([])
    const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([])
    const router = useRouter()
    const pathname = usePathname()

    const isRoomsFilterActive = selectedRooms.length > 0 || selectedBathrooms.length > 0
    const formattedRoomsRange = isRoomsFilterActive
        ? `${selectedRooms.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')} camere / ${selectedBathrooms.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')} bagni`
        : 'Locali'

    const handleDelete = () => {
        setSelectedRooms([])
        setSelectedBathrooms([])
        updateURL([], [])
    }

    const handleApply = () => {
        updateURL()
        setIsOpen(false)
    }

    const updateURL = (rooms = selectedRooms, bathrooms = selectedBathrooms) => {
        const currentPath = pathname.split('/')
        const location = currentPath.slice(2).join('/') // Get the current location
        const baseURL = `/vendita-case/${location}` // Always use "vendita-case"
        
        const params = new URLSearchParams(window.location.search)
        if (rooms.length > 0) params.set('rooms', rooms.join(','))
        else params.delete('rooms')
        if (bathrooms.length > 0) params.set('bathrooms', bathrooms.join(','))
        else params.delete('bathrooms')

        const newURL = `${baseURL}${params.toString() ? '?' + params.toString() : ''}`
        router.push(newURL)
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const roomsParam = params.get('rooms')
        const bathroomsParam = params.get('bathrooms')

        if (roomsParam) setSelectedRooms(roomsParam.split(','))
        if (bathroomsParam) setSelectedBathrooms(bathroomsParam.split(','))
    }, [])

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