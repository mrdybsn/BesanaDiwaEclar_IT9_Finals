import type { CollectionDelivery } from "../RiderCollectionMainPage";

interface CollectionListProps {
    onCollect: (delivery: CollectionDelivery) => void;
}

const hardcodedDeliveries: CollectionDelivery[] = [
    {
        delivery_id: 1,
        customer_name: "Maria Santos",
        contact_number: "09171234567",
        delivery_address: "123 Rizal St., Brgy. Baybay, Roxas City",
        order_items: [
            { name: "Purified Water", size: "5gal (Exchange)", quantity: 2 },
        ],
        expected_amount: 70.00,
        collected_amount: null,
        payment_method: "cash",
        payment_status: "unpaid",
        status: "in_transit",
    },
    {
        delivery_id: 2,
        customer_name: "Juan Dela Cruz",
        contact_number: "09209876543",
        delivery_address: "45 Magsaysay Ave., Brgy. Dayao, Roxas City",
        order_items: [
            { name: "Purified Water", size: "5gal (New Container)", quantity: 1 },
            { name: "Purified Water", size: "1L", quantity: 4 },
        ],
        expected_amount: 245.00,
        collected_amount: 245.00,
        payment_method: "gcash",
        payment_status: "paid",
        status: "delivered",
    },
];

const CollectionList = ({ onCollect }: CollectionListProps) => {
    const pending = hardcodedDeliveries.filter((d) => d.payment_status === "unpaid");
    const collected = hardcodedDeliveries.filter((d) => d.payment_status === "paid");

    return (
        <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-red-600">{pending.length}</p>
                    <p className="text-xs text-red-500 font-medium mt-0.5">Pending Collection</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-green-600">{collected.length}</p>
                    <p className="text-xs text-green-500 font-medium mt-0.5">Collected</p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {hardcodedDeliveries.map((delivery) => (
                    <div
                        key={delivery.delivery_id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            {/* Left */}
                            <div className="flex-1 min-w-0">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        delivery.payment_status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {delivery.payment_status === "paid" ? "Collected" : "Uncollected"}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">
                                        {delivery.payment_method}
                                    </span>
                                </div>

                                <p className="text-base font-bold text-gray-800">
                                    {delivery.customer_name}
                                </p>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    📞 {delivery.contact_number}
                                </p>
                                <p className="text-sm text-gray-500 mt-1 flex items-start gap-1.5">
                                    <span className="shrink-0 mt-0.5">📍</span>
                                    <span>{delivery.delivery_address}</span>
                                </p>

                                {/* Order Items */}
                                <div className="mt-2 space-y-0.5">
                                    {delivery.order_items.map((item, index) => (
                                        <p key={index} className="text-xs text-gray-400">
                                            • {item.name} — {item.size} × {item.quantity}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Right — Amount */}
                            <div className="shrink-0 text-right">
                                <p className="text-xs text-gray-400">Expected</p>
                                <p className="text-lg font-extrabold text-gray-900">
                                    ₱{delivery.expected_amount.toFixed(2)}
                                </p>
                                {delivery.collected_amount !== null && (
                                    <>
                                        <p className="text-xs text-gray-400 mt-1">Collected</p>
                                        <p className="text-base font-bold text-green-600">
                                            ₱{delivery.collected_amount.toFixed(2)}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action */}
                        {delivery.payment_status === "unpaid" && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => onCollect(delivery)}
                                    className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                                >
                                    Submit Collection
                                </button>
                            </div>
                        )}

                        {delivery.payment_status === "paid" && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-green-600">
                                    <span className="text-sm">✓</span>
                                    <p className="text-sm font-medium">
                                        Payment collected successfully
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default CollectionList;