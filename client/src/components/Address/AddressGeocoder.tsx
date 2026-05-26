import { useCallback, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GeocodingService, { type GeocodeResult } from "../../services/GeocodingService";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const pinIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export interface AddressGeoState {
    lat: number | null;
    lng: number | null;
    verified: boolean;
    displayName?: string;
}

interface AddressGeocoderProps {
    address: string;
    onAddressChange: (address: string) => void;
    geo: AddressGeoState;
    onGeoChange: (geo: AddressGeoState) => void;
    label?: string;
    required?: boolean;
}

const DraggablePin = ({
    position,
    onDragEnd,
}: {
    position: [number, number];
    onDragEnd: (lat: number, lng: number) => void;
}) => {
    useMapEvents({
        click(e) {
            onDragEnd(e.latlng.lat, e.latlng.lng);
        },
    });

    return (
        <Marker
            position={position}
            icon={pinIcon}
            draggable
            eventHandlers={{
                dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    onDragEnd(lat, lng);
                },
            }}
        />
    );
};

const AddressGeocoder = ({
    address,
    onAddressChange,
    geo,
    onGeoChange,
    label = "Delivery Address",
    required = false,
}: AddressGeocoderProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetGeo = useCallback(() => {
        onGeoChange({ lat: null, lng: null, verified: false, displayName: undefined });
    }, [onGeoChange]);

    const applyResult = (result: GeocodeResult) => {
        onGeoChange({
            lat: result.lat,
            lng: result.lng,
            verified: true,
            displayName: result.display_name,
        });
        setError(null);
    };

    const handleVerify = async () => {
        const trimmed = address.trim();
        if (!trimmed) {
            setError("Enter an address first.");
            resetGeo();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await GeocodingService.geocodeAddress(trimmed);
            applyResult(result);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(
                axiosErr.response?.data?.message ??
                    "Address not found. Add barangay, street, or nearby landmark."
            );
            resetGeo();
        } finally {
            setLoading(false);
        }
    };

    const handleAddressInput = (value: string) => {
        onAddressChange(value);
        if (geo.verified) {
            resetGeo();
        }
        setError(null);
    };

    const handlePinMove = (lat: number, lng: number) => {
        onGeoChange({
            ...geo,
            lat,
            lng,
            verified: true,
        });
    };

    const mapCenter: [number, number] =
        geo.lat !== null && geo.lng !== null
            ? [geo.lat, geo.lng]
            : [11.5853, 122.7511];

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
                type="text"
                value={address}
                onChange={(e) => handleAddressInput(e.target.value)}
                placeholder="e.g. Rizal St., Brgy. Baybay, Roxas City"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="button"
                onClick={handleVerify}
                disabled={loading || !address.trim()}
                className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40"
            >
                {loading ? "Locating on map…" : "📍 Verify address on map"}
            </button>

            {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            {geo.verified && geo.lat !== null && geo.lng !== null && (
                <>
                    <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                        ✓ Address pinned on map. Drag the pin to adjust if needed.
                    </p>
                    {geo.displayName && (
                        <p className="text-xs text-gray-500 line-clamp-2">{geo.displayName}</p>
                    )}
                    <div className="rounded-xl overflow-hidden border border-gray-200 h-48">
                        <MapContainer
                            center={mapCenter}
                            zoom={16}
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <DraggablePin
                                position={[geo.lat, geo.lng]}
                                onDragEnd={handlePinMove}
                            />
                        </MapContainer>
                    </div>
                    <p className="text-xs text-gray-400">
                        Coordinates: {geo.lat.toFixed(6)}, {geo.lng.toFixed(6)}
                    </p>
                </>
            )}
        </div>
    );
};

export default AddressGeocoder;
