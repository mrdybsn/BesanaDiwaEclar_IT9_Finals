import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Info, Pencil } from "lucide-react";
import type { CartItem } from "./ShopMainPage";

type PaymentMethod = "cash" | "gcash" | "maya";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DELIVERY_FEE = 20.00;
const CANCELLATION_FEE = 50.00;

const productImageMap: Record<string, string> = {
    "500ml": "https://images.unsplash.com/photo-1536939459926-301728717817?w=80&q=80",
    "1L": "https://images.unsplash.com/photo-1624958723474-76cfe7a7c44e?w=80&q=80",
    "5gal (Exchange)": "https://images.unsplash.com/photo-1563351672-62b74891a28a?w=80&q=80",
    "5gal (New Container)": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=80&q=80",
};

const OrderFormMainPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const cartItems: CartItem[] = location.state?.cartItems ?? [];

    const [orderType, setOrderType] = useState<"today" | "recurring">("today");
    const [selectedDay, setSelectedDay] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        document.title = "Place an Order";
        if (cartItems.length === 0) {
            navigate("/shop");
        }
    }, []);

    const itemsTotal = cartItems.reduce((sum, c) => sum + c.subtotal, 0);
    const total = itemsTotal + DELIVERY_FEE;
    const totalItems = cartItems.reduce((sum, c) => sum + c.quantity, 0);

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto mt-16 text-center space-y-4">
                <p className="text-5xl">
                    {orderType === "recurring" ? "📅" : "✅"}
                </p>
                <h2 className="text-xl font-bold text-gray-800">
                    {orderType === "recurring"
                        ? "Recurring Order Submitted!"
                        : "Order Placed Successfully!"}
                </h2>
                <p className="text-sm text-gray-500">
                    {orderType === "recurring"
                        ? "Your recurring order is pending admin confirmation. You will be notified once approved."
                        : "Your order has been placed. You can track it in My Orders."}
                </p>
                {orderType === "today" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700 text-left">
                        <p className="font-semibold mb-1">⚠ Cancellation Policy</p>
                        <p>
                            If you cancel after the rider has departed, a cancellation fee of{" "}
                            <span className="font-bold">₱{CANCELLATION_FEE.toFixed(2)}</span> will apply.
                        </p>
                    </div>
                )}
                <div className="flex gap-2 justify-center">
                    <button
                        type="button"
                        onClick={() => navigate("/shop")}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer"
                    >
                        Back to Shop
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/shop/history")}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer"
                    >
                        My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/shop")}
                    className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    ←
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Place an Order</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Order for today's delivery or set a recurring weekly schedule.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

                {/* Order Type */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Order Type</p>
                    <div className="flex gap-3">
                        {(["today", "recurring"] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setOrderType(type)}
                                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                    orderType === type
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {type === "today" ? "🚚 Deliver Today" : "📅 Recurring Weekly"}
                            </button>
                        ))}
                    </div>
                    {orderType === "recurring" && (
                        <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-600">
                                Recurring orders require admin confirmation before they are activated.
                                You will be notified once approved.
                            </p>
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                        Your Order
                        <span className="ml-2 text-xs text-gray-400 font-normal">
                            ({totalItems} item{totalItems > 1 ? "s" : ""})
                        </span>
                    </p>
                    <div className="space-y-3">
                        {cartItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                                    <img
                                        src={productImageMap[item.size]}
                                        alt={item.size}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.size}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                                        ₱{item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-gray-800 shrink-0">
                                    ₱{item.subtotal.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Edit cart — passes cart back so quantities are restored */}
                    <button
                        type="button"
                        onClick={() => navigate("/shop", { state: { cartItems } })}
                        className="mt-3 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors"
                    >
                        <Pencil size={12} /> Edit
                    </button>
                </div>

                {/* Day of week — only for recurring */}
                {orderType === "recurring" && (
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Day</p>
                        <div className="grid grid-cols-4 gap-2">
                            {days.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => setSelectedDay(day)}
                                    className={`py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                                        selectedDay === day
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delivery Address */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</p>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Contact Number */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Contact Number</p>
                    <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="09XXXXXXXXX"
                        className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Notes */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                        Notes <span className="text-gray-400 font-normal">(optional)</span>
                    </p>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Leave at gate if no one's home"
                        className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Payment Method */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Payment Method</p>
                    <div className="flex gap-2">
                        {(["cash", "gcash", "maya"] as PaymentMethod[]).map((method) => (
                            <button
                                key={method}
                                type="button"
                                onClick={() => setPaymentMethod(method)}
                                className={`flex-1 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                                    paymentMethod === method
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {method === "cash" ? "💵 Cash" : method === "gcash" ? "📱 GCash" : "💳 Maya"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Order Summary</p>
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs text-gray-500">
                            <span>{item.name} — {item.size} × {item.quantity}</span>
                            <span>₱{item.subtotal.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Delivery Fee</span>
                        <span>₱{DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-800 border-t border-gray-200 pt-2 mt-1">
                        <span>Total</span>
                        <span>₱{total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-start gap-2 mt-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                        <Info size={13} className="text-yellow-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-yellow-700">
                            Cancellation fee of{" "}
                            <span className="font-bold">₱{CANCELLATION_FEE.toFixed(2)}</span>{" "}
                            applies if cancelled after rider has departed.
                        </p>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    disabled={
                        !address ||
                        !contactNumber ||
                        (orderType === "recurring" && !selectedDay)
                    }
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
                >
                    {orderType === "recurring" ? "Submit for Admin Confirmation" : "Place Order"}
                </button>
            </div>
        </div>
    );
};

export default OrderFormMainPage;