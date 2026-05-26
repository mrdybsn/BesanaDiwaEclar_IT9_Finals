import { useState } from "react";
import { Link } from "react-router-dom";
import type { DeliveryTask } from "../RiderTasksMainPage";
import { deliveryNeedsCollection } from "../../../utils/riderDelivery";
import RiderDeliveryService from "../../../services/RiderDeliveryService";

interface RiderDeliveryActionsProps {
    delivery: DeliveryTask;
    onView: (delivery: DeliveryTask) => void;
    onUpdated?: () => void;
    layout?: "card" | "modal";
    onNavigate?: () => void;
}

const RiderDeliveryActions = ({
    delivery,
    onView,
    onUpdated,
    layout = "card",
    onNavigate,
}: RiderDeliveryActionsProps) => {
    const [completing, setCompleting] = useState(false);
    const needsCollection = deliveryNeedsCollection(delivery);

    const handleMarkDelivered = async () => {
        if (!window.confirm("Mark this delivery as completed? Payment was already received.")) {
            return;
        }
        setCompleting(true);
        try {
            await RiderDeliveryService.markCompletePrepaid(delivery.delivery_id);
            onUpdated?.();
        } catch {
            window.alert("Could not complete delivery. Please try again.");
        } finally {
            setCompleting(false);
        }
    };

    if (delivery.status === "delivered") {
        return (
            <div className={layout === "card" ? "flex gap-2 mt-4 pt-4 border-t border-gray-100" : "flex gap-2"}>
                <button
                    type="button"
                    onClick={() => onView(delivery)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                >
                    View Details
                </button>
            </div>
        );
    }

    const btnBase =
        layout === "card"
            ? "flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors"
            : "flex-1 text-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-colors";

    return (
        <div className={layout === "card" ? "flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100" : "flex flex-wrap gap-2"}>
            <button
                type="button"
                onClick={() => onView(delivery)}
                className={`${btnBase} bg-gray-100 hover:bg-gray-200 text-gray-700`}
            >
                View Details
            </button>
            <Link
                to={`/rider/map?delivery=${delivery.delivery_id}`}
                onClick={onNavigate}
                className={`${btnBase} bg-blue-50 hover:bg-blue-100 text-blue-700`}
            >
                🗺 Navigate
            </Link>
            {needsCollection ? (
                <Link
                    to={`/rider/collection?delivery=${delivery.delivery_id}`}
                    onClick={onNavigate}
                    className={`${btnBase} bg-green-600 hover:bg-green-700 text-white`}
                >
                    Collect
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={handleMarkDelivered}
                    disabled={completing}
                    className={`${btnBase} bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50`}
                >
                    {completing ? "Saving…" : "Mark Delivered"}
                </button>
            )}
        </div>
    );
};

export default RiderDeliveryActions;
