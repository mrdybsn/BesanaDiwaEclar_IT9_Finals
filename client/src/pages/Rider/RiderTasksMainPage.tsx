import { useEffect, useState } from "react";
import DeliveryList from "./components/DeliveryList";
import ViewDeliveryModal from "./components/ViewDeliveryModal";

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
    status: "pending" | "in_transit" | "delivered";
    scheduled_date: string;
    notes?: string;
}

const RiderTasksMainPage = () => {
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        document.title = "My Deliveries";
    }, []);

    const handleView = (delivery: DeliveryTask) => {
        setSelectedDelivery(delivery);
        setIsViewOpen(true);
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Rider
                </p>
                <h1 className="text-2xl font-bold text-gray-800">
                    Today's Deliveries
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    {new Date().toLocaleDateString("en-PH", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            <DeliveryList onView={handleView} />

            <ViewDeliveryModal
                isOpen={isViewOpen}
                delivery={selectedDelivery}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedDelivery(null);
                }}
            />
        </>
    );
};

export default RiderTasksMainPage;