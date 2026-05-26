import { useEffect, useRef, useState, type FC } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import type { Order } from "../../../interfaces/OrderInterfaces";
import OrderService from "../../../services/OrderServices";
import POSReceipt from "./POSReceipt";
import { printReceiptElement } from "../../../utils/printReceipt";

interface ViewOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number | null;
    initialView?: "details" | "receipt";
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:          { label: "Pending",          className: "bg-yellow-100 text-yellow-700" },
    confirmed:        { label: "Confirmed",         className: "bg-blue-100 text-blue-700" },
    out_for_delivery: { label: "Out for Delivery",  className: "bg-indigo-100 text-indigo-700" },
    delivered:        { label: "Delivered",         className: "bg-green-100 text-green-700" },
    cancelled:        { label: "Cancelled",         className: "bg-red-100 text-red-700" },
};

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
    paid:    { label: "Paid",    className: "bg-green-100 text-green-700" },
    unpaid:  { label: "Unpaid",  className: "bg-red-100 text-red-700" },
    partial: { label: "Partial", className: "bg-yellow-100 text-yellow-700" },
};

const ViewOrderModal: FC<ViewOrderModalProps> = ({
    isOpen,
    onClose,
    orderId,
    initialView = "details",
}) => {
    const [order, setOrder]         = useState<Order | null>(null);
    const [loading, setLoading]     = useState(false);
    const [view, setView]           = useState<"details" | "receipt">(initialView);
    const receiptRef                = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && orderId) {
            setView(initialView);
            fetchOrder();
        }
    }, [isOpen, orderId, initialView]);

    const fetchOrder = async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            const res = await OrderService.getOrder(orderId);
            setOrder(res.order);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOrder(null);
        setView("details");
        onClose();
    };

    const customerName = order?.customer
        ? `${order.customer.first_name} ${order.customer.last_name}`
        : order?.order_type === "walkin"
          ? "Walk-in Customer"
          : undefined;

    const receiptItems = (order?.order_items ?? []).map((item) => ({
        name:     item.product?.name ?? "Product",
        size:     item.product?.size ?? "",
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
    }));

    const canShowReceipt =
        order?.status === "delivered" && receiptItems.length > 0;

    const handlePrint = () => {
        if (receiptRef.current) {
            printReceiptElement(receiptRef.current);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} showCloseButton>
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {view === "receipt" ? "Order Receipt" : "Order Details"}
                    </h1>
                    {canShowReceipt && view === "details" && (
                        <button
                            type="button"
                            onClick={() => setView("receipt")}
                            className="text-sm font-medium text-green-600 hover:underline"
                        >
                            View Receipt
                        </button>
                    )}
                    {view === "receipt" && (
                        <button
                            type="button"
                            onClick={() => setView("details")}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Back to Details
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
                ) : !order ? (
                    <div className="py-10 text-center text-gray-400 text-sm">Order not found.</div>
                ) : view === "receipt" ? (
                    <div className="space-y-4">
                        <div className="flex justify-center bg-gray-50 rounded-xl p-4 overflow-x-auto">
                            <POSReceipt
                                ref={receiptRef}
                                orderItems={receiptItems}
                                orderId={order.order_id}
                                paymentMethod={order.payment_method}
                                paymentStatus={order.payment_status as "paid" | "unpaid"}
                                customerName={customerName}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <CloseButton label="Close" onClose={handleClose} />
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                            >
                                Print Receipt
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                            <div>
                                <p className="text-xs text-gray-400">Order ID</p>
                                <p className="text-sm font-medium text-gray-700">#{order.order_id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Order Type</p>
                                <p className="text-sm font-medium text-gray-700 capitalize">{order.order_type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Processed By</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {order.processed_by_user
                                        ? `${order.processed_by_user.first_name} ${order.processed_by_user.last_name}`
                                        : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Date</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {new Date(order.created_at).toLocaleString("en-PH", {
                                        month:  "short",
                                        day:    "numeric",
                                        year:   "numeric",
                                        hour:   "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Payment Method</p>
                                <p className="text-sm font-medium text-gray-700 capitalize">{order.payment_method}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Payment Status</p>
                                {(() => {
                                    const ps = paymentStatusConfig[order.payment_status];
                                    return (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ps.className}`}>
                                            {ps.label}
                                        </span>
                                    );
                                })()}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Status</p>
                                {(() => {
                                    const s = statusConfig[order.status];
                                    return (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.className}`}>
                                            {s.label}
                                        </span>
                                    );
                                })()}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Total Amount</p>
                                <p className="text-sm font-bold text-gray-800">
                                    ₱ {Number(order.total_amount).toFixed(2)}
                                </p>
                            </div>
                            {order.delivery_address && (
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400">Delivery Address</p>
                                    <p className="text-sm font-medium text-gray-700">{order.delivery_address}</p>
                                </div>
                            )}
                            {order.gallon_exchange > 0 && (
                                <div>
                                    <p className="text-xs text-gray-400">Gallon Exchange</p>
                                    <p className="text-sm font-medium text-gray-700">{order.gallon_exchange} jug(s)</p>
                                </div>
                            )}
                            {order.notes && (
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400">Notes</p>
                                    <p className="text-sm text-gray-600">{order.notes}</p>
                                </div>
                            )}
                        </div>

                        {order.order_items && order.order_items.length > 0 && (
                            <div className="border border-gray-100 rounded-lg overflow-hidden mb-4">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Items Ordered
                                    </p>
                                </div>
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-xs text-gray-500">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Product</th>
                                            <th className="px-4 py-2 text-center">Qty</th>
                                            <th className="px-4 py-2 text-center">Unit Price</th>
                                            <th className="px-4 py-2 text-center">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {order.order_items.map(item => (
                                            <tr key={item.order_item_id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-gray-700">
                                                    {item.product?.name ?? "—"}
                                                    <span className="text-xs text-gray-400 ml-1">
                                                        ({item.product?.size ?? ""})
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                <td className="px-4 py-2 text-center">₱ {Number(item.unit_price).toFixed(2)}</td>
                                                <td className="px-4 py-2 text-center font-medium">₱ {Number(item.subtotal).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 font-semibold">
                                            <td colSpan={3} className="px-4 py-2 text-right text-gray-600">Total</td>
                                            <td className="px-4 py-2 text-center text-gray-800">
                                                ₱ {Number(order.total_amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            {canShowReceipt && (
                                <button
                                    type="button"
                                    onClick={() => setView("receipt")}
                                    className="px-4 py-2 border border-green-200 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50"
                                >
                                    View Receipt
                                </button>
                            )}
                            <CloseButton label="Close" onClose={handleClose} />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ViewOrderModal;
