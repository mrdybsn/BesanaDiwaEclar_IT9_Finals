import { useEffect, useState } from "react";
import DeliveryCard from "./DeliveryCard";
import type { DeliveryTask } from "../RiderTasksMainPage";
import RiderDeliveryService from "../../../services/RiderDeliveryService";

interface DeliveryListProps {
    onView: (delivery: DeliveryTask) => void;
    refreshKey?: number;
}

const DeliveryList = ({ onView, refreshKey = 0 }: DeliveryListProps) => {
    const [deliveries, setDeliveries] = useState<DeliveryTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeliveries = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await RiderDeliveryService.loadMyDeliveries();
            setDeliveries(data);
        } catch (e) {
            console.error(e);
            setError("Failed to load deliveries. Ask admin to assign deliveries to you.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, [refreshKey]);

    const assigned = deliveries.filter((d) => d.status === "assigned");
    const inTransit = deliveries.filter((d) => d.status === "in_transit");
    const pending = deliveries.filter((d) => d.status === "pending");

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16 text-blue-600 gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm">Loading deliveries…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-red-500 mb-3">{error}</p>
                <button
                    type="button"
                    onClick={fetchDeliveries}
                    className="text-sm text-blue-600 hover:underline font-medium"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end mb-3">
                <button
                    type="button"
                    onClick={fetchDeliveries}
                    className="text-sm text-blue-600 hover:underline font-medium"
                >
                    Refresh list
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-indigo-600">{assigned.length}</p>
                    <p className="text-xs text-indigo-500 font-medium mt-0.5">Assigned</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-blue-600">{inTransit.length}</p>
                    <p className="text-xs text-blue-500 font-medium mt-0.5">In Transit</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-yellow-600">{pending.length}</p>
                    <p className="text-xs text-yellow-500 font-medium mt-0.5">Pending</p>
                </div>
            </div>

            {deliveries.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">
                    No deliveries assigned to you yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {deliveries.map((delivery) => (
                        <DeliveryCard
                            key={delivery.delivery_id}
                            delivery={delivery}
                            onView={onView}
                            onUpdated={fetchDeliveries}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default DeliveryList;
