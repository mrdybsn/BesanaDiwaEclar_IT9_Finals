import { useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

type FilterType = "today" | "yesterday" | "this_week" | "this_month" | "custom";
type OrderSource = "online" | "cashier" | "admin";

interface OrderHistoryTabProps {
    onView: () => void;
}

const historyOrders = [
    {
        order_id: 6,
        customer_name: "Dela Cruz, Juan M.",
        order_type: "walkin",
        source: "cashier" as OrderSource,
        product: "500ml bottle x4",
        total_amount: 40.00,
        payment_method: "Cash",
        status: "completed",
        created_at: "2026-05-16 07:30",
    },
    {
        order_id: 7,
        customer_name: "Reyes, Carlo B.",
        order_type: "delivery",
        source: "online" as OrderSource,
        product: "5gal Exchange x1",
        total_amount: 35.00,
        payment_method: "GCash",
        status: "completed",
        created_at: "2026-05-16 07:00",
    },
    {
        order_id: 8,
        customer_name: "Santos, Maria L.",
        order_type: "delivery",
        source: "online" as OrderSource,
        product: "5gal New Container x2",
        total_amount: 370.00,
        payment_method: "Maya",
        status: "completed",
        created_at: "2026-05-15 14:00",
    },
    {
        order_id: 9,
        customer_name: "Walk-in Customer",
        order_type: "walkin",
        source: "admin" as OrderSource,
        product: "1L bottle x5",
        total_amount: 75.00,
        payment_method: "Cash",
        status: "completed",
        created_at: "2026-05-15 11:20",
    },
    {
        order_id: 10,
        customer_name: "Garcia, Ana P.",
        order_type: "delivery",
        source: "online" as OrderSource,
        product: "5gal Exchange x2",
        total_amount: 70.00,
        payment_method: "GCash",
        status: "cancelled",
        created_at: "2026-05-12 09:00",
    },
    {
        order_id: 11,
        customer_name: "Dela Cruz, Juan M.",
        order_type: "walkin",
        source: "cashier" as OrderSource,
        product: "500ml bottle x2",
        total_amount: 20.00,
        payment_method: "Cash",
        status: "completed",
        created_at: "2026-04-28 10:15",
    },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const sourceConfig: Record<OrderSource, { label: string; className: string }> = {
    online: { label: "Online", className: "bg-green-100 text-green-700" },
    cashier: { label: "Cashier", className: "bg-orange-100 text-orange-700" },
    admin: { label: "Admin POS", className: "bg-purple-100 text-purple-700" },
};

const orderTypeConfig: Record<string, { label: string; className: string }> = {
    walkin: { label: "Walk-in", className: "bg-cyan-100 text-cyan-700" },
    delivery: { label: "Delivery", className: "bg-blue-100 text-blue-700" },
};

const filterLabels: Record<FilterType, string> = {
    today: "Today",
    yesterday: "Yesterday",
    this_week: "This Week",
    this_month: "This Month",
    custom: "Custom",
};

const OrderHistoryTab: FC<OrderHistoryTabProps> = ({ onView }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("today");
    const [sourceFilter, setSourceFilter] = useState<"all" | OrderSource>("all");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const toDateOnly = (dateStr: string) => {
        const [datePart] = dateStr.split(" ");
        const [y, m, d] = datePart.split("-").map(Number);
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

        return historyOrders.filter((o) => {
            const date = toDateOnly(o.created_at);
            let dateMatch = false;
            switch (activeFilter) {
                case "today": dateMatch = date.getTime() === today.getTime(); break;
                case "yesterday": dateMatch = date.getTime() === yesterday.getTime(); break;
                case "this_week": dateMatch = date >= weekStart && date <= today; break;
                case "this_month": dateMatch = date >= monthStart && date <= today; break;
                case "custom":
                    if (!customFrom || !customTo) { dateMatch = true; break; }
                    dateMatch = date >= toDateOnly(customFrom) && date <= toDateOnly(customTo);
                    break;
            }
            const sourceMatch = sourceFilter === "all" || o.source === sourceFilter;
            return dateMatch && sourceMatch;
        });
    };

    const filtered = getFiltered();
    const totalRevenue = filtered
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total_amount, 0);
    const onlineRevenue = filtered
        .filter((o) => o.status === "completed" && o.source === "online")
        .reduce((sum, o) => sum + o.total_amount, 0);
    const posRevenue = filtered
        .filter((o) => o.status === "completed" && (o.source === "cashier" || o.source === "admin"))
        .reduce((sum, o) => sum + o.total_amount, 0);

    return (
        <div className="space-y-3">

            {/* Revenue Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-xl font-bold text-blue-600">{filtered.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Revenue</p>
                    <p className="text-sm font-bold text-green-600">₱ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Online Revenue</p>
                    <p className="text-sm font-bold text-indigo-600">₱ {onlineRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 text-center">
                    <p className="text-xs text-gray-500">POS Revenue</p>
                    <p className="text-sm font-bold text-orange-600">₱ {posRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* Filter Bar */}
                <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 mr-2">Period:</span>
                    {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
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
                    ))}
                    {activeFilter === "custom" && (
                        <div className="flex items-center gap-2 ml-2">
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-400">to</span>
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Source Filter */}
                    <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-gray-500 font-medium">Source:</span>
                        {(["all", "online", "cashier", "admin"] as const).map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setSourceFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    sourceFilter === s
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {s === "all" ? "All" : s === "admin" ? "Admin POS" : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>

                    <span className="ml-auto text-xs text-gray-400">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">Customer</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">Product</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Source</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Type</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Total (₱)</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Payment</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Date</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={10}>
                                        No orders found for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((order, index) => {
                                    const status = statusConfig[order.status];
                                    const source = sourceConfig[order.source];
                                    const type = orderTypeConfig[order.order_type];
                                    return (
                                        <TableRow className="hover:bg-gray-50" key={index}>
                                            <TableCell className="px-4 py-3 text-center">{order.order_id}</TableCell>
                                            <TableCell className="px-4 py-3 text-start">{order.customer_name}</TableCell>
                                            <TableCell className="px-4 py-3 text-start">{order.product}</TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${source.className}`}>
                                                    {source.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${type.className}`}>
                                                    {type.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                ₱ {order.total_amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center text-xs">
                                                {order.payment_method}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center text-xs">
                                                {order.created_at}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={onView}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    View
                                                </button>
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

export default OrderHistoryTab;