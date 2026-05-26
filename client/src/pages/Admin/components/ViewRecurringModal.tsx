import type { FC } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import type { RecurringOrder } from "../../../interfaces/RecurringInterfaces";

interface ViewRecurringModalProps {
    isOpen:         boolean;
    onClose:        () => void;
    recurringOrder: RecurringOrder | null;
}

const ViewRecurringModal: FC<ViewRecurringModalProps> = ({
    isOpen,
    onClose,
    recurringOrder,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h1 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-4">
                    Recurring Order Details
                </h1>

                {!recurringOrder ? (
                    <div className="py-8 text-center text-gray-400 text-sm">
                        No order selected.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                        <div>
                            <p className="text-xs text-gray-400">Product</p>
                            <p className="text-sm font-medium text-gray-700">
                                {recurringOrder.product?.name ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Size</p>
                            <p className="text-sm font-medium text-gray-700">
                                {recurringOrder.product?.size ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Quantity</p>
                            <p className="text-sm font-medium text-gray-700">
                                {recurringOrder.quantity}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Day of Week</p>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">
                                {recurringOrder.day_of_week}
                            </span>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-gray-400">Delivery Address</p>
                            <p className="text-sm font-medium text-gray-700">
                                {recurringOrder.delivery_address ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Status</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                recurringOrder.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}>
                                {recurringOrder.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Created</p>
                            <p className="text-sm text-gray-600">
                                {new Date(recurringOrder.created_at).toLocaleDateString("en-PH", {
                                    month: "short",
                                    day:   "numeric",
                                    year:  "numeric",
                                })}
                            </p>
                        </div>
                        {recurringOrder.notes && (
                            <div className="col-span-2">
                                <p className="text-xs text-gray-400">Notes</p>
                                <p className="text-sm text-gray-600">{recurringOrder.notes}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <CloseButton label="Close" onClose={onClose} />
                </div>
            </div>
        </Modal>
    );
};

export default ViewRecurringModal;