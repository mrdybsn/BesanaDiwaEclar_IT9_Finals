
const STEPS: {
    status: Order["status"];
    label: string;
    description: string;
    emoji: string;
}[] = [
    {
        status: "pending",
        label: "Order Received",
        description: "Your order has been placed and is waiting to be processed by our staff.",
        emoji: "🕐",
    },
    {
        status: "confirmed",
        label: "Confirmed & Assigned",
        description: "Staff confirmed your order and assigned a rider for delivery.",
        emoji: "✅",
    },
    {
        status: "in_transit",
        label: "Out for Delivery",
        description: "Your rider is on the way. You can contact them directly if needed.",
        emoji: "🚴",
    },
    {
        status: "delivered",
        label: "Delivered",
        description: "Your water has been delivered successfully. Thank you!",
        emoji: "🎉",
    },
];

const ORDER: Order["status"][] = ["pending", "confirmed", "in_transit", "delivered"];

interface Props {
    status: Order["status"];
}

const TrackingStepTimeline = ({ status }: Props) => {
    if (status === "cancelled") {
        return (
            <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Order Timeline
                </p>
                <div className="flex items-center gap-3 text-red-500">
                    <span className="text-2xl">❌</span>
                    <div>
                        <p className="text-sm font-bold text-red-700">Order Cancelled</p>
                        <p className="text-xs text-red-500 mt-0.5">
                            This order was cancelled and will not be delivered.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const currentIndex = ORDER.indexOf(status);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Order Timeline
            </p>
            <div className="space-y-0">
                {STEPS.map((step, i) => {
                    const done   = i <= currentIndex;
                    const active = i === currentIndex;

                    return (
                        <div key={step.status} className="flex gap-4">
                            {/* Dot + line */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 shrink-0 transition-all ${
                                        active
                                            ? "bg-blue-500 border-blue-500"
                                            : done
                                            ? "bg-blue-100 border-blue-200"
                                            : "bg-white border-gray-200"
                                    }`}
                                >
                                    {done ? step.emoji : (
                                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                                    )}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`w-0.5 flex-1 my-1 ${
                                            i < currentIndex ? "bg-blue-200" : "bg-gray-100"
                                        }`}
                                        style={{ minHeight: 28 }}
                                    />
                                )}
                            </div>

                            {/* Text */}
                            <div className="pb-5 flex-1">
                                <p
                                    className={`text-sm font-bold ${
                                        done ? "text-gray-800" : "text-gray-300"
                                    }`}
                                >
                                    {step.label}
                                </p>
                                {active && (
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackingStepTimeline;