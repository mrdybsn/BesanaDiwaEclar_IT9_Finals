import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import ActiveOrdersTab from "./components/ActiveOrdersTab";
import OrderHistoryTab from "./components/OrderHistoryTab";
import ViewOrderModal from "./components/ViewOrderModal";
import RecurringOrderList from "./components/RecurringOrderList";
import AddRecurringOrderModal from "./components/AddRecurringOrderModal";
import ViewRecurringModal from "./components/ViewRecurringModal";
import PageHeader from "../../components/Layout/PageHeader";
import type { RecurringOrder } from "../../interfaces/RecurringInterfaces";

type CategoryTab = "walkin" | "delivery" | "recurring";
type StatusTab = "active" | "history";

const categoryLabels: Record<CategoryTab, string> = {
    walkin:   "Walk-in",
    delivery: "Delivery (one-time)",
    recurring: "Recurring (weekly)",
};

const AdminOrdersMainPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = (searchParams.get("tab") as CategoryTab) || "walkin";
    const [categoryTab, setCategoryTab] = useState<CategoryTab>(
        ["walkin", "delivery", "recurring"].includes(initialCategory) ? initialCategory : "walkin"
    );
    const [statusTab, setStatusTab] = useState<StatusTab>("active");
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [receiptMode, setReceiptMode] = useState(false);

    const viewModal = useModal(false);
    const addRecurringModal = useModal(false);
    const viewRecurringModal = useModal<RecurringOrder>(false);

    const handleView = (orderId: number) => {
        setSelectedOrderId(orderId);
        setReceiptMode(false);
        viewModal.openModal();
    };

    const handleViewReceipt = (orderId: number) => {
        setSelectedOrderId(orderId);
        setReceiptMode(true);
        viewModal.openModal();
    };

    const handleClose = () => {
        setSelectedOrderId(null);
        setReceiptMode(false);
        viewModal.closeModal();
    };

    const switchCategory = (tab: CategoryTab) => {
        setCategoryTab(tab);
        setStatusTab("active");
        setSearchParams(tab === "walkin" ? {} : { tab });
    };

    useEffect(() => {
        document.title = "Orders — Admin";
    }, []);

    return (
        <div className="space-y-4">
            <PageHeader
                title="Orders"
                description="Walk-in POS, one-time delivery, and weekly recurring schedules."
            >
                {categoryTab === "recurring" && (
                    <button
                        type="button"
                        onClick={() => addRecurringModal.openModal()}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                    >
                        + Add Recurring
                    </button>
                )}
            </PageHeader>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-0">
                {(Object.keys(categoryLabels) as CategoryTab[]).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => switchCategory(tab)}
                        className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                            categoryTab === tab
                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {categoryLabels[tab]}
                    </button>
                ))}
            </div>

            {categoryTab === "recurring" ? (
                <RecurringOrderList
                    onView={(order) => viewRecurringModal.openModal(order)}
                />
            ) : (
                <>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStatusTab("active")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                statusTab === "active"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Active
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusTab("history")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                statusTab === "history"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            History
                        </button>
                    </div>

                    {statusTab === "active" ? (
                        <ActiveOrdersTab category={categoryTab} onView={handleView} />
                    ) : (
                        <OrderHistoryTab
                            category={categoryTab}
                            onView={handleView}
                            onViewReceipt={handleViewReceipt}
                        />
                    )}
                </>
            )}

            <ViewOrderModal
                isOpen={viewModal.isOpen}
                onClose={handleClose}
                orderId={selectedOrderId}
                initialView={receiptMode ? "receipt" : "details"}
            />

            <AddRecurringOrderModal
                isOpen={addRecurringModal.isOpen}
                onClose={addRecurringModal.closeModal}
            />

            <ViewRecurringModal
                isOpen={viewRecurringModal.isOpen}
                onClose={viewRecurringModal.closeModal}
                recurringOrder={viewRecurringModal.selectedUser}
            />
        </div>
    );
};

export default AdminOrdersMainPage;
