import { useCallback, useEffect, useState } from "react";
import type { CollectionDelivery } from "../RiderCollectionMainPage";
import RiderDeliveryService, { mapApiDeliveryToCollection } from "../../../services/RiderDeliveryService";
import { deliveryNeedsCollection } from "../../../utils/riderDelivery";

interface CollectionListProps {
    onCollect: (delivery: CollectionDelivery) => void;
    refreshKey: number;
    highlightDeliveryId?: number;
    onHighlightHandled?: () => void;
}

const CollectionList = ({
    onCollect,
    refreshKey,
    highlightDeliveryId,
    onHighlightHandled,
}: CollectionListProps) => {
    const [deliveries, setDeliveries] = useState<CollectionDelivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeliveries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const raw = await RiderDeliveryService.loadRawDeliveries({ scope: "active" });
            const mapped = raw.map(mapApiDeliveryToCollection).filter(deliveryNeedsCollection);
            setDeliveries(mapped);
        } catch {
            setError("Could not load deliveries. Please try again.");
            setDeliveries([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries, refreshKey]);

    useEffect(() => {
        if (!highlightDeliveryId || deliveries.length === 0) return;
        const target = deliveries.find((d) => d.delivery_id === highlightDeliveryId);
        if (target) {
            onCollect(target);
            onHighlightHandled?.();
        }
    }, [highlightDeliveryId, deliveries, onCollect, onHighlightHandled]);

    const pending = deliveries.filter((d) => d.payment_status === "unpaid");
    const collected = deliveries.filter((d) => d.payment_status === "paid");

    if (loading) {
        return <p className="text-sm text-gray-400 text-center py-12">Loading collections…</p>;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-red-500 mb-3">{error}</p>
                <button
                    type="button"
                    onClick={fetchDeliveries}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (deliveries.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-sm text-gray-400">
                    Nothing to collect. Prepaid orders are completed from Tasks with Mark Delivered.
                </p>
            </div>
        );
    }

    return (
        <>
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

            <div className="space-y-4">
                {deliveries.map((delivery) => (
                    <div
                        key={delivery.delivery_id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            delivery.payment_status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {delivery.payment_status === "paid" ? "Collected" : "Uncollected"}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">
                                        {delivery.payment_method}
                                    </span>
                                    {delivery.is_recurring && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                            Weekly
                                        </span>
                                    )}
                                </div>

                                <p className="text-base font-bold text-gray-800">{delivery.customer_name}</p>
                                <p className="text-sm text-gray-400 mt-0.5">📞 {delivery.contact_number}</p>
                                <p className="text-sm text-gray-500 mt-1 flex items-start gap-1.5">
                                    <span className="shrink-0 mt-0.5">📍</span>
                                    <span>{delivery.delivery_address}</span>
                                </p>

                                <div className="mt-2 space-y-0.5">
                                    {delivery.order_items.map((item, index) => (
                                        <p key={index} className="text-xs text-gray-400">
                                            • {item.name} — {item.size} × {item.quantity}
                                        </p>
                                    ))}
                                </div>
                            </div>

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
                                    <p className="text-sm font-medium">Payment collected successfully</p>
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
