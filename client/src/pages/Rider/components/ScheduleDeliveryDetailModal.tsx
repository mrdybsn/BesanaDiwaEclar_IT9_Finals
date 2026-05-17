import { X, MapPin, Phone, Package, RefreshCw, CalendarDays, StickyNote, CircleCheck, CirclePause } from "lucide-react";
import type { RecurringDelivery } from "../RiderWeeklyScheduleMainPage";

const DAY_LABELS: Record<string, string> = {
    monday: "Every Monday",
    tuesday: "Every Tuesday",
    wednesday: "Every Wednesday",
    thursday: "Every Thursday",
    friday: "Every Friday",
    saturday: "Every Saturday",
    sunday: "Every Sunday",
};

interface Props {
    isOpen: boolean;
    schedule: RecurringDelivery | null;
    onClose: () => void;
}

const ScheduleDeliveryDetailModal = ({ isOpen, schedule, onClose }: Props) => {
    if (!isOpen || !schedule) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    schedule.is_active
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-500"
                                }`}
                            >
                                {schedule.is_active ? "Active" : "Paused"}
                            </span>
                            {schedule.gallon_exchange && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                    Jug Exchange
                                </span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">
                            {schedule.customer_name}
                        </h2>
                        <p className="text-xs text-gray-400">
                            Recurring Order #{schedule.recurring_id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Delivery info */}
                    <div className="space-y-3">
                        <InfoRow
                            icon={<CalendarDays className="w-4 h-4 text-blue-500" />}
                            label="Schedule"
                            value={DAY_LABELS[schedule.day_of_week]}
                        />
                        <InfoRow
                            icon={<Phone className="w-4 h-4 text-gray-400" />}
                            label="Contact"
                            value={schedule.contact_number}
                        />
                        <InfoRow
                            icon={<MapPin className="w-4 h-4 text-rose-400" />}
                            label="Address"
                            value={schedule.delivery_address}
                        />
                        <InfoRow
                            icon={<Package className="w-4 h-4 text-gray-400" />}
                            label="Order"
                            value={`${schedule.quantity}x ${schedule.product_name} (${schedule.product_size})`}
                        />
                        {schedule.gallon_exchange && (
                            <InfoRow
                                icon={<RefreshCw className="w-4 h-4 text-amber-500" />}
                                label="Instruction"
                                value={`Bring ${schedule.quantity} full jug(s), collect ${schedule.quantity} empty(s)`}
                            />
                        )}
                        {schedule.notes && (
                            <InfoRow
                                icon={<StickyNote className="w-4 h-4 text-gray-400" />}
                                label="Notes"
                                value={schedule.notes}
                            />
                        )}
                    </div>

                    {/* Amount */}
                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                            Estimated collection
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                            ₱{schedule.estimated_amount.toLocaleString()}
                        </span>
                    </div>

                    {/* Status indicator */}
                    <div
                        className={`rounded-xl px-4 py-3 flex items-center gap-3 ${
                            schedule.is_active
                                ? "bg-emerald-50 border border-emerald-100"
                                : "bg-gray-50 border border-gray-100"
                        }`}
                    >
                        {schedule.is_active ? (
                            <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                            <CirclePause className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                        <p
                            className={`text-sm font-medium ${
                                schedule.is_active
                                    ? "text-emerald-700"
                                    : "text-gray-500"
                            }`}
                        >
                            {schedule.is_active
                                ? "This stop is active and will appear in your weekly deliveries."
                                : "This stop is paused. Staff will reactivate when needed."}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gray-800 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
        </div>
    </div>
);

export default ScheduleDeliveryDetailModal;