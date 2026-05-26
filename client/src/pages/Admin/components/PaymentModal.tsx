import { useState, useEffect, useRef } from "react";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import type { OrderItem } from "../AdminPOSPage";
import AxiosInstance from "../../../services/AxiosInstance";
import OrderService from "../../../services/OrderServices";
import POSReceipt from "./POSReceipt";
import PaymentQRModal from "./PaymentQRModal";
import AddressGeocoder, { type AddressGeoState } from "../../../components/Address/AddressGeocoder";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderItems: OrderItem[];
    onPaymentSuccess: (message: string) => void;
    onSaleComplete: () => void;
}

const PAYMENT_METHODS = [
    { value: "cash",  label: "💵 Cash" },
    { value: "gcash", label: "📱 GCash" },
    { value: "maya",  label: "💳 Maya" },
];

const QUICK_AMOUNTS = [20, 50, 100, 200, 500, 1000];

const DAYS = [
    { value: "monday",    label: "Mon" },
    { value: "tuesday",   label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday",  label: "Thu" },
    { value: "friday",    label: "Fri" },
    { value: "saturday",  label: "Sat" },
    { value: "sunday",    label: "Sun" },
];

type OrderType = "walkin" | "delivery" | "recurring";
type DeliveryPaymentTiming = "pay_now" | "cod";
type Step = 1 | 2;

const EMPTY_CUSTOMER = {
    name:    "",
    contact: "",
    address: "",
};

const PaymentModal = ({
    isOpen,
    onClose,
    orderItems,
    onPaymentSuccess,
    onSaleComplete,
}: PaymentModalProps) => {
    const [step, setStep]                   = useState<Step>(1);
    const [orderType, setOrderType]         = useState<OrderType>("walkin");
    const [deliveryPaymentTiming, setDeliveryPaymentTiming] =
        useState<DeliveryPaymentTiming>("pay_now");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountInput, setAmountInput]     = useState("");
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState<string | null>(null);
    const [customer, setCustomer]           = useState(EMPTY_CUSTOMER);
    const [scheduledDate, setScheduledDate] = useState("");
    const [dayOfWeek, setDayOfWeek]         = useState("monday");
    const [showQR, setShowQR]               = useState(false);
    const [completedOrderId, setCompletedOrderId] = useState<number | undefined>();
    const [showReceipt, setShowReceipt]     = useState(false);
    const [gallonOwned, setGallonOwned]     = useState(0);
    const [gallonExchange, setGallonExchange] = useState(0);
    const [addressGeo, setAddressGeo] = useState<AddressGeoState>({
        lat: null,
        lng: null,
        verified: false,
    });
    const receiptRef = useRef<HTMLDivElement>(null);

    const totalAmount    = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalItems     = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const amountTendered = parseFloat(amountInput) || 0;
    const change         = amountTendered - totalAmount;

    const numpadKeys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOrderType("walkin");
            setDeliveryPaymentTiming("pay_now");
            setPaymentMethod("cash");
            setAmountInput("");
            setError(null);
            setCustomer(EMPTY_CUSTOMER);
            setScheduledDate("");
            setDayOfWeek("monday");
            setShowQR(false);
            setShowReceipt(false);
            setCompletedOrderId(undefined);
            setGallonOwned(0);
            setGallonExchange(0);
            setAddressGeo({ lat: null, lng: null, verified: false });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isDeliveryCod =
        orderType === "delivery" && deliveryPaymentTiming === "cod";
    const isRecurringCod = orderType === "recurring";
    const isCodOrder = isDeliveryCod || isRecurringCod;

    const isStep1Valid = () => {
        if (orderType === "walkin") return true;
        if (!customer.name.trim())    return false;
        if (!customer.address.trim()) return false;
        if (!addressGeo.verified || addressGeo.lat === null || addressGeo.lng === null) {
            return false;
        }
        if (orderType === "delivery" && !scheduledDate) return false;
        return true;
    };

    const step2Label =
        orderType === "walkin" || (orderType === "delivery" && deliveryPaymentTiming === "pay_now")
            ? "Payment"
            : "Confirm";

    const handleNumpad = (val: string) => {
        if (val === "⌫") {
            setAmountInput((prev) => prev.slice(0, -1));
        } else if (val === ".") {
            if (!amountInput.includes(".")) setAmountInput((prev) => prev + ".");
        } else {
            setAmountInput((prev) => prev + val);
        }
    };

    // Get next occurrence of a day of week
    const getNextOccurrence = (day: string): string => {
        const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
        const target  = days.indexOf(day);
        const today   = new Date();
        const current = today.getDay();
        let diff = target - current;
        if (diff <= 0) diff += 7;
        const next = new Date(today);
        next.setDate(today.getDate() + diff);
        return next.toISOString().split("T")[0];
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        try {
            const paymentStatus: "paid" | "unpaid" =
                orderType === "walkin"
                    ? "paid"
                    : isCodOrder
                      ? "unpaid"
                      : "paid";

            const methodForOrder: "cash" | "gcash" | "maya" | "other" =
                isCodOrder ? "cash" : (paymentMethod as "cash" | "gcash" | "maya" | "other");

            const orderRes = await OrderService.storeOrder({
                order_type:       orderType === "recurring" ? "delivery" : orderType,
                payment_method:   methodForOrder,
                payment_status:   paymentStatus,
                delivery_address: orderType !== "walkin" ? customer.address : undefined,
                gps_lat:          orderType !== "walkin" ? addressGeo.lat ?? undefined : undefined,
                gps_lng:          orderType !== "walkin" ? addressGeo.lng ?? undefined : undefined,
                scheduled_date:   orderType === "delivery"
                    ? scheduledDate
                    : orderType === "recurring"
                    ? getNextOccurrence(dayOfWeek)
                    : undefined,
                gallon_owned:     gallonOwned,
                gallon_exchange:  gallonExchange,
                customer_name:    customer.name    || undefined,
                customer_contact: customer.contact || undefined,
                customer_address: customer.address || undefined,
                items: orderItems.map((item) => ({
                    product_id: item.product_id,
                    quantity:   item.quantity,
                })),
            });

            const orderId = orderRes.order.order_id;
            const customerId = orderRes.order.customer_id;
            setCompletedOrderId(orderId);

            if (orderType === "recurring") {
                for (const item of orderItems) {
                    await AxiosInstance.post("/admin/recurring", {
                        customer_id:      customerId ?? undefined,
                        product_id:       item.product_id,
                        quantity:         item.quantity,
                        day_of_week:      dayOfWeek,
                        delivery_address: customer.address,
                        notes: customer.name
                            ? `Customer: ${customer.name}${customer.contact ? ` | Contact: ${customer.contact}` : ""}`
                            : null,
                    });
                }
            }

            setShowReceipt(true);

            const successMsg = orderType === "walkin"
                ? "Payment successful!"
                : isCodOrder
                  ? "Delivery order placed. Rider will collect payment on delivery."
                  : "Order placed and paid. Assign a rider under Deliveries.";

            onPaymentSuccess(successMsg);

        } catch (err: any) {
            console.error("Failed to save order:", err);
            setError(err.response?.data?.message ?? "Failed to save order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintReceipt = () => {
        const el = receiptRef.current;
        if (!el) return;
        const printWindow = window.open("", "_blank", "width=360,height=720");
        if (!printWindow) return;
        printWindow.document.write(`
            <html><head><title>Receipt</title>
            <style>
              body { margin: 0; padding: 8px; background: #fff; }
              .thermal-receipt { font-family: "Courier New", Courier, monospace; font-size: 12px; width: 280px; margin: 0 auto; color: #111; }
              .shop-name { text-align: center; font-weight: 700; font-size: 15px; margin: 0 0 4px; }
              .shop-line, .divider, .receipt-title, .thank-you { text-align: center; margin: 4px 0; }
              .items-header { display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px dashed #999; margin: 8px 0 4px; }
              .item-row, .total-row, .meta-line { margin: 3px 0; white-space: pre; font-size: 11px; }
              .total-row { font-weight: 700; font-size: 14px; }
              .thank-you { font-weight: 700; letter-spacing: 2px; margin: 10px 0; }
              .barcode { display: flex; justify-content: center; gap: 1px; height: 36px; margin-top: 8px; }
              .barcode-bar { display: inline-block; height: 100%; background: #111; }
            </style></head>
            <body>${el.outerHTML}</body></html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <>
        <PaymentQRModal
            isOpen={showQR}
            method={paymentMethod as "gcash" | "maya"}
            amount={totalAmount}
            onClose={() => setShowQR(false)}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <ModalCloseButton onClose={onClose} />

                {/* Step Indicator */}
                <div className="flex items-center gap-2 px-6 pt-6 pb-2">
                    {([1, 2] as Step[]).map((s, i) => (
                        <div key={s} className="flex items-center gap-2 flex-1">
                            <div className={`flex items-center gap-2 text-sm font-semibold ${step === s ? "text-blue-600" : step > s ? "text-green-600" : "text-gray-400"}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step === s ? "bg-blue-600 text-white" :
                                    step > s  ? "bg-green-500 text-white" :
                                    "bg-gray-200 text-gray-500"
                                }`}>
                                    {step > s ? "✓" : s}
                                </span>
                                {s === 1 ? "Order Details" : step2Label}
                            </div>
                            {i === 0 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 divide-x divide-gray-100">

                    {/* LEFT — Receipt */}
                    <div className="p-6">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                            {orderType === "walkin"
                                ? "Walk-in Order"
                                : orderType === "recurring"
                                ? "Recurring Order"
                                : "Delivery Order"}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mb-4">
                            Transaction Details
                        </p>

                        {/* Items */}
                        <div className="space-y-3 mb-4">
                            {orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {item.name} — {item.size}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ₱{item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 shrink-0 ml-4">
                                        ₱{item.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-gray-200 pt-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Items ({totalItems})</span>
                                <span>₱{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                            <span className="text-base font-bold text-gray-800">Total</span>
                            <span className="text-xl font-extrabold text-gray-900">
                                ₱{totalAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Customer summary — walkin only if filled, always for delivery/recurring */}
                        {customer.name && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                                <p className="font-semibold text-gray-600">Customer Info</p>
                                <p className="text-gray-500">{customer.name}</p>
                                {customer.contact && <p className="text-gray-500">{customer.contact}</p>}
                                {customer.address && <p className="text-gray-500">{customer.address}</p>}
                                {orderType === "delivery" && scheduledDate && (
                                    <p className="text-blue-600 font-medium">📅 {scheduledDate}</p>
                                )}
                                {orderType === "delivery" && (
                                    <p className={`font-medium ${isDeliveryCod ? "text-amber-600" : "text-green-600"}`}>
                                        {isDeliveryCod ? "💵 Cash on delivery" : "✓ Pay now"}
                                    </p>
                                )}
                                {orderType === "recurring" && (
                                    <p className="text-purple-600 font-medium">
                                        🔁 Every {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Change */}
                        {step === 2 && paymentMethod === "cash" && amountTendered > 0 && (
                            <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tendered</span>
                                    <span className="font-semibold text-gray-700">
                                        ₱{amountTendered.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500">Change</span>
                                    <span className={`font-bold ${change < 0 ? "text-red-500" : "text-green-600"}`}>
                                        ₱{change < 0 ? "0.00" : change.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Steps */}
                    <div className="p-6 flex flex-col gap-4">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <>
                                {/* Order Type */}
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Order Type
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { value: "walkin",    label: "🏪 Walk-in",   desc: "One-time, paid at counter" },
                                            { value: "delivery",  label: "🚴 Delivery",  desc: "Pay now or cash on delivery" },
                                            { value: "recurring", label: "🔁 Recurring", desc: "Repeat every week on a set day" },
                                        ].map((t) => (
                                            <button
                                                key={t.value}
                                                type="button"
                                                onClick={() => {
                                                    setOrderType(t.value as OrderType);
                                                    setCustomer(EMPTY_CUSTOMER);
                                                    setAddressGeo({ lat: null, lng: null, verified: false });
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                                    orderType === t.value
                                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                <span className="font-semibold">{t.label}</span>
                                                <span className="text-xs text-gray-400 block">{t.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Walk-in — optional customer fields */}
                                {(orderType === "delivery" || orderType === "recurring") && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Gallons owned (new)</p>
                                            <input type="number" min={0} value={gallonOwned}
                                                onChange={(e) => setGallonOwned(Number(e.target.value))}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Gallons exchanged</p>
                                            <input type="number" min={0} value={gallonExchange}
                                                onChange={(e) => setGallonExchange(Number(e.target.value))}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                                        </div>
                                    </div>
                                )}

                                {orderType === "walkin" && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Customer Info
                                            <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={customer.name}
                                            onChange={(e) => setCustomer(p => ({ ...p, name: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Contact Number"
                                            value={customer.contact}
                                            onChange={(e) => setCustomer(p => ({ ...p, contact: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                {/* Delivery / Recurring — required customer fields */}
                                {(orderType === "delivery" || orderType === "recurring") && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Customer Details
                                            <span className="text-xs font-normal text-red-400 ml-1">* required</span>
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="Full Name *"
                                            value={customer.name}
                                            onChange={(e) => setCustomer(p => ({ ...p, name: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Contact Number"
                                            value={customer.contact}
                                            onChange={(e) => setCustomer(p => ({ ...p, contact: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <AddressGeocoder
                                            address={customer.address}
                                            onAddressChange={(addr) =>
                                                setCustomer((p) => ({ ...p, address: addr }))
                                            }
                                            geo={addressGeo}
                                            onGeoChange={setAddressGeo}
                                            required
                                        />

                                        {/* Scheduled date for delivery */}
                                        {orderType === "delivery" && (
                                            <>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                                        Payment Timing
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            {
                                                                value: "pay_now" as const,
                                                                label: "Pay Now",
                                                                desc: "GCash, Maya, or cash at counter",
                                                            },
                                                            {
                                                                value: "cod" as const,
                                                                label: "Cash on Delivery",
                                                                desc: "Rider collects when delivered",
                                                            },
                                                        ].map((opt) => (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeliveryPaymentTiming(opt.value)
                                                                }
                                                                className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-colors ${
                                                                    deliveryPaymentTiming === opt.value
                                                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                                }`}
                                                            >
                                                                <span className="font-semibold block">
                                                                    {opt.label}
                                                                </span>
                                                                <span className="text-gray-400">
                                                                    {opt.desc}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Scheduled Date *</p>
                                                    <input
                                                        type="date"
                                                        value={scheduledDate}
                                                        onChange={(e) => setScheduledDate(e.target.value)}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {orderType === "recurring" && (
                                            <p className="text-xs text-purple-700 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                                                Recurring orders are paid weekly on delivery (cash on delivery).
                                            </p>
                                        )}

                                        {/* Day picker for recurring */}
                                        {orderType === "recurring" && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Repeat Every</p>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {DAYS.map((d) => (
                                                        <button
                                                            key={d.value}
                                                            type="button"
                                                            onClick={() => setDayOfWeek(d.value)}
                                                            className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                                                dayOfWeek === d.value
                                                                    ? "bg-blue-600 text-white border-blue-600"
                                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {d.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!isStep1Valid()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-colors mt-auto"
                                >
                                    {isCodOrder
                                        ? "Next — Confirm →"
                                        : "Next — Payment →"}
                                </button>
                            </>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-xs text-blue-600 hover:underline text-left"
                                >
                                    ← Back to Order Details
                                </button>

                                {isCodOrder ? (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <p className="text-sm font-semibold text-amber-900 mb-1">
                                            Cash on delivery
                                        </p>
                                        <p className="text-xs text-amber-800">
                                            No payment is taken now. After you assign a rider, they will
                                            collect ₱{totalAmount.toFixed(2)} when the order is delivered.
                                        </p>
                                        {orderType === "delivery" && scheduledDate && (
                                            <p className="text-xs text-amber-700 mt-2 font-medium">
                                                Scheduled: {scheduledDate}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Payment Method
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {PAYMENT_METHODS.map((m) => (
                                                <button
                                                    key={m.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setPaymentMethod(m.value);
                                                        setAmountInput("");
                                                        if (m.value === "gcash" || m.value === "maya") {
                                                            setShowQR(true);
                                                        }
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                                        paymentMethod === m.value
                                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {m.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isCodOrder && paymentMethod === "cash" && (
                                    <div>
                                        <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-right mb-3">
                                            <p className="text-xs text-gray-400 mb-0.5">Amount Tendered</p>
                                            <p className="text-2xl font-bold text-gray-900 font-mono">
                                                ₱{amountInput || "0"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            {QUICK_AMOUNTS.map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setAmountInput(amt.toString())}
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    ₱{amt}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            {numpadKeys.map((key) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => handleNumpad(key)}
                                                    className={`py-3 rounded-xl text-base font-semibold cursor-pointer transition-colors ${
                                                        key === "⌫"
                                                            ? "bg-red-50 hover:bg-red-100 text-red-500"
                                                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                                    }`}
                                                >
                                                    {key}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {showReceipt && (
                                    <div className="space-y-2 border border-green-200 bg-green-50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-green-700">Sale complete!</p>
                                        <div className="max-h-64 overflow-y-auto bg-white rounded-lg border border-green-200 p-2">
                                            <POSReceipt
                                                ref={receiptRef}
                                                orderItems={orderItems}
                                                orderId={completedOrderId}
                                                paymentMethod={paymentMethod}
                                                paymentStatus={isCodOrder ? "unpaid" : "paid"}
                                                customerName={customer.name || undefined}
                                                change={change}
                                                amountTendered={amountTendered}
                                            />
                                        </div>
                                        <button type="button" onClick={handlePrintReceipt}
                                            className="w-full py-2 bg-white border border-green-300 text-green-700 text-xs font-semibold rounded-lg">
                                            🖨 Print Receipt
                                        </button>
                                        <button type="button" onClick={() => { onSaleComplete(); onClose(); }}
                                            className="w-full py-2 bg-green-600 text-white text-xs font-semibold rounded-lg">
                                            Done
                                        </button>
                                    </div>
                                )}

                                {!showReceipt && (
                                    <button
                                        type="button"
                                        onClick={handleConfirm}
                                        disabled={
                                            loading ||
                                            (!isCodOrder &&
                                                paymentMethod === "cash" &&
                                                (amountTendered < totalAmount || amountTendered === 0))
                                        }
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl cursor-pointer transition-colors mt-auto"
                                    >
                                        {loading
                                            ? "Saving..."
                                            : isCodOrder
                                              ? "✓ Place Delivery Order"
                                              : "✓ Confirm Sale"}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default PaymentModal;