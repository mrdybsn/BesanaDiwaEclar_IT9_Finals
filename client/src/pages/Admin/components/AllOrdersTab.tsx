import { useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

type OrderStatus = "pending" | "processing" | "out_for_delivery";
type OrderSource = "online" | "cashier" | "admin";
type FilterType = "all" | "online" | "cashier" | "admin" | "walkin" | "delivery";

interface AllOrdersTabProps {
    onView: () => void;
    onProcess: () => void;
}

const activeOrders = [
    {
        order_id: 1,
        customer_name: "Dela Cruz, Juan M.",
        order_type: "delivery",
        source: "online" as OrderSource,
        product: "5gal Exchange x2",
        total_amount: 70.00,
        payment_method: "GCash",
        payment_status: "paid",
        status: "pending" as OrderStatus,
        created_at: "2026-05-16 08:10",
    },
    {
        order_id: 2,
        customer_name: "Santos, Maria L.",
        order_type: "delivery",
        source: "online" as OrderSource,
        product: "5gal New Container x1",
        total_amount: 185.00,
        payment_method: "Maya",
        payment_status: "paid",
        status: "processing" as OrderStatus,
        created_at: "2026-05-16 08:45",
    },
    {
        order_id: 3,
        customer_name: "Reyes, Carlo B.",
        order_type: "walkin",
        source: "cashier" as OrderSource,
        product: "1L bottle x6",
        total_amount: 90.00,
        payment_method: "Cash",
        payment_status: "paid",
        status: "processing" as OrderStatus,
        created_at: "2026-05-16 09:00",
    },
    {
        order_id: 4,
        customer_name: "Garcia, Ana P.",
        order_type: "delivery",
        source: "cashier" as OrderSource,
        product: "5gal Exchange x3",
        total_amount: 105.00,
        payment_method: "Cash",
        payment_status: "pending",
        status: "out_for_delivery" as OrderStatus,
        created_at: "2026-05-16 09:15",
    },
    {
        order_id: 5,
        customer_name: "Walk-in Customer",
        order_type: "walkin",
        source: "admin" as OrderSource,
        product: "500ml bottle x10",
        total_amount: 100.00,
        payment_method: "Cash",
        payment_status: "paid",
        status: "processing" as OrderStatus,
        created_at: "2026-05-16 09:30",
    },
];

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-700" },
    out_for_delivery: { label: "Out for Delivery", className: "bg-indigo-100 text-indigo-700" },
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
    all: "All",
    online: "Online",
    cashier: "Cashier",
    admin: "Admin POS",
    walkin: "Walk-in",
    delivery: "Delivery",
};

const AllOrdersTab: FC<AllOrdersTabProps> = ({ onView, onProcess }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const filtered = activeOrders.filter((o) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "walkin") return o.order_type === "walkin";
        if (activeFilter === "delivery") return o.order_type === "delivery";
        return o.source === activeFilter;
    });

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {/* Filter Bar */}
            <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 mr-2">
                    Filter:
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
                <span className="ml-auto text-xs text-gray-400">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Table */}
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
                                Source
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
                                Time
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={10}>
                                    No active orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((order, index) => {
                                const status = statusConfig[order.status];
                                const source = sourceConfig[order.source];
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
                                        <TableCell className="px-4 py-3 text-center">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="text-xs">{order.payment_method}</span>
                                                <span className={`text-xs font-semibold ${
                                                    order.payment_status === "paid"
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                }`}>
                                                    {order.payment_status === "paid" ? "Paid" : "Unpaid"}
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
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    type="button"
                                                    onClick={onView}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onProcess}
                                                    className="text-green-600 hover:underline font-medium"
                                                >
                                                    Process
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

export default AllOrdersTab;