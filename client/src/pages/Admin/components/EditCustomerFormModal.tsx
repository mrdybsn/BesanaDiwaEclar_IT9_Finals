import { useState, useEffect, type FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import CustomerService from "../../../services/CustomerService";
import type { CustomerColumns, CustomerFieldErrors } from "../../../interfaces/CustomerInterfaces";

interface Props {
    isOpen:    boolean;
    onClose:   () => void;
    customer:  CustomerColumns | null;
    onSuccess: () => void;
}

const GENDERS = [
    { value: "",                  label: "Select Gender"     },
    { value: "male",              label: "Male"              },
    { value: "female",            label: "Female"            },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const EditCustomerFormModal: FC<Props> = ({ isOpen, onClose, customer, onSuccess }) => {
    const [form, setForm] = useState({
        first_name: "", middle_name: "", last_name: "", suffix_name: "",
        gender: "", birth_date: "", contact_number: "", address: "",
        username: "", password: "", password_confirmation: "",
    });
    const [errors, setErrors]   = useState<CustomerFieldErrors>({});
    const [loading, setLoading] = useState(false);

    // pre-fill when customer changes
    useEffect(() => {
        if (!customer) return;
        setForm({
            first_name:            customer.first_name          ?? "",
            middle_name:           customer.middle_name         ?? "",
            last_name:             customer.last_name           ?? "",
            suffix_name:           customer.suffix_name         ?? "",
            gender:                customer.gender              ?? "",
            birth_date:            customer.birth_date          ?? "",
            contact_number:        customer.contact_number      ?? "",
            address:               customer.address             ?? "",
            username:              customer.username            ?? "",
            password:              "",
            password_confirmation: "",
        });
        setErrors({});
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;
        setLoading(true);
        setErrors({});
        try {
            await CustomerService.updateCustomer(customer.customer_id, form);
            onSuccess();
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            }
        } finally {
            setLoading(false);
        }
    };

    const field = (name: keyof typeof form) => ({
        name,
        value: form[name],
        onChange: handleChange,
        error: errors[name as keyof CustomerFieldErrors]?.[0],
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg w-full max-w-2xl">
                <h1 className="text-xl border-b border-gray-100 pb-3 mb-4 font-semibold">
                    Edit Customer
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <FloatingLabelInput label="First Name"  type="text" required autoFocus {...field("first_name")} />
                        <FloatingLabelInput label="Middle Name" type="text"          {...field("middle_name")} />
                        <FloatingLabelInput label="Last Name"   type="text" required {...field("last_name")} />
                        <FloatingLabelInput label="Suffix Name" type="text"          {...field("suffix_name")} />
                        <FloatingLabelSelect label="Gender" {...field("gender")}>
                            {GENDERS.map((g) => (
                                <option key={g.value} value={g.value}>{g.label}</option>
                            ))}
                        </FloatingLabelSelect>
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <FloatingLabelInput label="Birth Date"      type="date"     {...field("birth_date")} />
                        <FloatingLabelInput label="Contact Number"  type="text"     {...field("contact_number")} />
                        <FloatingLabelInput label="Address"         type="text"     {...field("address")} />
                        <FloatingLabelInput label="Username"        type="text"     {...field("username")} />
                        <FloatingLabelInput label="New Password"    type="password" {...field("password")} />
                        <FloatingLabelInput label="Confirm Password" type="password" {...field("password_confirmation")} />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Cancel" onClose={onClose} />
                    <SubmitButton label={loading ? "Saving…" : "Save Changes"} disabled={loading} />
                </div>
            </form>
        </Modal>
    );
};

export default EditCustomerFormModal;