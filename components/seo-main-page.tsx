import Link from 'next/link'
import sitemapData from '@/app/sitemap/sitemap.json'

export default function SEOMainPage() {
    return (
        <div className="max-w-full md:max-w-7xl md:mx-auto px-4 py-8">
            <div className="grid gap-8" role="navigation" aria-label="Navigazione regioni e province">
                {sitemapData.map((region) => (
                    <div key={region.url} className="space-y-4">
                        <h2 className="text-2xl font-semibold">
                            <Link 
                                href={`/vendita-case/${region.url}`}
                                className="text-blue-600 hover:text-blue-800"
                                title={`Immobili in ${region.name}`}
                            >
                                {region.name}
                            </Link>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {region.province.map((province) => (
                                <div key={province.url} className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium mb-3">
                                        <Link 
                                            href={`/vendita-case/${province.url}`}
                                            className="text-blue-600 hover:text-blue-800"
                                            title={`Immobili in vendita e affitto a ${province.name}`}
                                        >
                                            Immobili a {province.name}
                                        </Link>
                                    </h3>
                                    
                                    <div className="relative">
                                        <ul className="space-y-2 text-sm" aria-label={`Comuni di ${province.name}`}>
                                            {province.comuni.slice(0, 5).map((comune) => (
                                                <li key={comune.url}>
                                                    <Link 
                                                        href={`/vendita-case/${comune.url}`}
                                                        className="text-gray-600 hover:text-blue-600"
                                                        title={`Case a ${comune.name}`}
                                                    >
                                                        Case a {comune.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>

                                        {province.comuni.length > 5 && (
                                            <details className="mt-2">
                                                <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                                                    Mostra altri {province.comuni.length - 5} comuni
                                                </summary>
                                                <ul className="space-y-2 text-sm mt-2">
                                                    {province.comuni.slice(5).map((comune) => (
                                                        <li key={comune.url}>
                                                            <Link 
                                                                href={`/vendita-case/${comune.url}`}
                                                                className="text-gray-600 hover:text-blue-600"
                                                                title={`Case a ${comune.name}`}
                                                            >
                                                                Case a {comune.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}