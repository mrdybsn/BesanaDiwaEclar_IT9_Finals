import type { FC } from "react"
import Modal from "../../../components/Modal"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect"
import CloseButton from "../../../components/Button/CloseButton"
import SubmitButton from "../../../components/Button/SubmitButton"

interface AddUserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddUserFormModal: FC<AddUserFormModalProps> = ({ isOpen, onClose }) => {
    const genders = [
        { gender_id: '', gender: 'Select Gender' },
        { gender_id: 'male', gender: 'Male' },
        { gender_id: 'female', gender: 'Female' },
        { gender_id: 'prefer_not_to_say', gender: 'Prefer not to say' },
    ]

    const roles = [
        { role_id: '', role: 'Select Role' },
        { role_id: 'admin', role: 'Admin' },
        { role_id: 'staff', role: 'Staff' },
        { role_id: 'rider', role: 'Rider' },
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Add User Form
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="First Name"
                                type="text"
                                name="first_name"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Middle Name"
                                type="text"
                                name="middle_name"
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Last Name"
                                type="text"
                                name="last_name"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Suffix Name"
                                type="text"
                                name="suffix_name"
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect label="Gender" name="gender" required>
                                {genders.map((gender, index) => (
                                    <option value={gender.gender_id} key={index}>
                                        {gender.gender}
                                    </option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Birth Date"
                                type="date"
                                name="birth_date"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Username"
                                type="text"
                                name="username"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect label="Role" name="role" required>
                                {roles.map((role, index) => (
                                    <option value={role.role_id} key={index}>
                                        {role.role}
                                    </option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Password"
                                type="password"
                                name="password"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Confirm Password"
                                type="password"
                                name="password_confirmation"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Save User" />
                </div>
            </form>
        </Modal>
    )
}

export default AddUserFormModal