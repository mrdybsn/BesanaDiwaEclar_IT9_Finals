import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { ActiveDelivery } from "../RiderMapMainPage";

// Fix default leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const riderIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const customerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface FitBoundsProps {
    riderLocation: { lat: number; lng: number } | null;
    customerLocation: { lat: number; lng: number };
}

const FitBounds = ({ riderLocation, customerLocation }: FitBoundsProps) => {
    const map = useMap();

    useEffect(() => {
        if (riderLocation) {
            const bounds = L.latLngBounds(
                [riderLocation.lat, riderLocation.lng],
                [customerLocation.lat, customerLocation.lng]
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView([customerLocation.lat, customerLocation.lng], 15);
        }
    }, [riderLocation, customerLocation, map]);

    return null;
};

interface MapViewProps {
    delivery: ActiveDelivery;
    riderLocation: { lat: number; lng: number } | null;
}

const MapView = ({ delivery, riderLocation }: MapViewProps) => {
    const customerLocation = { lat: delivery.gps_lat, lng: delivery.gps_lng };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                    🗺 Live Map
                </p>
                {riderLocation && (
                    <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        GPS Active
                    </span>
                )}
            </div>

            <MapContainer
                center={[customerLocation.lat, customerLocation.lng]}
                zoom={14}
                style={{ height: "480px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBounds
                    riderLocation={riderLocation}
                    customerLocation={customerLocation}
                />

                {/* Customer Pin */}
                <Marker
                    position={[customerLocation.lat, customerLocation.lng]}
                    icon={customerIcon}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-semibold">{delivery.customer_name}</p>
                            <p className="text-gray-500 text-xs">{delivery.delivery_address}</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Rider Pin */}
                {riderLocation && (
                    <Marker
                        position={[riderLocation.lat, riderLocation.lng]}
                        icon={riderIcon}
                    >
                        <Popup>
                            <p className="text-sm font-semibold">You are here</p>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;