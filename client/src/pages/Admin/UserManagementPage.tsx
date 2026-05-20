import { useEffect } from "react";
import AddUserFormModal from "./components/AddUserFormModal";
import EditUserFormModal from "./components/EditUserFormModal";
import DeleteUserFormModal from "./components/DeleteUserFormModal";
import UserList from "./components/UserList";
import { useModal } from "../../hooks/useModal";
import type { UserColumns } from "../../interfaces/UserInterfaces";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresh";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

const UserManagementPage = () => {
    const {
        isOpen: isAddUserFormModalOpen,
        openModal: openAddUserFormModal,
        closeModal: closeAddUserFormModal,
    } = useModal<undefined>(false);

    const {
        isOpen: isEditUserFormModalOpen,
        selectedUser: selectedUserForEdit,
        openModal: openEditUserFormModal,
        closeModal: closeEditUserFormModal,
    } = useModal<UserColumns>(false);

    const {
        isOpen: isDeleteUserFormModalOpen,
        selectedUser: selectedUserForDelete,
        openModal: openDeleteUserFormModal,
        closeModal: closeDeleteUserFormModal,
    } = useModal<UserColumns>(false);

    const {
        message: toastMessage,
        isFailed: toastIsFailed,
        isVisible: toastMessageIsVisible,
        showToastMessage,
        closeToastMessage,
    } = useToastMessage("", false, false);

    const { refresh, handleRefresh } = useRefresh(false);

    useEffect(() => {
        document.title = "User Management";
    }, []);

    return (
        <>
            <ToastMessage
                message={toastMessage}
                isFailed={toastIsFailed}
                isVisible={toastMessageIsVisible}
                onClose={closeToastMessage}
            />

            <AddUserFormModal
                isOpen={isAddUserFormModalOpen}
                onClose={closeAddUserFormModal}
                onUserAdded={showToastMessage}
                refreshKey={handleRefresh}
            />

            {selectedUserForEdit && (
                <EditUserFormModal
                    isOpen={isEditUserFormModalOpen}
                    onClose={closeEditUserFormModal}
                    user={selectedUserForEdit}
                    onUserUpdated={showToastMessage}
                    refreshKey={handleRefresh}
                />
            )}

            {selectedUserForDelete && (
                <DeleteUserFormModal
                    isOpen={isDeleteUserFormModalOpen}
                    onClose={closeDeleteUserFormModal}
                    user={selectedUserForDelete}
                    onUserDeleted={showToastMessage}
                    refreshKey={handleRefresh}
                />
            )}

            <UserList
                onAddUser={openAddUserFormModal}
                onEditUser={(user: UserColumns) => openEditUserFormModal(user)}
                onDeleteUser={(user: UserColumns) => openDeleteUserFormModal(user)}
                onStatusToggled={showToastMessage}
                refreshKey={refresh}
            />
        </>
    );
};

export default UserManagementPage;