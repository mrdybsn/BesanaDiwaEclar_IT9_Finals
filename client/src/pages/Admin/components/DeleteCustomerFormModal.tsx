import { useState, type FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import CustomerService from "../../../services/CustomerService";
import type { CustomerColumns } from "../../../interfaces/CustomerInterfaces";

interface Props {
    isOpen:    boolean;
    onClose:   () => void;
    customer:  CustomerColumns | null;
    onSuccess: () => void;
}

const genderLabel: Record<string, string> = {
    male:              "Male",
    female:            "Female",
    prefer_not_to_say: "Prefer not to say",
};

const DeleteCustomerFormModal: FC<Props> = ({ isOpen, onClose, customer, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const handleDelete = async () => {
        if (!customer) return;
        setLoading(true);
        setError(null);
        try {
            await CustomerService.destroyCustomer(customer.customer_id);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Failed to delete customer.");
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-4 rounded-lg w-full max-w-lg">
                <h1 className="text-xl border-b border-gray-100 pb-3 mb-2 font-semibold">
                    Delete Customer
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete this customer? This action cannot be undone.
                </p>

                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <FloatingLabelInput label="First Name"  type="text" name="first_name"  value={customer.first_name}             readOnly />
                        <FloatingLabelInput label="Middle Name" type="text" name="middle_name" value={customer.middle_name  ?? ""}     readOnly />
                        <FloatingLabelInput label="Last Name"   type="text" name="last_name"   value={customer.last_name}              readOnly />
                        <FloatingLabelInput label="Suffix Name" type="text" name="suffix_name" value={customer.suffix_name ?? ""}     readOnly />
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <FloatingLabelInput label="Gender"         type="text" name="gender"         value={customer.gender ? genderLabel[customer.gender] : ""} readOnly />
                        <FloatingLabelInput label="Birth Date"     type="text" name="birth_date"     value={customer.birth_date     ?? ""} readOnly />
                        <FloatingLabelInput label="Contact Number" type="text" name="contact_number" value={customer.contact_number  ?? ""} readOnly />
                        <FloatingLabelInput label="Username"       type="text" name="username"       value={customer.username        ?? ""} readOnly />
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-2">
                    <CloseButton label="Cancel" onClose={onClose} />
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        {loading ? "Deleting…" : "Delete Customer"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteCustomerFormModal;