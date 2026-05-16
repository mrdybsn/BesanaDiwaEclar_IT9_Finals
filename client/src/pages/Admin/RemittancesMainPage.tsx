import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import RemittanceList from "./components/RemittanceList";
import VerifyRemittanceModal from "./components/VerifyRemittanceModal";
import ViewRemittanceModal from "./components/ViewRemittanceModal";


const RemittancesMainPage = () => {
    const verifyModal = useModal(false);
    const viewModal = useModal(false);

    useEffect(() => {
        document.title = "Remittances";
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

export default RemittancesMainPage;