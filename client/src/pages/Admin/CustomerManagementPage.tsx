import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import CustomerList from "./components/CustomerList";
import AddCustomerFormModal from "./components/AddCustomerFormModal";
import EditCustomerFormModal from "./components/EditCustomerFormModal";
import DeleteCustomerFormModal from "./components/DeleteCustomerFormModal";


const CustomerMainPage = () => {
    const addModal = useModal(false);
    const editModal = useModal(false);
    const deleteModal = useModal(false);

    useEffect(() => {
        document.title = "Customer Management";
    }, []);

    return (
        <>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={addModal.openModal}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                >
                    + Add Customer
                </button>
            </div>

            <CustomerList
                onEdit={editModal.openModal}
                onDelete={deleteModal.openModal}
            />

            <AddCustomerFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
            />

            <EditCustomerFormModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
            />

            <DeleteCustomerFormModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
            />
        </>
    );
};

export default CustomerMainPage;