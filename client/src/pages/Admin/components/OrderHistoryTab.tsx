import { useCallback, useMemo, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import LazyTableViewport from "../../../components/Table/LazyTableViewport";
import { useLazyPaginatedList } from "../../../hooks/useLazyPaginatedList";
import type { Order } from "../../../interfaces/OrderInterfaces";
import OrderService from "../../../services/OrderServices";

type FilterType = "today" | "yesterday" | "this_week" | "this_month" | "custom";

interface OrderHistoryTabProps {
    category?: "walkin" | "delivery" | "recurring";
    onView: (orderId: number) => void;
    onViewReceipt?: (orderId: number) => void;
}

const getStatusDisplay = (status: string, orderType?: string) => {
    if (status === "delivered" && orderType === "walkin") {
        return { label: "Completed", className: "bg-green-100 text-green-700" };
    }
    const map: Record<string, { label: string; className: string }> = {
        delivered:  { label: "Delivered",  className: "bg-green-100 text-green-700" },
        cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-700" },
    };
    return map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
};

const orderTypeConfig: Record<string, { label: string; className: string }> = {
    walkin:   { label: "Walk-in",  className: "bg-cyan-100 text-cyan-700" },
    delivery: { label: "Delivery", className: "bg-blue-100 text-blue-700" },
};

const filterLabels: Record<FilterType, string> = {
    today:      "Today",
    yesterday:  "Yesterday",
    this_week:  "This Week",
    this_month: "This Month",
    custom:     "Custom",
};

const OrderHistoryTab: FC<OrderHistoryTabProps> = ({ category, onView, onViewReceipt }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("today");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo]     = useState("");

    const getDateParams = () => {
        const today = new Date();
        const fmt = (d: Date) => d.toISOString().split("T")[0];

        switch (activeFilter) {
            case "today":
                return { date_from: fmt(today), date_to: fmt(today) };
            case "yesterday": {
                const y = new Date(today);
                y.setDate(today.getDate() - 1);
                return { date_from: fmt(y), date_to: fmt(y) };
            }
            case "this_week": {
                const start = new Date(today);
                start.setDate(today.getDate() - today.getDay());
                return { date_from: fmt(start), date_to: fmt(today) };
            }
            case "this_month": {
                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                return { date_from: fmt(start), date_to: fmt(today) };
            }
            case "custom":
                return { date_from: customFrom, date_to: customTo };
        }
    };

    const dateParams = useMemo(() => getDateParams(), [activeFilter, customFrom, customTo]);

    const fetchPage = useCallback(async (page: number) => {
        const res = await OrderService.loadOrders({
            page,
            category,
            status: "delivered,cancelled",
            ...dateParams,
        });
        return {
            data: res.orders.data,
            current_page: res.orders.current_page,
            last_page: res.orders.last_page,
        };
    }, [category, dateParams]);

    const {
        items: orders,
        scrollRef,
        sentinelRef,
        viewportRef,
        initialLoading,
        loadingMore,
    } = useLazyPaginatedList<Order>({
        fetchPage,
        resetKey: `${category}-${activeFilter}-${customFrom}-${customTo}`,
    });

    const getProductSummary = (order: Order) => {
        if (!order.order_items || order.order_items.length === 0) return "—";
        return order.order_items
            .map(item => `${item.product?.name ?? "Product"} x${item.quantity}`)
            .join(", ");
    };

    const totalRevenue = orders
        .filter(o => o.status === "delivered")
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const walkinRevenue = orders
        .filter(o => o.status === "delivered" && o.order_type === "walkin")
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const deliveryRevenue = orders
        .filter(o => o.status === "delivered" && o.order_type === "delivery")
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

    return (
        <div className="space-y-3">

            {/* Revenue Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-xl font-bold text-blue-600">{orders.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Revenue</p>
                    <p className="text-sm font-bold text-green-600">₱ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-cyan-50 rounded-xl border border-cyan-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Walk-in Revenue</p>
                    <p className="text-sm font-bold text-cyan-600">₱ {walkinRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-purple-50 rounded-xl border border-purple-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Delivery Revenue</p>
                    <p className="text-sm font-bold text-purple-600">₱ {deliveryRevenue.toFixed(2)}</p>
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
                    <span className="ml-auto text-xs text-gray-400">
                        {orders.length} result{orders.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <LazyTableViewport
                    viewportRef={viewportRef}
                    scrollRef={scrollRef}
                    sentinelRef={sentinelRef}
                    initialLoading={initialLoading}
                    loadingMore={loadingMore}
                    isEmpty={!initialLoading && orders.length === 0}
                    emptyMessage="No orders found for this period."
                >
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">Customer</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">Product</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Type</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Total (₱)</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Payment</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Date</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                                {orders.map((order, index) => {
                                    const status = getStatusDisplay(order.status, order.order_type);
                                    const type   = orderTypeConfig[order.order_type];
                                    return (
                                        <TableRow className="hover:bg-gray-50" key={order.order_id}>
                                            <TableCell className="px-4 py-3 text-center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                {order.processed_by_user
                                                    ? `${order.processed_by_user.last_name}, ${order.processed_by_user.first_name}`
                                                    : "Walk-in"}
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
                                            <TableCell className="px-4 py-3 text-center text-xs capitalize">
                                                {order.payment_method}
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
                                                    day:   "numeric",
                                                    hour:  "2-digit",
                                                    minute:"2-digit",
                                                })}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => onView(order.order_id)}
                                                        className="text-blue-600 hover:underline font-medium"
                                                    >
                                                        View
                                                    </button>
                                                    {order.status === "delivered" && onViewReceipt && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onViewReceipt(order.order_id)}
                                                            className="text-green-600 hover:underline text-xs font-medium"
                                                        >
                                                            Receipt
                                                        </button>
                                                    )}
                                                </div>
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

export default OrderHistoryTab;