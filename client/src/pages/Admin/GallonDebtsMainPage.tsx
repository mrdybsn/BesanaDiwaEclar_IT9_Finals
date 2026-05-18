import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import GallonDebtList from "./components/GallonDebtList";
import ResolveGallonDebtModal from "./components/ResolveGallonDebtModal";
import ViewGallonDebtModal from "./components/ViewGallonDebtModal";
import NotifyJugDebtModal from "./components/NotifyJudDebtModal";

const GallonDebtsMainPage = () => {
    const resolveModal = useModal(false);
    const viewModal = useModal(false);
    const notifyModal = useModal(false);

    useEffect(() => {
        document.title = "Gallon Debts";
    }, []);

    return (
        <>
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