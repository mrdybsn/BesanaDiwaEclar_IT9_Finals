import DeliveryCard from "./DeliveryCard";
import type { DeliveryTask } from "../RiderTasksMainPage";

interface DeliveryListProps {
    onView: (delivery: DeliveryTask) => void;
}

const hardcodedDeliveries: DeliveryTask[] = [
    {
        delivery_id: 1,
        customer_name: "Maria Santos",
        contact_number: "09171234567",
        delivery_address: "123 Rizal St., Brgy. Baybay, Roxas City",
        order_items: [
            { name: "Purified Water", size: "5gal (Exchange)", quantity: 2 },
        ],
        total_amount: 70.00,
        payment_method: "cash",
        payment_status: "unpaid",
        status: "pending",
        scheduled_date: new Date().toISOString(),
        notes: "Leave at the gate if no one is home.",
    },
    {
        delivery_id: 2,
        customer_name: "Juan Dela Cruz",
        contact_number: "09209876543",
        delivery_address: "45 Magsaysay Ave., Brgy. Dayao, Roxas City",
        order_items: [
            { name: "Purified Water", size: "5gal (New Container)", quantity: 1 },
            { name: "Purified Water", size: "1L", quantity: 4 },
        ],
        total_amount: 245.00,
        payment_method: "gcash",
        payment_status: "paid",
        status: "in_transit",
        scheduled_date: new Date().toISOString(),
    },
    {
        delivery_id: 3,
        customer_name: "Ana Reyes",
        contact_number: "09351122334",
        delivery_address: "78 Lawaan Rd., Brgy. Milibili, Roxas City",
        order_items: [
            { name: "Purified Water", size: "5gal (Exchange)", quantity: 3 },
        ],
        total_amount: 105.00,
        payment_method: "cash",
        payment_status: "unpaid",
        status: "delivered",
        scheduled_date: new Date().toISOString(),
    },
];

const DeliveryList = ({ onView }: DeliveryListProps) => {
    const pending = hardcodedDeliveries.filter((d) => d.status === "pending");
    const inTransit = hardcodedDeliveries.filter((d) => d.status === "in_transit");
    const delivered = hardcodedDeliveries.filter((d) => d.status === "delivered");

    return (
        <>
            {/* Summary Badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-yellow-600">{pending.length}</p>
                    <p className="text-xs text-yellow-500 font-medium mt-0.5">Pending</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-blue-600">{inTransit.length}</p>
                    <p className="text-xs text-blue-500 font-medium mt-0.5">In Transit</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-green-600">{delivered.length}</p>
                    <p className="text-xs text-green-500 font-medium mt-0.5">Delivered</p>
                </div>
            </div>

            {/* Delivery Cards */}
            <div className="space-y-4">
                {hardcodedDeliveries.map((delivery) => (
                    <DeliveryCard
                        key={delivery.delivery_id}
                        delivery={delivery}
                        onView={onView}
                    />
                ))}
            </div>
        </>
    );
};

export default DeliveryList;