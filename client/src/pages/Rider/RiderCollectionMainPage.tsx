import { useEffect, useState } from "react";
import CollectionList from "./components/CollectionList";
import CollectionFormModal from "./components/CollectionFormModal";
import ConfirmCollectionModal from "./components/ConfirmCollectionModal";

export interface CollectionDelivery {
    delivery_id: number;
    customer_name: string;
    contact_number: string;
    delivery_address: string;
    order_items: {
        name: string;
        size: string;
        quantity: number;
    }[];
    expected_amount: number;
    collected_amount: number | null;
    payment_method: string;
    payment_status: "unpaid" | "paid";
    status: "in_transit" | "delivered";
}

const RiderCollectionMainPage = () => {
    const [selectedDelivery, setSelectedDelivery] = useState<CollectionDelivery | null>(null);
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [collectedAmount, setCollectedAmount] = useState<number>(0);

    useEffect(() => {
        document.title = "Collection Form";
    }, []);

    const handleOpenCollection = (delivery: CollectionDelivery) => {
        setSelectedDelivery(delivery);
        setCollectedAmount(delivery.expected_amount);
        setIsCollectionFormOpen(true);
    };

    const handleProceedConfirm = (amount: number) => {
        setCollectedAmount(amount);
        setIsCollectionFormOpen(false);
        setIsConfirmOpen(true);
    };

    const handleConfirmed = () => {
        setIsConfirmOpen(false);
        setSelectedDelivery(null);
        setCollectedAmount(0);
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Rider
                </p>
                <h1 className="text-2xl font-bold text-gray-800">
                    Payment Collection
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Submit the cash collected per delivery stop.
                </p>
            </div>

            <CollectionList onCollect={handleOpenCollection} />

            <CollectionFormModal
                isOpen={isCollectionFormOpen}
                delivery={selectedDelivery}
                onClose={() => setIsCollectionFormOpen(false)}
                onProceed={handleProceedConfirm}
            />

            <ConfirmCollectionModal
                isOpen={isConfirmOpen}
                delivery={selectedDelivery}
                collectedAmount={collectedAmount}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmed}
            />
        </>
    );
};

export default RiderCollectionMainPage;