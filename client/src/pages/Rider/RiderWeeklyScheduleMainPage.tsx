import { useEffect, useState } from "react";
import WeeklyScheduleList from "./components/WeeklyScheduleList";
import ScheduleDeliveryDetailModal from "./components/ScheduleDeliveryDetailModal";

export interface RecurringDelivery {
    recurring_id: number;
    customer_name: string;
    contact_number: string;
    delivery_address: string;
    product_name: string;
    product_size: string;
    quantity: number;
    day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday";
    is_active: boolean;
    notes?: string;
    estimated_amount: number;
    gallon_exchange: boolean;
}

const RiderWeeklyScheduleMainPage = () => {
    const [selectedSchedule, setSelectedSchedule] =
        useState<RecurringDelivery | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        document.title = "Weekly Schedule";
    }, []);

    const handleView = (schedule: RecurringDelivery) => {
        setSelectedSchedule(schedule);
        setIsDetailOpen(true);
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Rider
                </p>
                <h1 className="text-2xl font-bold text-gray-800">
                    Weekly Schedule
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Auto-populated from recurring standing orders
                </p>
            </div>

            <WeeklyScheduleList onView={handleView} />

            <ScheduleDeliveryDetailModal
                isOpen={isDetailOpen}
                schedule={selectedSchedule}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedSchedule(null);
                }}
            />
        </>
    );
};

export default RiderWeeklyScheduleMainPage;