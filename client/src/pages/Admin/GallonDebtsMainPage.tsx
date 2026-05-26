import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import GallonDebtList from "./components/GallonDebtList";
import ResolveGallonDebtModal from "./components/ResolveGallonDebtModal";
import ViewGallonDebtModal from "./components/ViewGallonDebtModal";
import NotifyJugDebtModal from "./components/NotifyJudDebtModal";
import PageHeader from "../../components/Layout/PageHeader";

const GallonDebtsMainPage = () => {
    const resolveModal = useModal(false);
    const viewModal = useModal(false);
    const notifyModal = useModal(false);

    useEffect(() => {
        document.title = "Gallon Debts";
    }, []);

    return (
        <>
            <PageHeader
                title="Gallon Debts"
                description="Track gallon containers borrowed by customers from orders and recurring deliveries."
            />

            <GallonDebtList
                onResolve={resolveModal.openModal}
                onView={viewModal.openModal}
                onNotify={notifyModal.openModal}
            />

            <ResolveGallonDebtModal
                isOpen={resolveModal.isOpen}
                onClose={resolveModal.closeModal}
            />
            <ViewGallonDebtModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
            <NotifyJugDebtModal
                isOpen={notifyModal.isOpen}
                onClose={notifyModal.closeModal}
            />
        </>
    );
};

export default GallonDebtsMainPage;