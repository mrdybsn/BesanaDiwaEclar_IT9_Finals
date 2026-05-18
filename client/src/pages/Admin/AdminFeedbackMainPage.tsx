import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import FeedbackList from "./components/FeedbackList";
import ViewFeedbackModal from "./components/ViewFeedbackModal";

const AdminFeedbackMainPage = () => {
    const viewModal = useModal(false);

    useEffect(() => {
        document.title = "Customer Feedback — Admin";
    }, []);

    return (
        <>
            <FeedbackList onView={viewModal.openModal} />
            <ViewFeedbackModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
        </>
    );
};

export default AdminFeedbackMainPage;