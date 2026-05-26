import { useState, useEffect, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import type { RecurringOrder } from "../../../interfaces/RecurringInterfaces";
import RecurringService from "../../../services/RecurringService";

interface RecurringOrderListProps {
    onView: (order: RecurringOrder) => void;
}

const RecurringOrderList: FC<RecurringOrderListProps> = ({ onView }) => {
    const [orders, setOrders]     = useState<RecurringOrder[]>([]);
    const [loading, setLoading]   = useState(false);
    const [page, setPage]         = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await RecurringService.loadRecurring({ page });
            setOrders(res.recurring.data);
            setLastPage(res.recurring.last_page);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (order: RecurringOrder) => {
        try {
            await RecurringService.toggleActive(order.recurring_order_id);
            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (order: RecurringOrder) => {
        if (!confirm("Delete this recurring order?")) return;
        try {
            await RecurringService.destroyRecurring(order.recurring_order_id);
            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                    All Standing / Recurring Orders
                </h2>
                <span className="text-xs text-gray-400">
                    Auto-generated every scheduled day at 6AM
                </span>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Product</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Qty</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Day</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Delivery Address</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Notes</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {loading ? (
                            <TableRow>
                                <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={8}>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={8}>
                                    No recurring orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order, index) => (
                                <TableRow className="hover:bg-gray-50" key={order.recurring_order_id}>
                                    <TableCell className="px-4 py-3 text-center">
                                        {(page - 1) * 15 + index + 1}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        {order.product?.name ?? "—"}
                                        <span className="text-xs text-gray-400 ml-1">
                                            ({order.product?.size ?? ""})
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        {order.quantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">
                                            {order.day_of_week}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-xs">
                                        {order.delivery_address ?? "—"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-xs">
                                        {order.notes ?? "—"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            order.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                            {order.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                type="button"
                                                onClick={() => onView(order)}
                                                className="text-blue-600 hover:underline font-medium text-xs"
                                            >
                                                View
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(order)}
                                                className={`hover:underline font-medium text-xs ${
                                                    order.is_active
                                                        ? "text-yellow-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                {order.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(order)}
                                                className="text-red-600 hover:underline font-medium text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {lastPage > 1 && (
                <div className="flex justify-end items-center gap-2 p-4 text-sm">
                    <button
                        type="button"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-500">Page {page} of {lastPage}</span>
                    <button
                        type="button"
                        onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                        disabled={page === lastPage}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecurringOrderList;