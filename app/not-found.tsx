import { Button } from "@/components/ui/button"
import Link from 'next/link'
import SearchInput from "@/components/search-input"
import Image from "next/image"

const cities = [
    { name: 'Milano', link: '/vendita-case/milano/milano' },
    { name: 'Roma', link: '/vendita-case/roma/roma' },
    { name: 'Napoli', link: '/vendita-case/napoli/napoli' },
    { name: 'Torino', link: '/vendita-case/torino/torino' },

]

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b flex flex-col items-center justify-start p-8">
            <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <Image
                        className="block drop-shadow-md"
                        src={"/logo.png"}
                        alt="Logo"
                        width={240}
                        height={120}
                        priority
                    />
                </div>

                <h1 className="text-5xl font-bold mb-4 text-gray-900">Oops! Pagina Non Trovata</h1>
                <p className="text-2xl text-gray-600">Non preoccuparti, effettua una nuova ricerca</p>
            </div>

            <div className="w-full max-w-lg mb-12">
                <SearchInput  />
            </div>

            <div className="w-full max-w-2xl mt-12">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Le città più popolari</h2>
                <div className="grid grid-cols-2 gap-6">
                    {cities.map((city) => (
                        <Link key={city.name} href={city.link} passHref>
                            <Button
                                variant="outline"
                                className="w-full h-auto py-6 flex flex-col items-center justify-center text-gray-700 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md"
                            >
                                {city.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            <p className="mt-12 text-sm text-gray-500">
                Hai bisogno di assistenza? <Link href="/contatti" className="text-blue-500 hover:underline font-medium">Contatta il nostro team di supporto</Link>
            </p>
        </div>
    )
}