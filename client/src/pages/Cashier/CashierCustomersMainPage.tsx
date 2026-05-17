import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import AddCustomerModal from "./components/AddCustomerModal";
import ViewCustomerModal from "./components/ViewCustomerModal";
import AddRecurringOrderModal from "./components/AddRecurringOrderModal";
import CashierCustomerList from "./components/CashierCustomerLists";

const CashierCustomersMainPage = () => {
    const addModal = useModal(false);
    const viewModal = useModal(false);
    const recurringModal = useModal(false);

    useEffect(() => {
        document.title = "Customers — Cashier";
    }, []);

    return (
        <>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={addModal.openModal}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                >
                    Add Customer
                </button>
            </div>

            <CashierCustomerList
                onView={viewModal.openModal}
                onAddRecurring={recurringModal.openModal}
            />

            <AddCustomerModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
            />

            <ViewCustomerModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />

            <AddRecurringOrderModal
                isOpen={recurringModal.isOpen}
                onClose={recurringModal.closeModal}
            />
        </>
    );
};

export default CashierCustomersMainPage;