import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import ViewOrderModal from "./components/ViewOrderModal";
import ProcessOrderModal from "./components/ProcessOrderModal";
import ActiveOrdersTab from "./components/ActiveOrdersTab";
import OrderHistoryTab from "./components/OrderHistoryTab";

type Tab = "active" | "history";

const CashierOrdersMainPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>("active");

    const viewModal = useModal(false);
    const processModal = useModal(false);

    useEffect(() => {
        document.title = "Orders — Cashier";
    }, []);

    return (
        <div className="space-y-4">

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-0">
                <button
                    type="button"
                    onClick={() => setActiveTab("active")}
                    className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                        activeTab === "active"
                            ? "border-blue-600 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Active Orders
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("history")}
                    className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                        activeTab === "history"
                            ? "border-blue-600 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Order History
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "active" ? (
                <ActiveOrdersTab
                    onView={viewModal.openModal}
                    onProcess={processModal.openModal}
                />
            ) : (
                <OrderHistoryTab
                    onView={viewModal.openModal}
                />
            )}

            {/* Modals */}
            <ViewOrderModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
            <ProcessOrderModal
                isOpen={processModal.isOpen}
                onClose={processModal.closeModal}
            />
        </div>
    );
};

export default CashierOrdersMainPage;