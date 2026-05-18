import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import LostReportList from "./components/LostReportList";
import ViewLostReportModal from "./components/ViewLostReportModal";
import ResolveReportModal from "./components/ResolveReportModal";

const AdminLostReportsMainPage = () => {
    const viewModal = useModal(false);
    const resolveModal = useModal(false);

    useEffect(() => {
        document.title = "Lost Item Reports — Admin";
    }, []);

    return (
        <>
            <LostReportList
                onView={viewModal.openModal}
                onResolve={resolveModal.openModal}
            />

            <ViewLostReportModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />

            <ResolveReportModal
                isOpen={resolveModal.isOpen}
                onClose={resolveModal.closeModal}
            />
        </>
    );
};

export default AdminLostReportsMainPage;