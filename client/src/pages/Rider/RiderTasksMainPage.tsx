import { useEffect, useState } from "react";
import DeliveryList from "./components/DeliveryList";
import ViewDeliveryModal from "./components/ViewDeliveryModal";
import PageHeader from "../../components/Layout/PageHeader";

export interface DeliveryTask {
    delivery_id: number;
    customer_name: string;
    contact_number: string;
    delivery_address: string;
    order_items: {
        name: string;
        size: string;
        quantity: number;
    }[];
    total_amount: number;
    payment_method: string;
    payment_status: "unpaid" | "paid";
    is_recurring: boolean;
    status: "pending" | "assigned" | "in_transit" | "delivered";
    scheduled_date: string;
    notes?: string;
}

const RiderTasksMainPage = () => {
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        document.title = "My Deliveries";
    }, []);

    const handleView = (delivery: DeliveryTask) => {
        setSelectedDelivery(delivery);
        setIsViewOpen(true);
    };

    return (
        <>
            <PageHeader
                portal="rider"
                title="My Deliveries"
                description="Navigate to the customer address. Collect only if unpaid or weekly recurring."
            />

            <DeliveryList onView={handleView} refreshKey={refreshKey} />

            <ViewDeliveryModal
                isOpen={isViewOpen}
                delivery={selectedDelivery}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedDelivery(null);
                }}
                onUpdated={() => setRefreshKey((k) => k + 1)}
            />
        </>
    );
};

export default RiderTasksMainPage;