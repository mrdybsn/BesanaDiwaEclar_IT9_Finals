import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_ORDERS } from "./OrderHistoryMainPage";
import TrackingStatusCard from "./components/TrackingStatusCard";
import TrackingStepTimeline from "./components/TrackingStepTimeline";
import TrackingRiderCard from "./components/TrackingRiderCard";
import TrackingOrderSummary from "./components/TrackingOrderSummary";

export interface RiderInfo {
    name: string;
    contact_number: string;
    gps_lat: number;
    gps_lng: number;
}

// Rider data lives here since Order type doesn't carry it
const MOCK_RIDERS: Record<number, RiderInfo> = {
    1005: {
        name: "Ramon Cruz",
        contact_number: "09171234567",
        gps_lat: 11.5889,
        gps_lng: 122.7514,
    },
};

const OrderTrackingMainPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const order = MOCK_ORDERS.find((o) => o.order_id === Number(id)) ?? MOCK_ORDERS[0];
    const rider = MOCK_RIDERS[order.order_id];

    useEffect(() => {
        document.title = `Track Order #${order.order_id}`;
    }, [order.order_id]);

    return (
        <div className="max-w-lg mx-auto space-y-4 pb-10">

            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/shop/history")}
                    className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    ←
                </button>
                <div>
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                        Customer
                    </p>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Track Order #{order.order_id}
                    </h1>
                </div>
            </div>

            {/* Status banner + progress bar */}
            <TrackingStatusCard order={order} />

            {/* Step timeline */}
            <TrackingStepTimeline status={order.status} />

            {/* Rider card — only when in transit and rider exists */}
            {order.status === "in_transit" && rider && (
                <TrackingRiderCard rider={rider} />
            )}

            {/* Order summary + delivery info */}
            <TrackingOrderSummary order={order} />

        </div>
    );
};

export default OrderTrackingMainPage;