import { useState, useEffect, type FC } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import DeliveryService from "../../../services/DeliveryService";
import type { Delivery, UpdateDeliveryPayload } from "../../../interfaces/DeliveryInterfaces";
import type { RecurringOrder } from "../../../interfaces/RecurringInterfaces";
import AxiosInstance from "../../../services/AxiosInstance";

// ─── interfaces ───────────────────────────────────────────────────────────────

interface Rider {
    user_id:    number;
    first_name: string;
    last_name:  string;
}

interface AssignDeliveryModalProps {
    isOpen:    boolean;
    onClose:   () => void;
    onSuccess: () => void;
}

const AssignDeliveryModal: FC<AssignDeliveryModalProps> = ({ isOpen, onClose, onSuccess }) => {

    const [source, setSource] = useState<"delivery" | "recurring">("delivery");
    const [unassigned, setUnassigned] = useState<Delivery[]>([]);
    const [selectedId, setSelectedId] = useState<number | "">("");
    const [recurringOrders, setRecurringOrders]     = useState<RecurringOrder[]>([]);
    const [selectedRecurring, setSelectedRecurring] = useState<number | "">("");
    const [riders, setRiders]           = useState<Rider[]>([]);
    const [riderId, setRiderId]         = useState<number | "">("");
    const [scheduledDate, setScheduled] = useState("");
    const [notes, setNotes]             = useState("");
    const [loading, setLoading]         = useState(false);
    const [fetching, setFetching]       = useState(false);
    const [error, setError]             = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        setSource("delivery");
        setSelectedId("");
        setSelectedRecurring("");
        setRiderId("");
        setScheduled("");
        setNotes("");
        setError(null);

        const fetchData = async () => {
            setFetching(true);
            try {
                const [deliveryRes, riderRes, recurringRes] = await Promise.all([
                    DeliveryService.loadDeliveries({ status: "pending", unassigned: true, per_page: 100 }),
                    AxiosInstance.get("/admin/riders"),
                    AxiosInstance.get("/admin/recurring", { params: { is_active: true } }),
                ]);

                setUnassigned(deliveryRes.deliveries.data);
                setRiders(riderRes.data.riders ?? []);

                // ✅ matches controller: { success: true, data: [...] }
                const raw: RecurringOrder[] = recurringRes.data.data ?? [];
                setRecurringOrders(raw);
            } catch (e) {
                console.error(e);
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [isOpen]);

    // ── pre-fill when a one-time delivery is selected
    const handleSelectDelivery = (id: number | "") => {
        setSelectedId(id);
        if (id === "") { setScheduled(""); setNotes(""); return; }
        const d = unassigned.find((d) => d.delivery_id === id);
        if (d) {
            setScheduled(d.scheduled_date ?? "");
            setNotes(d.notes ?? "");
        }
    };

    // ── pre-fill when a recurring order is selected
    // Calculates the next upcoming date for the given day_of_week
    const handleSelectRecurring = (id: number | "") => {
        setSelectedRecurring(id);
        if (id === "") { setScheduled(""); setNotes(""); return; }
        const r = recurringOrders.find((r) => r.recurring_order_id === id);
        if (r) {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            // day_of_week stored as lowercase in DB, capitalize for matching
            const capitalized = r.day_of_week.charAt(0).toUpperCase() + r.day_of_week.slice(1).toLowerCase();
            const target = days.indexOf(capitalized);
            const today  = new Date();
            const diff   = (target - today.getDay() + 7) % 7 || 7;
            const next   = new Date(today);
            next.setDate(today.getDate() + diff);
            setScheduled(next.toISOString().split("T")[0]);
            setNotes(r.notes ?? "");
        }
    };

    // ── derived
    const selectedDelivery       = unassigned.find((d) => d.delivery_id === selectedId);
    const selectedRecurringOrder = recurringOrders.find((r) => r.recurring_order_id === selectedRecurring);

    // ── submit
    const handleSubmit = async () => {
        const isRecurring = source === "recurring";

        if (isRecurring) {
            if (!selectedRecurring || !riderId || !scheduledDate) {
                setError("Please fill in all required fields.");
                return;
            }
        } else {
            if (!selectedId || !riderId || !scheduledDate) {
                setError("Please fill in all required fields.");
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            if (isRecurring) {
                await AxiosInstance.post("/admin/deliveries", {
                    recurring_order_id: selectedRecurring,
                    rider_id:           riderId,
                    scheduled_date:     scheduledDate,
                    expected_amount:    selectedRecurringOrder
                                            ? selectedRecurringOrder.product.price * selectedRecurringOrder.quantity
                                            : undefined,
                    notes: notes || undefined,
                });
            } else {
                const payload: UpdateDeliveryPayload = {
                    rider_id:        riderId as number,
                    scheduled_date:  scheduledDate,
                    expected_amount: selectedDelivery?.expected_amount,
                    notes:           notes || undefined,
                };
                await DeliveryService.updateDelivery(selectedId as number, payload);
            }

            onSuccess();
            onClose();
        } catch (e: any) {
            setError(e.response?.data?.message ?? "Failed to assign delivery.");
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = !loading && !fetching && riderId && scheduledDate && (
        source === "delivery" ? !!selectedId : !!selectedRecurring
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">

                {/* ── header ── */}
                <h1 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-5">
                    Assign Rider to Delivery
                </h1>

                {fetching ? (
                    <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
                ) : (
                    <div className="space-y-4">

                        {/* ── source toggle ── */}
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm font-medium">
                            <button
                                type="button"
                                onClick={() => { setSource("delivery"); setSelectedRecurring(""); setScheduled(""); setNotes(""); }}
                                className={`flex-1 py-2 transition-colors ${
                                    source === "delivery"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                One-time Delivery
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSource("recurring"); setSelectedId(""); setScheduled(""); setNotes(""); }}
                                className={`flex-1 py-2 transition-colors border-l border-gray-200 ${
                                    source === "recurring"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                Recurring Order
                            </button>
                        </div>

                        {/* ══ ONE-TIME DELIVERY ══ */}
                        {source === "delivery" && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                                        Unassigned Delivery <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedId}
                                        onChange={(e) => handleSelectDelivery(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">— Select a delivery —</option>
                                        {unassigned.length === 0 && <option disabled>No pending deliveries</option>}
                                        {unassigned.map((d) => (
                                            <option key={d.delivery_id} value={d.delivery_id}>
                                                #{d.delivery_id} — {d.order?.delivery_address ?? "No address"} — ₱{Number(d.expected_amount).toFixed(2)} — {d.scheduled_date}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedDelivery && (
                                    <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-xs space-y-1 text-blue-800">
                                        <p><span className="font-semibold">Address:</span> {selectedDelivery.order?.delivery_address ?? "—"}</p>
                                        <p>
                                            <span className="font-semibold">Items:</span>{" "}
                                            {selectedDelivery.order?.order_items
                                                ?.map((i) => `${i.product?.name ?? "Product"} x${i.quantity}`)
                                                .join(", ") ?? "—"}
                                        </p>
                                        <p><span className="font-semibold">Expected:</span> ₱{Number(selectedDelivery.expected_amount).toFixed(2)}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ══ RECURRING ORDER ══ */}
                        {source === "recurring" && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                                        Customer's Recurring Order <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedRecurring}
                                        onChange={(e) => handleSelectRecurring(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">— Select a recurring order —</option>
                                        {recurringOrders.length === 0 && <option disabled>No active recurring orders</option>}
                                        {recurringOrders.map((r) => (
                                            <option key={r.recurring_order_id} value={r.recurring_order_id}>
                                                {r.customer?.first_name} {r.customer?.last_name} — Every {r.day_of_week} — {r.product?.name} x{r.quantity}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedRecurringOrder && (
                                    <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 text-xs space-y-1 text-indigo-800">
                                        <p><span className="font-semibold">Customer:</span> {selectedRecurringOrder.customer?.first_name} {selectedRecurringOrder.customer?.last_name}</p>
                                        <p><span className="font-semibold">Address:</span> {selectedRecurringOrder.delivery_address}</p>
                                        <p><span className="font-semibold">Item:</span> {selectedRecurringOrder.product?.name} ({selectedRecurringOrder.product?.size}) x{selectedRecurringOrder.quantity}</p>
                                        <p><span className="font-semibold">Schedule:</span> Every {selectedRecurringOrder.day_of_week}</p>
                                        <p><span className="font-semibold">Expected:</span> ₱{(selectedRecurringOrder.product?.price * selectedRecurringOrder.quantity).toFixed(2)}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── Rider ── */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                                Rider <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={riderId}
                                onChange={(e) => setRiderId(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">— Select a rider —</option>
                                {riders.map((r) => (
                                    <option key={r.user_id} value={r.user_id}>
                                        {r.last_name}, {r.first_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ── Scheduled Date ── */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                                Scheduled Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduled(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* ── Notes ── */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional notes"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}
                    </div>
                )}

                {/* ── footer ── */}
                <div className="flex justify-end gap-2 mt-6">
                    <CloseButton label="Cancel" onClose={onClose} />
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        {loading ? "Assigning…" : "Assign Rider"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AssignDeliveryModal;