import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";
import DeliveryInfoPanel from "./components/DeliveryInfoPanel";
import MapView from "./components/MapvVew";
import RiderDeliveryService, { mapApiDeliveryToActive } from "../../services/RiderDeliveryService";

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
    is_recurring: boolean;
    has_valid_gps: boolean;
    status: "pending" | "in_transit" | "delivered";
}

const RiderMapMainPage = () => {
    const [searchParams] = useSearchParams();
    const deliveryParam = searchParams.get("delivery");

    const [activeDelivery, setActiveDelivery] = useState<ActiveDelivery | null>(null);
    const [riderLocation, setRiderLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Map — Navigation";

        const load = async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const raw = await RiderDeliveryService.loadRawDeliveries({ scope: "active" });
                const targetId = deliveryParam ? Number(deliveryParam) : null;
                const match =
                    (targetId ? raw.find((d) => d.delivery_id === targetId) : null) ??
                    raw.find((d) => d.status === "assigned" || d.status === "in_transit") ??
                    raw[0];

                if (targetId && !match) {
                    setLoadError("Delivery not found or already completed.");
                    setActiveDelivery(null);
                } else {
                    setActiveDelivery(match ? mapApiDeliveryToActive(match) : null);
                }
            } catch {
                setLoadError("Could not load delivery for navigation.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [deliveryParam]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const loc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setRiderLocation(loc);
                setLocationError(null);

                if (activeDelivery) {
                    RiderDeliveryService.updateGPS(
                        activeDelivery.delivery_id,
                        loc.lat,
                        loc.lng
                    ).catch(() => {});
                }
            },
            () => {
                setLocationError("Unable to retrieve your location. Please enable GPS.");
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [activeDelivery?.delivery_id]);

    return (
        <>
            <PageHeader
                portal="rider"
                title="Navigation"
                description="Customer delivery address from the order."
            />

            {locationError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    ⚠️ {locationError}
                </div>
            )}

            {loadError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {loadError}
                </div>
            )}

            {loading ? (
                <p className="text-sm text-gray-400 text-center py-16">Loading map…</p>
            ) : !activeDelivery ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-sm text-gray-400">No active delivery to navigate.</p>
                </div>
            ) : !activeDelivery.has_valid_gps ? (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-8 text-center">
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                        Location not available
                    </p>
                    <p className="text-sm text-amber-800">
                        This delivery address was not verified on the map. Ask admin to re-enter
                        the address in POS and use &quot;Verify address on map&quot;.
                    </p>
                    <p className="text-sm text-gray-600 mt-3">📍 {activeDelivery.delivery_address}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <MapView delivery={activeDelivery} riderLocation={riderLocation} />
                    </div>
                    <div className="md:col-span-1">
                        <DeliveryInfoPanel delivery={activeDelivery} riderLocation={riderLocation} />
                    </div>
                </div>
            )}
        </>
    );
};

export default RiderMapMainPage;
