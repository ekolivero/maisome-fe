'use client'

import { GoogleMapsEmbed } from '@next/third-parties/google'

export const defaultMapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '15px 0px 0px 15px',
};

const MapView = ({ lat, long }: { lat: number, long: number }) => {
    return (
        <div>
            <GoogleMapsEmbed
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string}
                height={375}
                width="100%"
                mode="place"
                q={`${lat},${long}`}
                zoom="14"
                loading='lazy'
                allowfullscreen={false}
                language='it'
            />
        </div>
    )
};

export { MapView };