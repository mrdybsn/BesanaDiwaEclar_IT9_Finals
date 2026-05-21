import { useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import UploadInput from "../../../components/Input/UploadInput";
import ProductService from "../../../services/ProductService";
import type { ProductFieldErrors } from "../../../interfaces/ProductInterfaces";

const SIZES = [
    { value: "500ml",  label: "500ml" },
    { value: "1L",     label: "1L" },
    { value: "5gal",   label: "5 Gallon" },
    { value: "custom", label: "Custom" },
];

interface AddProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: (message: string, isFailed?: boolean) => void;
    refreshKey: () => void;
}

const EMPTY_FORM = {
    name: "",
    size: "",
    unit: "",
    price: "",
    price_per_liter: "",
    custom_volume_ml: "",
    container_deposit: "",
    stock: "",
    low_stock_threshold: "",
};

const AddProductFormModal: FC<AddProductFormModalProps> = ({
    isOpen,
    onClose,
    onProductAdded,
    refreshKey,
}) => {
    const [loadingStore, setLoadingStore] = useState(false);
    const [errors, setErrors] = useState<ProductFieldErrors>({});
    const [form, setForm] = useState(EMPTY_FORM);
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClose = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setImage(null);
        onClose();
    };

    const handleStoreProduct = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingStore(true);

        const formData = new FormData();
        if (image) formData.append("image", image);
        Object.entries(form).forEach(([key, value]) => {
            if (value !== "") formData.append(key, value);
        });

        try {
            const res = await ProductService.storeProduct(formData);
            if (res.status === 200) {
                setForm(EMPTY_FORM);
                setErrors({});
                setImage(null);
                onProductAdded(res.data.message);
                refreshKey();
                onClose();
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Unexpected server error during adding product:", error);
            }
        } finally {
            setLoadingStore(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} showCloseButton>
            <form onSubmit={handleStoreProduct} className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Add Product Form
                </h1>

                {/* Product Image */}
                <div className="mb-4">
                    <UploadInput
                        label="Product Image"
                        name="image"
                        value={image}
                        onChange={setImage}
                        errors={errors.image}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Product Name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                autoFocus
                                errors={errors.name}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect
                                label="Size"
                                name="size"
                                value={form.size}
                                onChange={handleChange}
                                required
                                errors={errors.size}
                            >
                                <option value="">Select Size</option>
                                {SIZES.map((s) => (
                                    <option value={s.value} key={s.value}>{s.label}</option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        {form.size === "custom" && (
                            <div className="mb-4">
                                <FloatingLabelInput
                                    label="Custom Volume (ml)"
                                    type="number"
                                    name="custom_volume_ml"
                                    value={form.custom_volume_ml}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                    errors={errors.custom_volume_ml}
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Unit (e.g. bottle, gallon)"
                                type="text"
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                required
                                errors={errors.unit}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Price (PHP)"
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                                min={0}
                                step="0.01"
                                errors={errors.price}
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Price per Liter (PHP)"
                                type="number"
                                name="price_per_liter"
                                value={form.price_per_liter}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                errors={errors.price_per_liter}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Container Deposit (PHP)"
                                type="number"
                                name="container_deposit"
                                value={form.container_deposit}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                errors={errors.container_deposit}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Stock"
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                required
                                min={0}
                                errors={errors.stock}
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Low Stock Threshold"
                                type="number"
                                name="low_stock_threshold"
                                value={form.low_stock_threshold}
                                onChange={handleChange}
                                required
                                min={1}
                                errors={errors.low_stock_threshold}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {!loadingStore && (
                        <CloseButton label="Close" onClose={handleClose} />
                    )}
                    <SubmitButton
                        label="Save Product"
                        loading={loadingStore}
                        loadingLabel="Saving Product..."
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddProductFormModal;