import { useEffect } from "react";

const MOCK_JUG_DEBT = {
    gallons_borrowed: 5,
    gallons_returned: 3,
    gallons_owed: 2,
    notes: "2 jugs from last Monday delivery still pending return.",
    updated_at: new Date().toISOString(),
};

const JugStatusMainPage = () => {
    useEffect(() => {
        document.title = "My Jug Status";
    }, []);

    const { gallons_borrowed, gallons_returned, gallons_owed, notes, updated_at } =
        MOCK_JUG_DEBT;

    const isCleared = gallons_owed === 0;

    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Customer
                </p>
                <h1 className="text-2xl font-bold text-gray-800">Jug Status</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Track your borrowed gallon containers.
                </p>
            </div>

            <div className="max-w-lg space-y-4">
                {/* Main status card */}
                <div
                    className={`rounded-xl border shadow-sm p-6 text-center ${
                        isCleared
                            ? "bg-green-50 border-green-200"
                            : "bg-amber-50 border-amber-200"
                    }`}
                >
                    <span className="text-5xl">
                        {isCleared ? "✅" : "🪣"}
                    </span>
                    <p className="text-5xl font-extrabold mt-3 text-gray-900">
                        {gallons_owed}
                    </p>
                    <p
                        className={`text-sm font-semibold mt-1 ${
                            isCleared ? "text-green-700" : "text-amber-700"
                        }`}
                    >
                        {isCleared
                            ? "You're all clear — no jugs owed!"
                            : `jug${gallons_owed > 1 ? "s" : ""} to return`}
                    </p>
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                        Breakdown
                    </p>
                    <div className="space-y-3">
                        <Row label="Total borrowed"   value={gallons_borrowed} valueClass="text-gray-800" />
                        <Row label="Returned so far"  value={gallons_returned} valueClass="text-green-600" />
                        <div className="border-t border-dashed border-gray-200 pt-3">
                            <Row
                                label="Still owed"
                                value={gallons_owed}
                                valueClass={isCleared ? "text-green-600" : "text-amber-600"}
                                bold
                            />
                        </div>
                    </div>
                </div>

                {/* Staff note */}
                {notes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
                            Note from staff
                        </p>
                        <p className="text-sm text-amber-800">{notes}</p>
                    </div>
                )}

                {/* How to return */}
                {!isCleared && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                            How to Return
                        </p>
                        <div className="space-y-3">
                            {[
                                "Hand empty jugs to your rider on your next delivery.",
                                "Or bring them directly to our store in Roxas City.",
                                "Your count updates automatically after each delivery.",
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-gray-600">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-gray-300">
                    Last updated:{" "}
                    {new Date(updated_at).toLocaleDateString("en-PH", {
                        month:  "short",
                        day:    "numeric",
                        hour:   "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </>
    );
};

const Row = ({
    label,
    value,
    valueClass,
    bold,
}: {
    label: string;
    value: number;
    valueClass: string;
    bold?: boolean;
}) => (
    <div className="flex items-center justify-between">
        <span className={`text-sm ${bold ? "font-bold text-gray-800" : "text-gray-500"}`}>
            {label}
        </span>
        <span className={`text-lg font-bold ${valueClass}`}>{value}</span>
    </div>
);

export default JugStatusMainPage;