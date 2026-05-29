import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CollectionList from "./components/CollectionList";
import CollectionFormModal from "./components/CollectionFormModal";
import PageHeader from "../../components/Layout/PageHeader";
import RiderDeliveryService from "../../services/RiderDeliveryService";

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
    is_recurring: boolean;
    status: "in_transit" | "delivered";
}

const RiderCollectionMainPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedDelivery, setSelectedDelivery] = useState<CollectionDelivery | null>(null);
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [gallonDebtNotice, setGallonDebtNotice] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Collection Form";
    }, []);

    const handleOpenCollection = (delivery: CollectionDelivery) => {
        setSelectedDelivery(delivery);
        setSubmitError(null);
        setIsCollectionFormOpen(true);
    };

    const handleSubmitCollection = async (amount: number) => {
        if (!selectedDelivery) return;
        setSubmitError(null);
        setGallonDebtNotice(null);
        try {
            const result = await RiderDeliveryService.markDelivered(
                selectedDelivery.delivery_id,
                amount
            );
            if (result.gallon_debt) {
                const { customer_name, gallons_owed } = result.gallon_debt;
                setGallonDebtNotice(
                    `${customer_name ?? "Customer"} now has ${gallons_owed} gallon jug(s) on record in Gallon Debts.`
                );
            }
            setSelectedDelivery(null);
            setRefreshKey((k) => k + 1);
        } catch {
            setSubmitError("Failed to submit collection. Please try again.");
            throw new Error("submit failed");
        }
    };

    return (
        <>
            <PageHeader
                portal="rider"
                title="Payment Collection"
                description="Unpaid deliveries and weekly recurring orders. Prepaid orders do not appear here."
            />

            {submitError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {submitError}
                </div>
            )}

            {gallonDebtNotice && (
                <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
                    {gallonDebtNotice}
                </div>
            )}

            <CollectionList
                onCollect={handleOpenCollection}
                refreshKey={refreshKey}
                highlightDeliveryId={
                    searchParams.get("delivery") ? Number(searchParams.get("delivery")) : undefined
                }
                onHighlightHandled={() => setSearchParams({})}
            />

            <CollectionFormModal
                isOpen={isCollectionFormOpen}
                delivery={selectedDelivery}
                onClose={() => setIsCollectionFormOpen(false)}
                onSubmit={handleSubmitCollection}
            />
        </>
    );
};

export default RiderCollectionMainPage;
