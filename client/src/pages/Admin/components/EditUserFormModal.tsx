import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import UploadInput from "../../../components/Input/UploadInput";
import UserService from "../../../services/UserService";
import type { UserColumns, UserFieldErrors } from "../../../interfaces/UserInterfaces";

interface EditUserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserColumns;
    onUserUpdated: (message: string) => void;
    refreshKey: () => void;
}

const EditUserFormModal: FC<EditUserFormModalProps> = ({
    isOpen,
    onClose,
    user,
    onUserUpdated,
    refreshKey,
}) => {
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [errors, setErrors] = useState<UserFieldErrors>({});

    const [editUserProfilePicture, setEditUserProfilePicture] = useState<File | null>(null);
    const [removeProfilePicture, setRemoveProfilePicture] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [suffixName, setSuffixName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [username, setUsername] = useState("");

    // Pre-fill when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setEditUserProfilePicture(null);
            setRemoveProfilePicture(false);
            setFirstName(user.first_name ?? "");
            setMiddleName(user.middle_name ?? "");
            setLastName(user.last_name ?? "");
            setSuffixName(user.suffix_name ?? "");
            setBirthDate(user.birth_date ?? "");
            setContactNumber(user.contact_number ?? "");
            setUsername(user.username ?? "");
            setErrors({});
        }
    }, [isOpen, user]);

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handleUpdateUser = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingUpdate(true);

        const formData = new FormData();
        if (removeProfilePicture) {
            formData.append("remove_profile_picture", "1");
        } else if (editUserProfilePicture) {
            formData.append("edit_user_profile_picture", editUserProfilePicture);
        }
        formData.append("first_name", firstName);
        formData.append("middle_name", middleName || "");
        formData.append("last_name", lastName);
        formData.append("suffix_name", suffixName || "");
        formData.append("role", "rider");
        formData.append("birth_date", birthDate);
        formData.append("contact_number", contactNumber || "");
        formData.append("username", username);
        formData.append("_method", "POST");

        try {
            const res = await UserService.updateUser(user.user_id, formData);
            if (res.status === 200) {
                setErrors({});
                onUserUpdated(res.data.message);
                refreshKey();
                handleClose();
            } else {
                console.error("Unexpected status during updating user:", res.status);
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Unexpected server error during updating user:", error);
            }
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} showCloseButton>
            <form onSubmit={handleUpdateUser} className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Edit Rider
                </h1>

                <div className="mb-4">
                    <UploadInput
                        label="Profile Picture"
                        name="edit_user_profile_picture"
                        value={editUserProfilePicture}
                        onChange={(file) => {
                            setEditUserProfilePicture(file);
                            setRemoveProfilePicture(false);
                        }}
                        existingImageUrl={user.profile_picture ?? null}
                        onRemoveExistingImageUrl={() => {
                            setEditUserProfilePicture(null);
                            setRemoveProfilePicture(true);
                        }}
                        errors={errors.edit_user_profile_picture}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="First Name"
                                type="text"
                                name="first_name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                errors={errors.first_name}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Middle Name"
                                type="text"
                                name="middle_name"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                errors={errors.middle_name}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Last Name"
                                type="text"
                                name="last_name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                errors={errors.last_name}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Suffix Name"
                                type="text"
                                name="suffix_name"
                                value={suffixName}
                                onChange={(e) => setSuffixName(e.target.value)}
                                errors={errors.suffix_name}
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Birth Date"
                                type="date"
                                name="birth_date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                                errors={errors.birth_date}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Contact Number"
                                type="text"
                                name="contact_number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                errors={errors.contact_number}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Username"
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                errors={errors.username}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {!loadingUpdate && (
                        <CloseButton label="Close" onClose={handleClose} />
                    )}
                    <SubmitButton
                        label="Save Changes"
                        loading={loadingUpdate}
                        loadingLabel="Saving Changes..."
                    />
                </div>
            </form>
        </Modal>
    );
};

export default EditUserFormModal;