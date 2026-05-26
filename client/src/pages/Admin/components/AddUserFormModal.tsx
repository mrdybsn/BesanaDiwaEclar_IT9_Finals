import { useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import UploadInput from "../../../components/Input/UploadInput";
import UserService from "../../../services/UserService";
import type { UserFieldErrors } from "../../../interfaces/UserInterfaces";

interface AddUserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserAdded: (message: string) => void;
    refreshKey: () => void;
}

const AddUserFormModal: FC<AddUserFormModalProps> = ({
    isOpen,
    onClose,
    onUserAdded,
    refreshKey,
}) => {
    const [loadingStore, setLoadingStore] = useState(false);
    const [errors, setErrors] = useState<UserFieldErrors>({});

    const [addUserProfilePicture, setAddUserProfilePicture] = useState<File | null>(null);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [suffixName, setSuffixName] = useState("");
    const [role, setRole] = useState("rider");
    const [birthDate, setBirthDate] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const resetForm = () => {
        setAddUserProfilePicture(null);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSuffixName("");
        setRole("rider");
        setBirthDate("");
        setContactNumber("");
        setUsername("");
        setPassword("");
        setPasswordConfirmation("");
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleStoreUser = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingStore(true);

        const formData = new FormData();
        if (addUserProfilePicture) {
            formData.append("add_user_profile_picture", addUserProfilePicture);
        }
        formData.append("first_name", firstName);
        formData.append("middle_name", middleName || "");
        formData.append("last_name", lastName);
        formData.append("suffix_name", suffixName || "");
        formData.append("role", role);
        formData.append("birth_date", birthDate);
        formData.append("contact_number", contactNumber || "");
        formData.append("username", username);
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);

        try {
            const res = await UserService.storeUser(formData);
            if (res.status === 200) {
                resetForm();
                onUserAdded(res.data.message);
                refreshKey();
            } else {
                console.error("Unexpected status during adding user:", res.status);
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Unexpected server error during adding user:", error);
            }
        } finally {
            setLoadingStore(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} showCloseButton>
            <form onSubmit={handleStoreUser} className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Add Rider
                </h1>

                <div className="mb-4">
                    <UploadInput
                        label="Profile Picture"
                        name="add_user_profile_picture"
                        value={addUserProfilePicture}
                        onChange={setAddUserProfilePicture}
                        errors={errors.add_user_profile_picture}
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
                        <input type="hidden" name="role" value="rider" />
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
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                errors={errors.password}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Password Confirmation"
                                type="password"
                                name="password_confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                errors={errors.password_confirmation}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {!loadingStore && (
                        <CloseButton label="Close" onClose={handleClose} />
                    )}
                    <SubmitButton
                        label="Save Rider"
                        loading={loadingStore}
                        loadingLabel="Saving Rider..."
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddUserFormModal;