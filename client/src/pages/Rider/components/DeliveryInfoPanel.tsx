import { Link } from "react-router-dom";
import type { ActiveDelivery } from "../RiderMapMainPage";

interface DeliveryInfoPanelProps {
    delivery: ActiveDelivery;
    riderLocation: { lat: number; lng: number } | null;
}

const DeliveryInfoPanel = ({ delivery, riderLocation }: DeliveryInfoPanelProps) => {
    const totalItems = delivery.order_items.reduce((sum, i) => sum + i.quantity, 0);

    const openGoogleMaps = () => {
        const destination = `${delivery.gps_lat},${delivery.gps_lng}`;
        const origin = riderLocation
            ? `${riderLocation.lat},${riderLocation.lng}`
            : "";
        const url = origin
            ? `https://www.google.com/maps/dir/${origin}/${destination}`
            : `https://www.google.com/maps/search/?api=1&query=${destination}`;
        window.open(url, "_blank");
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Customer Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                    Delivery #{delivery.delivery_id}
                </p>

                <p className="text-base font-bold text-gray-800">
                    {delivery.customer_name}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                    📞 {delivery.contact_number}
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-start gap-1.5">
                    <span className="shrink-0 mt-0.5">📍</span>
                    <span>{delivery.delivery_address}</span>
                </p>

                {/* Status */}
                <span className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    delivery.status === "in_transit"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        delivery.status === "in_transit" ? "bg-blue-500" : "bg-yellow-500"
                    }`} />
                    {delivery.status === "in_transit" ? "In Transit" : "Pending"}
                </span>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                    Order Summary
                </p>

                <div className="space-y-2 mb-3">
                    {delivery.order_items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                                {item.name} — {item.size}
                            </span>
                            <span className="text-gray-500 shrink-0 ml-2">
                                ×{item.quantity}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Items ({totalItems})</span>
                        <span>₱{delivery.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Total</span>
                        <span className="text-lg font-extrabold text-gray-900">
                            ₱{delivery.total_amount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            delivery.payment_status === "paid"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                        }`}>
                            {delivery.payment_status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">
                            {delivery.payment_method}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
                <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-xl cursor-pointer transition-colors border border-blue-200"
                >
                    Open in Google Maps
                </button>
                <Link
                    to="/rider/collection"
                    className="w-full text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl cursor-pointer transition-colors"
                >
                    Proceed to Collection
                </Link>
                <Link
                    to="/rider/tasks"
                    className="w-full text-center px-4 py-3 bg-white hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-xl cursor-pointer transition-colors border border-gray-200"
                >
                    Back to Tasks
                </Link>
            </div>
        </div>
    );
};

export default DeliveryInfoPanel;