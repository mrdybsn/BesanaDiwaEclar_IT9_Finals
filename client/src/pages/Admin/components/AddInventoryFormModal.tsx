import { useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import InventoryService from "../../../services/InventoryService";
import type { InventoryFieldErrors } from "../../../interfaces/InventoryInterfaces";

interface AddInventoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string, isFailed?: boolean) => void;
    refreshKey: () => void;
}

const CATEGORIES = [
    { value: "", label: "Select Category" },
    { value: "containers", label: "Containers" },
    { value: "caps", label: "Caps" },
    { value: "filters", label: "Filters" },
    { value: "chemicals", label: "Chemicals" },
    { value: "equipment", label: "Equipment" },
    { value: "other", label: "Other" },
];

const EMPTY = {
    item_name: "",
    category: "",
    quantity: "",
    unit: "",
    low_stock_threshold: "",
};

const AddInventoryFormModal: FC<AddInventoryFormModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    refreshKey,
}) => {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState<InventoryFieldErrors>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleClose = () => {
        setForm(EMPTY);
        setErrors({});
        onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await InventoryService.storeInventory({
                item_name: form.item_name,
                category: form.category,
                quantity: Number(form.quantity),
                unit: form.unit,
                low_stock_threshold: Number(form.low_stock_threshold),
            });
            onSuccess("Inventory item added successfully.");
            refreshKey();
            handleClose();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: { errors?: InventoryFieldErrors } } };
            if (axiosErr.response?.status === 422) {
                setErrors(axiosErr.response.data?.errors ?? {});
            } else {
                onSuccess("Failed to add inventory item.", true);
            }
        } finally {
            setLoading(false);
        }
    };

    const field = (name: keyof typeof form) => ({
        name,
        value: form[name],
        onChange: handleChange,
        error: errors[name]?.[0],
    });

    return (
        <Modal isOpen={isOpen} onClose={handleClose} showCloseButton>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Add Inventory Item
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <FloatingLabelInput label="Item Name" type="text" required autoFocus {...field("item_name")} />
                        <FloatingLabelSelect label="Category" required {...field("category")}>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </FloatingLabelSelect>
                        <FloatingLabelInput label="Unit (e.g. pcs, liters)" type="text" required {...field("unit")} />
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <FloatingLabelInput label="Quantity" type="number" min={0} required {...field("quantity")} />
                        <FloatingLabelInput
                            label="Low Stock Threshold"
                            type="number"
                            min={1}
                            required
                            {...field("low_stock_threshold")}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={handleClose} />
                    <SubmitButton label={loading ? "Saving…" : "Save Item"} disabled={loading} />
                </div>
            </form>
        </Modal>
    );
};

export default AddInventoryFormModal;
