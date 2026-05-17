import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrackingStatusCard   from "./components/TrackingStatusCard";
import TrackingStepTimeline from "./components/TrackingStepTimeline";
import TrackingRiderCard    from "./components/TrackingRiderCard";
import TrackingOrderSummary from "./components/TrackingOrderSummary";
import { MOCK_ORDERS, type Order }      from "./OrderHistoryMainPage";

export interface RiderInfo {
    name: string;
    contact_number: string;
    gps_lat: number;
    gps_lng: number;
}

const MOCK_RIDER: RiderInfo = {
    name: "Ramon Cruz",
    contact_number: "09171234567",
    gps_lat: 11.5854,
    gps_lng: 122.7511,
};

const OrderTrackingMainPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        document.title = "Track Order";
        const found = MOCK_ORDERS.find((o) => o.order_id === Number(id));
        setOrder(found ?? MOCK_ORDERS[0]);
    }, [id]);

    if (!order) return null;

    const rider =
        order.status === "in_transit" ? MOCK_RIDER : null;

    return (
        <>
            {/* Page Header */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => navigate("/shop/history")}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ← Back
                </button>
                <div>
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                        Customer
                    </p>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Track Order #{order.order_id}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left col */}
                <div className="md:col-span-2 space-y-4">
                    <TrackingStatusCard order={order} />
                    <TrackingStepTimeline status={order.status} />
                    {rider && <TrackingRiderCard rider={rider} />}
                </div>

                {/* Right col */}
                <div className="md:col-span-1">
                    <TrackingOrderSummary order={order} />
                </div>
            </div>
        </>
    );
};

export default OrderTrackingMainPage;