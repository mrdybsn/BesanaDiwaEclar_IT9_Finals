import { type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface RecurringOrderListProps {
    onView: () => void;
}

const recurringOrders = [
    {
        recurring_id: 1,
        customer_name: "Dela Cruz, Juan M.",
        product: "5gal Exchange",
        quantity: 2,
        day_of_week: "Monday",
        delivery_address: "123 Rizal St., Roxas City",
        is_active: true,
        notes: "Leave at gate if not home.",
    },
    {
        recurring_id: 2,
        customer_name: "Reyes, Carlo B.",
        product: "5gal Exchange",
        quantity: 3,
        day_of_week: "Friday",
        delivery_address: "45 Mabini Ave., Roxas City",
        is_active: true,
        notes: "",
    },
    {
        recurring_id: 3,
        customer_name: "Santos, Maria L.",
        product: "1L bottle",
        quantity: 6,
        day_of_week: "Wednesday",
        delivery_address: "78 Bonifacio St., Roxas City",
        is_active: false,
        notes: "On hold.",
    },
];

const RecurringOrderList: FC<RecurringOrderListProps> = ({ onView }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                    Standing / Recurring Orders
                </h2>
                <span className="text-xs text-gray-400">
                    Auto-generated every scheduled day at 6AM
                </span>
            </div>
            <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
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
                                Qty
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Day
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Delivery Address
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
                        {recurringOrders.map((order, index) => (
                            <TableRow className="hover:bg-gray-50" key={index}>
                                <TableCell className="px-4 py-3 text-center">
                                    {order.recurring_id}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {order.customer_name}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {order.product}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {order.quantity}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                        {order.day_of_week}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start text-xs">
                                    {order.delivery_address}
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
                                            className={`hover:underline font-medium ${
                                                order.is_active
                                                    ? "text-red-500"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {order.is_active ? "Deactivate" : "Activate"}
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RecurringOrderList;