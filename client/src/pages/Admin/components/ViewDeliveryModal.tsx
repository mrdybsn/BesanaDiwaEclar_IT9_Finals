import type { FC } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import type { Delivery } from "../../../interfaces/DeliveryInterfaces";

interface ViewDeliveryModalProps {
    isOpen:    boolean;
    onClose:   () => void;
    delivery:  Delivery | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-700" },
    assigned:   { label: "Assigned",   className: "bg-blue-100   text-blue-700"   },
    in_transit: { label: "In Transit", className: "bg-indigo-100 text-indigo-700" },
    delivered:  { label: "Delivered",  className: "bg-green-100  text-green-700"  },
    failed:     { label: "Failed",     className: "bg-red-100    text-red-700"    },
};

const Row: FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value ?? "—"}</p>
    </div>
);

const ViewDeliveryModal: FC<ViewDeliveryModalProps> = ({ isOpen, onClose, delivery }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h1 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-5">
                    Delivery Details
                </h1>

                {!delivery ? (
                    <p className="text-sm text-gray-400 text-center py-8">No delivery selected.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                            <Row
                                label="Rider"
                                value={
                                    delivery.rider
                                        ? `${delivery.rider.last_name}, ${delivery.rider.first_name}`
                                        : <span className="text-yellow-600">Unassigned</span>
                                }
                            />
                            <Row label="Scheduled Date" value={delivery.scheduled_date} />
                            <Row
                                label="Status"
                                value={
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[delivery.status]?.className}`}>
                                        {statusConfig[delivery.status]?.label ?? delivery.status}
                                    </span>
                                }
                            />
                            <Row label="Expected Amount" value={`₱${Number(delivery.expected_amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`} />
                            <Row label="Collected Amount" value={`₱${Number(delivery.collected_amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`} />
                            <Row label="Delivery Address" value={delivery.order?.delivery_address} />
                            {delivery.notes && (
                                <div className="col-span-2">
                                    <Row label="Notes" value={delivery.notes} />
                                </div>
                            )}
                        </div>

                        {/* Order items */}
                        {delivery.order?.order_items && delivery.order.order_items.length > 0 && (
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Order Items</p>
                                <div className="space-y-1">
                                    {delivery.order.order_items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-xs text-gray-600">
                                            <span>{item.product?.name ?? "Product"} — {item.product?.size ?? ""}</span>
                                            <span className="font-medium">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="flex justify-end mt-6">
                    <CloseButton label="Close" onClose={onClose} />
                </div>
            </div>
        </Modal>
    );
};

export default ViewDeliveryModal;