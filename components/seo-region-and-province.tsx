import createClient from "openapi-fetch";
import type { paths } from "@/app/types/schema";
import Link from "next/link";
import { components } from "@/app/types/schema";

type RegionList = components["schemas"]["HomeAggregationRegion"][]

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

const balanceColumns = (data: RegionList) => {
    let leftSum = 0
    let rightSum = 0
    const left: any[] = []
    const right: any[] = []

    data.forEach((region) => {
        if (leftSum <= rightSum) {
            left.push(region)
            leftSum += region.provinces.length
        } else {
            right.push(region)
            rightSum += region.provinces.length
        }
    })

    return [left, right]
}

export default async function SeoRegionAndProvince() {

    const { data } = await client.GET('/houses/aggregation/homepage', {
        cache: 'force-cache'
    })

    if (!data?.aggregation) return null


    const { aggregation } = data 

    const [leftColumn, rightColumn] = balanceColumns(aggregation)

    const RegionList = ({ regions }: { regions: RegionList}) => (
        <div className="space-y-6">
            {regions.map((region) => (
                <div key={region.region} className="border-l-2 border-blue-200 pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Link href={`/vendita-case/${region.region.toLowerCase().replaceAll(" ", "-").replaceAll("'", "-") }`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            {region.region}
                        </Link>
                        <span className="text-gray-500 ml-2 text-sm">({region.count})</span>
                    </h3>
                    <ul className="space-y-1">
                        {region.provinces.map((province) => (
                            <li key={province.province} className="flex items-center text-sm">
                                <Link
                                    href={`/vendita-case/${province.province.toLowerCase().replaceAll(" ", "-").replaceAll("'", "-")}-provincia`}
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex-grow"
                                >
                                    {province.province}
                                </Link>
                                <span className="text-gray-500">{province.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <RegionList regions={leftColumn!} />
                </div>
                <div className="flex-1">
                    <RegionList regions={rightColumn!} />
                </div>
            </div>
        </div>
    )
}