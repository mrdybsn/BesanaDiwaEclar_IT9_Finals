interface PaymentQRModalProps {
    isOpen: boolean;
    method: "gcash" | "maya";
    amount: number;
    onClose: () => void;
}

const QR_DATA: Record<string, { label: string; account: string }> = {
    gcash: { label: "GCash", account: "09XX-XXX-XXXX" },
    maya:  { label: "Maya",  account: "09XX-XXX-XXXX" },
};

const PaymentQRModal = ({ isOpen, method, amount, onClose }: PaymentQRModalProps) => {
    if (!isOpen) return null;

    const info = QR_DATA[method];
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        `${info.label} Payment - Soldier's Thirst - ₱${amount.toFixed(2)}`
    )}`;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-gray-800 mb-1">Scan to Pay — {info.label}</h3>
                <p className="text-2xl font-extrabold text-blue-600 mb-4">₱{amount.toFixed(2)}</p>
                <img src={qrUrl} alt={`${info.label} QR Code`} className="mx-auto rounded-xl border border-gray-200" />
                <p className="text-sm text-gray-500 mt-4">Account: {info.account}</p>
                <p className="text-xs text-gray-400 mt-1">Scan with your {info.label} app, then confirm payment below.</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PaymentQRModal;
