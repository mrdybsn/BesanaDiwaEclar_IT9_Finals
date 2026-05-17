import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import RemittanceList from "../Admin/components/RemittanceList";
import VerifyRemittanceModal from "../Admin/components/VerifyRemittanceModal";
import ViewRemittanceModal from "../Admin/components/ViewRemittanceModal";

const CashierRemittancesMainPage = () => {
    const verifyModal = useModal(false);
    const viewModal = useModal(false);

    useEffect(() => {
        document.title = "Remittances — Cashier";
    }, []);

    return (
        <>
            <RemittanceList
                onVerify={verifyModal.openModal}
                onView={viewModal.openModal}
            />

            <VerifyRemittanceModal
                isOpen={verifyModal.isOpen}
                onClose={verifyModal.closeModal}
            />

            <ViewRemittanceModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
        </>
    );
};

export default CashierRemittancesMainPage;