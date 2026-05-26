import { useEffect, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Package, User } from "lucide-react";
import type { RecurringDelivery } from "../RiderWeeklyScheduleMainPage";
import RiderDeliveryService from "../../../services/RiderDeliveryService";

const DAYS_ORDER = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
] as const;

const DAY_LABELS: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

const DAY_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
    monday: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
    tuesday: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
    wednesday: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
    thursday: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    friday: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", badge: "bg-rose-100 text-rose-700" },
    saturday: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
    sunday: { bg: "bg-gray-50 border-gray-200", text: "text-gray-600", badge: "bg-gray-100 text-gray-600" },
};

interface Props {
    onView: (schedule: RecurringDelivery) => void;
}

const WeeklyScheduleList = ({ onView }: Props) => {
    const [schedules, setSchedules] = useState<RecurringDelivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await RiderDeliveryService.loadWeeklySchedule();
                setSchedules(data);
            } catch {
                setError("Could not load weekly schedule.");
                setSchedules([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const toggleDay = (day: string) => {
        setCollapsedDays((prev) => {
            const next = new Set(prev);
            next.has(day) ? next.delete(day) : next.add(day);
            return next;
        });
    };

    const grouped = DAYS_ORDER.reduce<Record<string, RecurringDelivery[]>>(
        (acc, day) => {
            acc[day] = schedules.filter((s) => s.day_of_week === day);
            return acc;
        },
        {} as Record<string, RecurringDelivery[]>
    );

    const totalActive = schedules.filter((s) => s.is_active).length;

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 text-gray-400">
                <Calendar className="mx-auto mb-3 w-10 h-10 opacity-40" />
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600">
                        {totalActive} active stops this week
                    </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-semibold text-blue-600 capitalize">
                        Today: {todayName}
                    </span>
                </div>
            </div>

            {DAYS_ORDER.map((day) => {
                const items = grouped[day];
                if (items.length === 0) return null;

                const color = DAY_COLORS[day];
                const isToday = day === todayName;
                const isCollapsed = collapsedDays.has(day);
                const activeCount = items.filter((s) => s.is_active).length;

                return (
                    <div
                        key={day}
                        className={`border rounded-xl overflow-hidden ${isToday ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
                    >
                        <button
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`w-full flex items-center justify-between px-4 py-3 border-b ${color.bg} transition-colors`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-bold uppercase tracking-wide ${color.text}`}>
                                    {DAY_LABELS[day]}
                                </span>
                                {isToday && (
                                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                        Today
                                    </span>
                                )}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.badge}`}>
                                    {activeCount}/{items.length} active
                                </span>
                            </div>
                            {isCollapsed ? (
                                <ChevronDown className={`w-4 h-4 ${color.text}`} />
                            ) : (
                                <ChevronUp className={`w-4 h-4 ${color.text}`} />
                            )}
                        </button>

                        {!isCollapsed && (
                            <div className="divide-y divide-gray-100 bg-white">
                                {items.map((schedule) => (
                                    <button
                                        type="button"
                                        key={schedule.recurring_id}
                                        onClick={() => onView(schedule)}
                                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!schedule.is_active ? "opacity-50" : ""}`}
                                    >
                                        <span
                                            className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${schedule.is_active ? "bg-emerald-500" : "bg-gray-300"}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-semibold text-gray-800 truncate">
                                                    {schedule.customer_name}
                                                </span>
                                                <span className="text-xs font-bold text-gray-700 shrink-0">
                                                    ₱{schedule.estimated_amount.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                {schedule.delivery_address}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                    <Package className="w-3 h-3" />
                                                    {schedule.quantity}x {schedule.product_size}
                                                </span>
                                                {schedule.gallon_exchange && (
                                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                                        Jug exchange
                                                    </span>
                                                )}
                                                {!schedule.is_active && (
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                        Completed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {schedules.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <User className="mx-auto mb-3 w-10 h-10 opacity-40" />
                    <p className="text-sm font-medium">No deliveries this week</p>
                    <p className="text-xs mt-1">Your weekly schedule will appear here</p>
                </div>
            )}
        </div>
    );
};

export default WeeklyScheduleList;
