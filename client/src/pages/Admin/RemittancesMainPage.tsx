import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import RemittanceList from "./components/RemittanceList";
import VerifyRemittanceModal from "./components/VerifyRemittanceModal";
import ViewRemittanceModal from "./components/ViewRemittanceModal";
import PageHeader from "../../components/Layout/PageHeader";
import type { Remittance } from "../../services/RemittanceService";

const RemittancesMainPage = () => {
    const verifyModal = useModal<Remittance>(false);
    const viewModal = useModal<Remittance>(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        document.title = "Remittances";
    }, []);

    const handleVerified = () => {
        setRefreshKey((k) => k + 1);
    };

    return (
        <>
            <PageHeader
                title="Remittances"
                description="Review rider collections and remittance history."
            />

            <RemittanceList
                refreshKey={refreshKey}
                onVerify={(r) => verifyModal.openModal(r)}
                onView={(r) => viewModal.openModal(r)}
            />

            <VerifyRemittanceModal
                isOpen={verifyModal.isOpen}
                onClose={verifyModal.closeModal}
                remittance={verifyModal.selectedUser}
                onVerified={handleVerified}
            />

            <ViewRemittanceModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
                remittance={viewModal.selectedUser}
            />
        </>
    );
};

export default RemittancesMainPage;
