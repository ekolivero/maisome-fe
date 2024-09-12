'use client'

import { Facebook, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'

export function FooterComponent() {
    return (
        <footer className="bg-white text-gray-600 py-8">
            <div className="container mx-auto px-4">
                <nav className="flex flex-wrap justify-center mb-8">
                    <a href="#" className="px-4 py-2 hover:text-gray-900 transition-colors">Chi Siamo</a>
                    <a href="#" className="px-4 py-2 hover:text-gray-900 transition-colors">Carriere</a>
                    <a href="#" className="px-4 py-2 hover:text-gray-900 transition-colors">Pubblicità</a>
                    <a href="#" className="px-4 py-2 hover:text-gray-900 transition-colors">Termini di Utilizzo</a>
                    <a href="#" className="px-4 py-2 hover:text-gray-900 transition-colors">Portale Privacy</a>
                    <a href="#" className="px-4 py-2 hover:text-gray-900 transition-colors">Preferenze Cookie</a>
                </nav>

                <div className="text-center mb-8">
                    <a href="#" className="text-blue-600 hover:underline">
                        Non vendere o condividere le mie informazioni personali→
                    </a>
                </div>

                <div className="text-center text-sm mb-8 max-w-2xl mx-auto">
                    <p className="mb-4">
                        Maisome si impegna a garantire l&apos;accessibilità digitale per tutti, incluse le persone con disabilità.
                        La nostra missione è aiutare ogni individuo a trovare la casa perfetta, indipendentemente dalle proprie esigenze specifiche.
                    </p>
                    <p>
                        Lavoriamo costantemente per migliorare l&apos;accessibilità del nostro sito web.
                        Se desideri segnalare un problema o richiedere una modifica, ti preghiamo di contattarci.
                    </p>
                </div>

                <div className="flex justify-center items-center mb-8 flex-wrap">
                    <Image
                        src={"/logo.png"}
                        alt="Logo"
                        width={100}
                        height={50}
                        priority
                    />
                    <span className="ml-4 mr-2">Seguici:</span>
                    <a href="#" className="mx-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Facebook">
                        <Facebook className="h-6 w-6" />
                    </a>
                    <a href="#" className="mx-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Instagram">
                        <Instagram className="h-6 w-6" />
                    </a>
                    <a href="#" className="mx-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="TikTok">
                        <Youtube className="h-6 w-6" />
                    </a>
                    <span className="ml-4">© {new Date().getFullYear()} Maisome <span className="align-middle">&#169;</span></span>
                </div>
            </div>
        </footer>
    )
}