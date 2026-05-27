"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon path issue with Next.js
const attractionIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface MapPin {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: "attraction" | "food";
}

interface CityMapProps {
    center: [number, number];
    attractions: MapPin[];
    foods: MapPin[];
}

export default function CityMap({ center, attractions, foods }: CityMapProps) {
    useEffect(() => {
        // Ensure leaflet CSS is loaded
    }, []);

    const allPins = [...attractions, ...foods];

    return (
        <MapContainer
            center={center}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {allPins.map((pin) => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={attractionIcon}>
                    <Popup>
                        <div className="font-medium text-sm">{pin.name}</div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
