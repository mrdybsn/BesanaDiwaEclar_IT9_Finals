import type { Order } from "../OrderHistoryMainPage";

const STATUS_META: Record<
    Order["status"],
    { label: string; sub: string; emoji: string; bg: string; text: string }
> = {
    pending: {
        label: "Order Received",
        sub: "We got your order and are preparing it.",
        emoji: "🕐",
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-800",
    },
    confirmed: {
        label: "Order Confirmed",
        sub: "Your order is confirmed and assigned to a rider.",
        emoji: "✅",
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-800",
    },
    in_transit: {
        label: "On the Way!",
        sub: "Your rider is heading to your address now.",
        emoji: "🚴",
        bg: "bg-sky-50 border-sky-200",
        text: "text-sky-800",
    },
    delivered: {
        label: "Delivered",
        sub: "Your order has been delivered. Enjoy!",
        emoji: "🎉",
        bg: "bg-green-50 border-green-200",
        text: "text-green-800",
    },
    cancelled: {
        label: "Cancelled",
        sub: "This order was cancelled.",
        emoji: "❌",
        bg: "bg-red-50 border-red-200",
        text: "text-red-800",
    },
};

const STEPS: Order["status"][] = ["pending", "confirmed", "in_transit", "delivered"];

interface Props {
    order: Order;
}

const TrackingStatusCard = ({ order }: Props) => {
    const meta = STATUS_META[order.status];
    const currentIndex = STEPS.indexOf(order.status);

    return (
        <div className={`bg-white rounded-xl border shadow-sm p-5 ${order.status === "cancelled" ? "border-red-200" : "border-gray-200"}`}>
            {/* Status banner */}
            <div className={`rounded-xl border px-4 py-4 mb-4 ${meta.bg}`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{meta.emoji}</span>
                    <div>
                        <p className={`text-base font-bold ${meta.text}`}>{meta.label}</p>
                        <p className={`text-xs mt-0.5 ${meta.text} opacity-80`}>{meta.sub}</p>
                    </div>
                </div>
            </div>

            {/* Progress bar — only for non-cancelled */}
            {order.status !== "cancelled" && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        {STEPS.map((step, i) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center gap-1">
                                    <div
                                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                                            i <= currentIndex
                                                ? "bg-blue-500 border-blue-500"
                                                : "bg-white border-gray-300"
                                        }`}
                                    />
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-1 rounded transition-all ${
                                            i < currentIndex ? "bg-blue-500" : "bg-gray-200"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 px-0.5">
                        <span>Received</span>
                        <span>Confirmed</span>
                        <span>On the Way</span>
                        <span>Delivered</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackingStatusCard;