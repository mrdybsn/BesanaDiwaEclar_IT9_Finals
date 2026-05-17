import { useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

type FilterType = "today" | "yesterday" | "this_week" | "this_month" | "custom";

interface OrderHistoryTabProps {
    onView: () => void;
}

const historyOrders = [
    {
        order_id: 5,
        customer_name: "Dela Cruz, Juan M.",
        order_type: "walkin",
        product: "500ml bottle x4",
        total_amount: 40.00,
        payment_method: "Cash",
        payment_status: "paid",
        status: "completed",
        created_at: "2026-05-16 07:30",
    },
    {
        order_id: 6,
        customer_name: "Reyes, Carlo B.",
        order_type: "delivery",
        product: "5gal Exchange x1",
        total_amount: 35.00,
        payment_method: "GCash",
        payment_status: "paid",
        status: "completed",
        created_at: "2026-05-16 07:00",
    },
    {
        order_id: 7,
        customer_name: "Santos, Maria L.",
        order_type: "delivery",
        product: "5gal New Container x2",
        total_amount: 370.00,
        payment_method: "Cash",
        payment_status: "paid",
        status: "completed",
        created_at: "2026-05-15 14:00",
    },
    {
        order_id: 8,
        customer_name: "Garcia, Ana P.",
        order_type: "walkin",
        product: "1L bottle x3",
        total_amount: 45.00,
        payment_method: "Maya",
        payment_status: "paid",
        status: "cancelled",
        created_at: "2026-05-15 11:20",
    },
    {
        order_id: 9,
        customer_name: "Reyes, Carlo B.",
        order_type: "delivery",
        product: "5gal Exchange x2",
        total_amount: 70.00,
        payment_method: "Cash",
        payment_status: "paid",
        status: "completed",
        created_at: "2026-05-12 09:00",
    },
    {
        order_id: 10,
        customer_name: "Dela Cruz, Juan M.",
        order_type: "walkin",
        product: "500ml bottle x2",
        total_amount: 20.00,
        payment_method: "Cash",
        payment_status: "paid",
        status: "completed",
        created_at: "2026-04-28 10:15",
    },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

const orderTypeConfig: Record<string, { label: string; className: string }> = {
    walkin: { label: "Walk-in", className: "bg-cyan-100 text-cyan-700" },
    delivery: { label: "Delivery", className: "bg-purple-100 text-purple-700" },
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
    const totalRevenue = filtered
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total_amount, 0);

    return (
        <div className="space-y-3">

            {/* Revenue Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-xl font-bold text-blue-600">{filtered.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-xl font-bold text-green-600">
                        {filtered.filter((o) => o.status === "completed").length}
                    </p>
                </div>
                <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-lg font-bold text-indigo-600">
                        ₱ {totalRevenue.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* Filter Bar */}
                <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 mr-2">
                        History:
                    </span>
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
                    <span className="ml-auto text-xs text-gray-400">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    No.
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                    Customer
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                    Product
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Type
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Total (₱)
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Payment
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Date
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={9}>
                                        No orders found for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((order, index) => {
                                    const status = statusConfig[order.status];
                                    const type = orderTypeConfig[order.order_type];
                                    return (
                                        <TableRow className="hover:bg-gray-50" key={index}>
                                            <TableCell className="px-4 py-3 text-center">
                                                {order.order_id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                {order.customer_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                {order.product}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${type.className}`}>
                                                    {type.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                ₱ {order.total_amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="text-xs">{order.payment_method}</span>
                                                    <span className="text-xs font-semibold text-green-600">
                                                        Paid
                                                    </span>
                                                </div>
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