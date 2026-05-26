import { useEffect, useState } from "react";
import WeeklyScheduleList from "./components/WeeklyScheduleList";
import ScheduleDeliveryDetailModal from "./components/ScheduleDeliveryDetailModal";
import PageHeader from "../../components/Layout/PageHeader";

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
            <PageHeader
                portal="rider"
                title="Weekly Schedule"
                description="Your assigned deliveries for the week."
            />

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