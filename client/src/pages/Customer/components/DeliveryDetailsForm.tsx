import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import type { DeliveryDetails } from "../OrderFormMainPage";

interface DeliveryDetailsFormProps {
    details: DeliveryDetails;
    onChange: (field: keyof DeliveryDetails, value: string) => void;
}

const DeliveryDetailsForm = ({ details, onChange }: DeliveryDetailsFormProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">🚚</span>
                <div>
                    <p className="text-base font-bold text-gray-800">
                        Delivery Details
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Where should we deliver your order?
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Address */}
                <div className="col-span-2">
                    <FloatingLabelInput
                        label="Delivery Address"
                        type="text"
                        name="delivery_address"
                        value={details.delivery_address}
                        onChange={(e) => onChange("delivery_address", e.target.value)}
                        required
                    />
                </div>

                {/* Contact + Payment */}
                <div>
                    <FloatingLabelInput
                        label="Contact Number"
                        type="text"
                        name="contact_number"
                        value={details.contact_number}
                        onChange={(e) => onChange("contact_number", e.target.value)}
                        required
                    />
                </div>
                <div>
                    <FloatingLabelSelect
                        label="Payment Method"
                        name="payment_method"
                        value={details.payment_method}
                        onChange={(e) => onChange("payment_method", e.target.value)}
                        required
                    >
                        <option value="cash">Cash on Delivery</option>
                        <option value="gcash">GCash</option>
                        <option value="maya">Maya</option>
                    </FloatingLabelSelect>
                </div>

                {/* Delivery Type Toggle */}
                <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                        Delivery Schedule
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onChange("delivery_type", "one_time");
                                onChange("preferred_day", "");
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                details.delivery_type === "one_time"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                            }`}
                        >
                            <span className="text-base">📅</span>
                            <div className="text-left">
                                <p className="leading-tight">One-time Delivery</p>
                                <p className="text-xs font-normal opacity-70 leading-tight mt-0.5">
                                    Pick a specific date
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onChange("delivery_type", "recurring");
                                onChange("preferred_date", "");
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                details.delivery_type === "recurring"
                                    ? "border-amber-500 bg-amber-50 text-amber-700"
                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                            }`}
                        >
                            <span className="text-base">🔁</span>
                            <div className="text-left">
                                <p className="leading-tight">Standing Order</p>
                                <p className="text-xs font-normal opacity-70 leading-tight mt-0.5">
                                    Weekly recurring
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* One-time: date picker */}
                {details.delivery_type === "one_time" && (
                    <div className="col-span-2">
                        <FloatingLabelInput
                            label="Preferred Delivery Date"
                            type="date"
                            name="preferred_date"
                            value={details.preferred_date}
                            onChange={(e) => onChange("preferred_date", e.target.value)}
                            required
                        />
                    </div>
                )}

                {/* Recurring: day picker + info banner */}
                {details.delivery_type === "recurring" && (
                    <div className="col-span-2 space-y-3">
                        <FloatingLabelSelect
                            label="Preferred Delivery Day"
                            name="preferred_day"
                            value={details.preferred_day}
                            onChange={(e) => onChange("preferred_day", e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a day…</option>
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                        </FloatingLabelSelect>

                        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                            <span className="text-base mt-0.5 shrink-0">ℹ️</span>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Standing orders are delivered every week on your chosen day.
                                Staff will review and confirm your schedule — you'll be notified
                                once it's active.
                            </p>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className="col-span-2">
                    <FloatingLabelInput
                        label="Notes (optional — e.g. gate instructions)"
                        type="text"
                        name="notes"
                        value={details.notes}
                        onChange={(e) => onChange("notes", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetailsForm;