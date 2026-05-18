interface StatusBannerProps {
    status: string;
    estimatedArrival: string;
}

const statusContent: Record<string, { emoji: string; title: string; subtitle: string; bg: string; text: string }> = {
    pending: {
        emoji: "🧾",
        title: "Order Received",
        subtitle: "Your order has been placed and is waiting to be confirmed.",
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-800",
    },
    confirmed: {
        emoji: "✅",
        title: "Order Confirmed!",
        subtitle: "Your order is confirmed and a rider will be assigned soon.",
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-800",
    },
    in_transit: {
        emoji: "🚴",
        title: "On the Way!",
        subtitle: "Your rider is heading to your address now.",
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-800",
    },
    delivered: {
        emoji: "🎉",
        title: "Order Delivered!",
        subtitle: "Your order has been delivered successfully. Enjoy!",
        bg: "bg-green-50 border-green-200",
        text: "text-green-800",
    },
    cancelled: {
        emoji: "❌",
        title: "Order Cancelled",
        subtitle: "This order has been cancelled.",
        bg: "bg-red-50 border-red-200",
        text: "text-red-800",
    },
};

const StatusBanner = ({ status, estimatedArrival }: StatusBannerProps) => {
    const content = statusContent[status] ?? statusContent.pending;

    return (
        <div className={`rounded-2xl border p-5 flex items-center gap-4 ${content.bg}`}>
            <span className="text-4xl shrink-0">{content.emoji}</span>
            <div>
                <p className={`text-base font-bold ${content.text}`}>
                    {content.title}
                </p>
                <p className={`text-sm mt-0.5 ${content.text} opacity-80`}>
                    {content.subtitle}
                </p>
                {status === "in_transit" && estimatedArrival && (
                    <p className={`text-xs font-semibold mt-1 ${content.text}`}>
                        Estimated Arrival: {estimatedArrival}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatusBanner;