import { useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

type FilterType = "today" | "yesterday" | "this_week" | "this_month" | "custom";

interface DeliveryListProps {
    onView: () => void;
    onDelete: () => void;
}

const deliveries = [
    {
        delivery_id: 1,
        rider_name: "Reyes, Carlo B.",
        scheduled_date: "2026-05-16",
        order_count: 8,
        status: "completed",
        expected_amount: 1240.00,
        collected_amount: 1240.00,
    },
    {
        delivery_id: 2,
        rider_name: "Santos, Mark A.",
        scheduled_date: "2026-05-16",
        order_count: 4,
        status: "ongoing",
        expected_amount: 680.00,
        collected_amount: 340.00,
    },
    {
        delivery_id: 3,
        rider_name: "Dela Cruz, Jun R.",
        scheduled_date: "2026-05-15",
        order_count: 6,
        status: "completed",
        expected_amount: 920.00,
        collected_amount: 920.00,
    },
    {
        delivery_id: 4,
        rider_name: "Garcia, Pedro M.",
        scheduled_date: "2026-05-12",
        order_count: 5,
        status: "completed",
        expected_amount: 750.00,
        collected_amount: 750.00,
    },
    {
        delivery_id: 5,
        rider_name: "Reyes, Carlo B.",
        scheduled_date: "2026-05-10",
        order_count: 7,
        status: "completed",
        expected_amount: 1100.00,
        collected_amount: 1100.00,
    },
    {
        delivery_id: 6,
        rider_name: "Santos, Mark A.",
        scheduled_date: "2026-04-28",
        order_count: 3,
        status: "completed",
        expected_amount: 480.00,
        collected_amount: 480.00,
    },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    ongoing: { label: "Ongoing", className: "bg-blue-100 text-blue-700" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
};

const filterLabels: Record<FilterType, string> = {
    today: "Today",
    yesterday: "Yesterday",
    this_week: "This Week",
    this_month: "This Month",
    custom: "Custom",
};

const DeliveryList: FC<DeliveryListProps> = ({ onView, onDelete }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("today");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const toDateOnly = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    const getFilteredDeliveries = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        return deliveries.filter((d) => {
            const date = toDateOnly(d.scheduled_date);

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

    const filtered = getFilteredDeliveries();

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">

            {/* Filter Bar */}
            <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 mr-2">
                    Delivery History:
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

                {/* Result Count */}
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
                                Scheduled Date
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Orders
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Expected (₱)
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Collected (₱)
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
                                    No deliveries found for this period.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((delivery, index) => {
                                const status = statusConfig[delivery.status];
                                return (
                                    <TableRow className="hover:bg-gray-100" key={index}>
                                        <TableCell className="px-4 py-3 text-center">
                                            {delivery.delivery_id}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {delivery.rider_name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {delivery.scheduled_date}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {delivery.order_count}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            ₱ {delivery.expected_amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            ₱ {delivery.collected_amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
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
                                                <button
                                                    type="button"
                                                    onClick={onDelete}
                                                    className="text-red-600 hover:underline font-medium"
                                                >
                                                    Delete
                                                </button>
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
    );
};

export default DeliveryList;