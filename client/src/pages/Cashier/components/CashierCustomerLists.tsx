import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface CashierCustomerListProps {
    onView: () => void;
    onAddRecurring: () => void;
}

const customers = [
    {
        customer_id: 1,
        full_name: "Dela Cruz, Juan M.",
        username: "jdelacruz",
        gender: "Male",
        birth_date: "1990-01-15",
        age: 36,
        jug_debt: 3,
        has_recurring: true,
    },
    {
        customer_id: 2,
        full_name: "Santos, Maria L.",
        username: "msantos",
        gender: "Female",
        birth_date: "1995-03-22",
        age: 31,
        jug_debt: 0,
        has_recurring: false,
    },
    {
        customer_id: 3,
        full_name: "Reyes, Carlo B.",
        username: "creyes",
        gender: "Male",
        birth_date: "1988-07-08",
        age: 37,
        jug_debt: 1,
        has_recurring: true,
    },
    {
        customer_id: 4,
        full_name: "Garcia, Ana P.",
        username: "agarcia",
        gender: "Female",
        birth_date: "2000-11-30",
        age: 25,
        jug_debt: 0,
        has_recurring: false,
    },
];

const CashierCustomerList: FC<CashierCustomerListProps> = ({ onView, onAddRecurring }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                No.
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Full Name
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Username
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Gender
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Birth Date
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Age
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Jug Debt
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Standing Order
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {customers.map((customer, index) => (
                            <TableRow className="hover:bg-gray-50" key={index}>
                                <TableCell className="px-4 py-3 text-center">
                                    {customer.customer_id}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {customer.full_name}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {customer.username}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {customer.gender}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {customer.birth_date}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {customer.age}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {customer.jug_debt > 0 ? (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                            {customer.jug_debt} jug{customer.jug_debt !== 1 ? "s" : ""}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            None
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {customer.has_recurring ? (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                                            None
                                        </span>
                                    )}
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
                                            onClick={onAddRecurring}
                                            className="text-green-600 hover:underline font-medium"
                                        >
                                            Set Recurring
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

export default CashierCustomerList;