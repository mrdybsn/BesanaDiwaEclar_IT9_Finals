import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import RecurringOrderList from "./components/RecurringOrderList";
import AddRecurringOrderModal from "./components/AddRecurringOrderModal";
import ViewRecurringModal from "./components/ViewRecurringModal";

const AdminRecurringMainPage = () => {
    const addModal = useModal(false);
    const viewModal = useModal(false);

    useEffect(() => {
        document.title = "Recurring Orders — Admin";
    }, []);

    return (
        <>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={addModal.openModal}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                >
                    Add Recurring Order
                </button>
            </div>

            <RecurringOrderList
                onView={viewModal.openModal}
            />

            <AddRecurringOrderModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
            />

            <ViewRecurringModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
        </>
    );
};

export default AdminRecurringMainPage;