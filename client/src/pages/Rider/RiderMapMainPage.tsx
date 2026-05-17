import { useEffect, useState } from "react";
import DeliveryInfoPanel from "./components/DeliveryInfoPanel";
import MapView from "./components/MapvVew";

export interface ActiveDelivery {
    delivery_id: number;
    customer_name: string;
    contact_number: string;
    delivery_address: string;
    gps_lat: number;
    gps_lng: number;
    order_items: {
        name: string;
        size: string;
        quantity: number;
    }[];
    total_amount: number;
    payment_method: string;
    payment_status: "unpaid" | "paid";
    status: "pending" | "in_transit" | "delivered";
}

// Hardcoded active delivery for starter
const activeDelivery: ActiveDelivery = {
    delivery_id: 2,
    customer_name: "Juan Dela Cruz",
    contact_number: "09209876543",
    delivery_address: "45 Magsaysay Ave., Brgy. Dayao, Roxas City",
    gps_lat: 11.5886,
    gps_lng: 122.7510,
    order_items: [
        { name: "Purified Water", size: "5gal (New Container)", quantity: 1 },
        { name: "Purified Water", size: "1L", quantity: 4 },
    ],
    total_amount: 245.00,
    payment_method: "gcash",
    payment_status: "paid",
    status: "in_transit",
};

const RiderMapMainPage = () => {
    const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Map — Navigation";

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setRiderLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocationError(null);
            },
            () => {
                setLocationError("Unable to retrieve your location. Please enable GPS.");
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <>
            {/* Page Header */}
            <div className="mb-4">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Rider
                </p>
                <h1 className="text-2xl font-bold text-gray-800">
                    Navigation
                </h1>
            </div>

            {locationError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    ⚠️ {locationError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Map — takes up 2/3 */}
                <div className="md:col-span-2">
                    <MapView
                        delivery={activeDelivery}
                        riderLocation={riderLocation}
                    />
                </div>

                {/* Delivery Info Panel — 1/3 */}
                <div className="md:col-span-1">
                    <DeliveryInfoPanel
                        delivery={activeDelivery}
                        riderLocation={riderLocation}
                    />
                </div>
            </div>
        </>
    );
};

export default RiderMapMainPage;