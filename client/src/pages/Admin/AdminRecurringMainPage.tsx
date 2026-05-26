import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import RecurringOrderList from "./components/RecurringOrderList";
import AddRecurringOrderModal from "./components/AddRecurringOrderModal";
import ViewRecurringModal from "./components/ViewRecurringModal";
import type { RecurringOrder } from "../../interfaces/RecurringInterfaces";
import PageHeader from "../../components/Layout/PageHeader";

const AdminRecurringMainPage = () => {
    const addModal  = useModal(false);
    const viewModal = useModal<RecurringOrder>(false);

    useEffect(() => {
        document.title = "Recurring Orders — Admin";
    }, []);

    return (
        <>
            <div className="space-y-4">
                <PageHeader
                    title="Recurring Orders"
                    description="Manage standing weekly delivery orders."
                >
                    <button
                        type="button"
                        onClick={() => addModal.openModal()}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                    >
                        + Add Recurring Order
                    </button>
                </PageHeader>
            </div>

            <RecurringOrderList
                onView={(order) => viewModal.openModal(order)}
            />

            <AddRecurringOrderModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
            />

            <ViewRecurringModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
                recurringOrder={viewModal.selectedUser}
            />
        </>
    );
};

export default AdminRecurringMainPage;