import { useCallback, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import LazyTableViewport from "../../../components/Table/LazyTableViewport";
import { useLazyPaginatedList } from "../../../hooks/useLazyPaginatedList";
import OrderService from "../../../services/OrderServices";
import type { Order } from "../../../interfaces/OrderInterfaces";

type OrderStatus = "pending" | "confirmed" | "out_for_delivery";

interface ActiveOrdersTabProps {
    category?: "walkin" | "delivery" | "recurring";
    onView: (orderId: number) => void;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
    pending:          { label: "Pending",          className: "bg-yellow-100 text-yellow-700" },
    confirmed:        { label: "Confirmed",         className: "bg-blue-100 text-blue-700" },
    out_for_delivery: { label: "Out for Delivery",  className: "bg-indigo-100 text-indigo-700" },
};

const orderTypeConfig: Record<string, { label: string; className: string }> = {
    walkin:   { label: "Walk-in",  className: "bg-cyan-100 text-cyan-700" },
    delivery: { label: "Delivery", className: "bg-purple-100 text-purple-700" },
};

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
    paid:    { label: "Paid",    className: "text-green-600" },
    unpaid:  { label: "Unpaid",  className: "text-red-500" },
    partial: { label: "Partial", className: "text-yellow-600" },
};

const ActiveOrdersTab: FC<ActiveOrdersTabProps> = ({ category, onView }) => {
    const [search, setSearch] = useState("");

    const fetchPage = useCallback(async (page: number) => {
        const res = await OrderService.loadOrders({
            search,
            page,
            category,
            status: "pending,confirmed,out_for_delivery",
        });
        return {
            data: res.orders.data,
            current_page: res.orders.current_page,
            last_page: res.orders.last_page,
        };
    }, [search, category]);

    const {
        items: orders,
        scrollRef,
        sentinelRef,
        viewportRef,
        initialLoading,
        loadingMore,
    } = useLazyPaginatedList<Order>({
        fetchPage,
        resetKey: `${search}-${category ?? "all"}`,
    });

    const getProductSummary = (order: Order) => {
        if (!order.order_items || order.order_items.length === 0) return "—";
        return order.order_items
            .map(item => `${item.product?.name ?? "Product"} x${item.quantity}`)
            .join(", ");
    };

    const getCustomerName = (order: Order) => {
        if (order.customer) {
            return `${order.customer.last_name}, ${order.customer.first_name}`;
        }
        return order.order_type === "walkin" ? "Walk-in" : "—";
    };

    return (
        <div className="space-y-4">

            {/* Search */}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-sm px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <LazyTableViewport
                    viewportRef={viewportRef}
                    scrollRef={scrollRef}
                    sentinelRef={sentinelRef}
                    initialLoading={initialLoading}
                    loadingMore={loadingMore}
                    isEmpty={!initialLoading && orders.length === 0}
                    emptyMessage="No active orders."
                >
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
                                    Time
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                                {orders.map((order, index) => {
                                    const status  = statusConfig[order.status as OrderStatus];
                                    const type    = orderTypeConfig[order.order_type];
                                    const payment = paymentStatusConfig[order.payment_status];
                                    return (
                                        <TableRow className="hover:bg-gray-50" key={order.order_id}>
                                            <TableCell className="px-4 py-3 text-center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                {getCustomerName(order)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start max-w-50 truncate">
                                                {getProductSummary(order)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${type.className}`}>
                                                    {type.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                ₱ {Number(order.total_amount).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="text-xs capitalize">
                                                        {order.payment_method}
                                                    </span>
                                                    <span className={`text-xs font-semibold ${payment.className}`}>
                                                        {payment.label}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                {status ? (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 capitalize">
                                                        {order.status}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center text-xs">
                                                {new Date(order.created_at).toLocaleString("en-PH", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => onView(order.order_id)}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    View
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </LazyTableViewport>
            </div>
        </div>
    );
};

export default ActiveOrdersTab;