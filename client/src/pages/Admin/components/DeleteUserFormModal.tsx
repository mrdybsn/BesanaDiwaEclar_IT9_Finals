import { useState, type FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import UserService from "../../../services/UserService";
import type { UserColumns } from "../../../interfaces/UserInterfaces";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

interface DeleteUserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserColumns;
    onUserDeleted: (message: string, isFailed?: boolean) => void;
    refreshKey: () => void;
}

const DeleteUserFormModal: FC<DeleteUserFormModalProps> = ({
    isOpen,
    onClose,
    user,
    onUserDeleted,
    refreshKey,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await UserService.destroyUser(user.user_id);
            onUserDeleted(response.data.message);
            refreshKey();
            onClose();
        } catch (error) {
            onUserDeleted("Failed to delete user.", true);
        } finally {
            setIsLoading(false);
        }
    };

    const avatarName = encodeURIComponent(`${user.first_name} ${user.last_name}`);

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Delete User
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Are you sure you want to delete this user? This action cannot be undone.
                </p>

                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-4">
                    <img
                        src={user.profile_picture ? user.profile_picture : `${DEFAULT_AVATAR}${avatarName}`}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="First Name" type="text" name="first_name" value={user.first_name} readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Middle Name" type="text" name="middle_name" value={user.middle_name ?? ""} readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Last Name" type="text" name="last_name" value={user.last_name} readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Suffix Name" type="text" name="suffix_name" value={user.suffix_name ?? ""} readOnly />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Birth Date" type="date" name="birth_date" value={user.birth_date} readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Username" type="text" name="username" value={user.username} readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Role" type="text" name="role" value={user.role} readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Contact Number" type="text" name="contact_number" value={user.contact_number ?? ""} readOnly />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton
                        label={isLoading ? "Deleting..." : "Delete User"}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default DeleteUserFormModal;