import { useEffect, useState } from "react";
import UserList from "./components/UserList";
import AddUserFormModal from "./components/AddUserFormModal";
import EditUserFormModal from "./components/EditUserFormModal";
import DeleteUserFormModal from "./components/DeleteUserFormModal";


const UserMainPage = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        document.title = "User Management";
    }, []);

    return (
        <>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                >
                    + Add User
                </button>
            </div>

            <UserList
                onEdit={() => setIsEditOpen(true)}
                onDelete={() => setIsDeleteOpen(true)}
            />

            <AddUserFormModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
            />

            <EditUserFormModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />

            <DeleteUserFormModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
            />
        </>
    );
};

export default UserMainPage;