import { useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

type FilterType = "today" | "yesterday" | "this_week" | "this_month" | "custom";
type RemittanceStatus = "pending" | "verified" | "discrepancy";

interface RemittanceListProps {
    onVerify: () => void;
    onView: () => void;
}

const remittances = [
    {
        remittance_id: 1,
        rider_name: "Reyes, Carlo B.",
        delivery_id: 1,
        date: "2026-05-16",
        collected_amount: 1240.00,
        remitted_amount: 1240.00,
        status: "verified" as RemittanceStatus,
        notes: "",
    },
    {
        remittance_id: 2,
        rider_name: "Santos, Mark A.",
        delivery_id: 2,
        date: "2026-05-16",
        collected_amount: 680.00,
        remitted_amount: 650.00,
        status: "discrepancy" as RemittanceStatus,
        notes: "Short by ₱30.00. Under review.",
    },
    {
        remittance_id: 3,
        rider_name: "Dela Cruz, Jun R.",
        delivery_id: 3,
        date: "2026-05-15",
        collected_amount: 920.00,
        remitted_amount: 920.00,
        status: "verified" as RemittanceStatus,
        notes: "",
    },
    {
        remittance_id: 4,
        rider_name: "Garcia, Pedro M.",
        delivery_id: 4,
        date: "2026-05-12",
        collected_amount: 750.00,
        remitted_amount: 0,
        status: "pending" as RemittanceStatus,
        notes: "Awaiting rider submission.",
    },
    {
        remittance_id: 5,
        rider_name: "Reyes, Carlo B.",
        delivery_id: 5,
        date: "2026-05-10",
        collected_amount: 1100.00,
        remitted_amount: 1100.00,
        status: "verified" as RemittanceStatus,
        notes: "",
    },
    {
        remittance_id: 6,
        rider_name: "Santos, Mark A.",
        delivery_id: 6,
        date: "2026-04-28",
        collected_amount: 480.00,
        remitted_amount: 480.00,
        status: "verified" as RemittanceStatus,
        notes: "",
    },
];

const statusConfig: Record<RemittanceStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    verified: { label: "Verified", className: "bg-green-100 text-green-700" },
    discrepancy: { label: "Discrepancy", className: "bg-red-100 text-red-700" },
};

const filterLabels: Record<FilterType, string> = {
    today: "Today",
    yesterday: "Yesterday",
    this_week: "This Week",
    this_month: "This Month",
    custom: "Custom",
};

const RemittanceList: FC<RemittanceListProps> = ({ onVerify, onView }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("today");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const toDateOnly = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    const getFiltered = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        return remittances.filter((r) => {
            const date = toDateOnly(r.date);
            switch (activeFilter) {
                case "today":
                    return date.getTime() === today.getTime();
                case "yesterday":
                    return date.getTime() === yesterday.getTime();
                case "this_week":
                    return date >= weekStart && date <= today;
                case "this_month":
                    return date >= monthStart && date <= today;
                case "custom": {
                    if (!customFrom || !customTo) return true;
                    const from = toDateOnly(customFrom);
                    const to = toDateOnly(customTo);
                    return date >= from && date <= to;
                }
                default:
                    return true;
            }
        });
    };

    const filtered = getFiltered();

    const totalCollected = filtered.reduce((sum, r) => sum + r.collected_amount, 0);
    const totalRemitted = filtered.reduce((sum, r) => sum + r.remitted_amount, 0);
    const totalDiscrepancy = totalCollected - totalRemitted;

    return (
        <div className="space-y-4">

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Collected</p>
                    <p className="text-lg font-bold text-blue-600">
                        ₱ {totalCollected.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Remitted</p>
                    <p className="text-lg font-bold text-green-600">
                        ₱ {totalRemitted.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className={`rounded-lg border p-4 text-center ${
                    totalDiscrepancy > 0
                        ? "bg-red-50 border-red-100"
                        : "bg-gray-50 border-gray-100"
                }`}>
                    <p className="text-xs text-gray-500">Discrepancy</p>
                    <p className={`text-lg font-bold ${
                        totalDiscrepancy > 0 ? "text-red-600" : "text-gray-500"
                    }`}>
                        ₱ {totalDiscrepancy.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Table Card */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">

                {/* Filter Bar */}
                <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 mr-2">
                        Remittance History:
                    </span>

                    {(["today", "yesterday", "this_week", "this_month", "custom"] as FilterType[]).map(
                        (filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    activeFilter === filter
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {filterLabels[filter]}
                            </button>
                        )
                    )}

                    {/* Custom Date Range */}
                    {activeFilter === "custom" && (
                        <div className="flex items-center gap-2 ml-2">
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-400">to</span>
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    <span className="ml-auto text-xs text-gray-400">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Table */}
                <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    No.
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                    Rider
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Delivery ID
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Date
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Collected (₱)
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Remitted (₱)
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={8}>
                                        No remittances found for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((remittance, index) => {
                                    const status = statusConfig[remittance.status];
                                    return (
                                        <TableRow className="hover:bg-gray-100" key={index}>
                                            <TableCell className="px-4 py-3 text-center">
                                                {remittance.remittance_id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                {remittance.rider_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                #{remittance.delivery_id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                {remittance.date}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                ₱ {remittance.collected_amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                ₱ {remittance.remitted_amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <div className="flex gap-4 justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={onView}
                                                        className="text-blue-600 hover:underline font-medium"
                                                    >
                                                        View
                                                    </button>
                                                    {remittance.status === "pending" && (
                                                        <button
                                                            type="button"
                                                            onClick={onVerify}
                                                            className="text-green-600 hover:underline font-medium"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                    {remittance.status === "discrepancy" && (
                                                        <button
                                                            type="button"
                                                            onClick={onVerify}
                                                            className="text-red-600 hover:underline font-medium"
                                                        >
                                                            Resolve
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default RemittanceList;