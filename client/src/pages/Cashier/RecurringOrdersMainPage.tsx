import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import RecurringOrderList from "./components/RecurringOrderLIst";
import ViewRecurringModal from "./components/ViewRecurringModal";

const RecurringOrdersMainPage = () => {
    const viewModal = useModal(false);

    useEffect(() => {
        document.title = "Recurring Orders — Cashier";
    }, []);

    return (
        <>
            <RecurringOrderList
                onView={viewModal.openModal}
            />

            <ViewRecurringModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
        </>
    );
};

export default RecurringOrdersMainPage;