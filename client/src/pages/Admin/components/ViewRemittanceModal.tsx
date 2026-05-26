import type { FC, ReactNode } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import type { Remittance } from "../../../services/RemittanceService";

interface ViewRemittanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    remittance: Remittance | null;
}

const statusLabels: Record<string, string> = {
    pending: "Pending",
    verified: "Verified",
    discrepancy: "Discrepancy",
};

const Row: FC<{ label: string; value?: ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value ?? "—"}</p>
    </div>
);

const ViewRemittanceModal: FC<ViewRemittanceModalProps> = ({ isOpen, onClose, remittance }) => {
    const riderName = remittance?.rider
        ? `${remittance.rider.last_name}, ${remittance.rider.first_name}`
        : "—";

    const collected = Number(remittance?.collected_amount ?? 0);
    const remitted = Number(remittance?.remitted_amount ?? 0);
    const discrepancy = collected - remitted;

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h1 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-5">
                    Remittance Details
                </h1>

                {!remittance ? (
                    <p className="text-sm text-gray-400 text-center py-8">No remittance selected.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                        <Row label="Remittance ID" value={`#${remittance.remittance_id}`} />
                        <Row label="Status" value={statusLabels[remittance.status] ?? remittance.status} />
                        <Row label="Rider" value={riderName} />
                        <Row label="Delivery ID" value={`#${remittance.delivery_id}`} />
                        <Row label="Date" value={remittance.date} />
                        <Row
                            label="Order"
                            value={
                                remittance.delivery?.order?.order_id
                                    ? `#${remittance.delivery.order.order_id}`
                                    : "—"
                            }
                        />
                        <Row
                            label="Collected Amount"
                            value={`₱${collected.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                        />
                        <Row
                            label="Remitted Amount"
                            value={`₱${remitted.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                        />
                        <Row
                            label="Difference"
                            value={
                                <span className={discrepancy === 0 ? "text-green-600" : "text-red-600"}>
                                    {discrepancy >= 0 ? "" : "−"}₱
                                    {Math.abs(discrepancy).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                </span>
                            }
                        />
                        {remittance.notes && (
                            <div className="col-span-2">
                                <Row label="Notes" value={remittance.notes} />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                </div>
            </div>
        </Modal>
    );
};

export default ViewRemittanceModal;
