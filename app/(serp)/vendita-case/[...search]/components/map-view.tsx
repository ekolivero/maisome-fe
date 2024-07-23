'use client'

//Map component Component from library
import { GoogleMap } from "@react-google-maps/api";
import { GoogleMapsEmbed } from '@next/third-parties/google'
//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 0px 0px 15px',
};

const MapView = ({ lat, long }: { lat: number, long: number }) => {
    return (
        <div>
            <GoogleMapsEmbed
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string}
                height={350}
                width="100%"
                mode="place"
                q={`${lat},${long}`}
                zoom="14"
            />
        </div>
    )
};

export { MapView };