import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import GallonDebtList from "./components/GallonDebtList";
import ResolveGallonDebtModal from "./components/ResolveGallonDebtModal";
import ViewGallonDebtModal from "./components/ViewGallonDebtModal";

const GallonDebtsMainPage = () => {
    const resolveModal = useModal(false);
    const viewModal = useModal(false);

    useEffect(() => {
        document.title = "Gallon Debts";
    }, []);

    return (
        <>
            <GallonDebtList
                onResolve={resolveModal.openModal}
                onView={viewModal.openModal}
            />

            <ResolveGallonDebtModal
                isOpen={resolveModal.isOpen}
                onClose={resolveModal.closeModal}
            />

            <ViewGallonDebtModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
        </>
    );
};

export default GallonDebtsMainPage;