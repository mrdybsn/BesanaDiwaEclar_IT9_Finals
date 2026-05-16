import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface CustomerListProps {
    onEdit: () => void;
    onDelete: () => void;
}

const CustomerList: FC<CustomerListProps> = ({ onEdit, onDelete }) => {
    const customers = [
        {
            customer_id: 1,
            full_name: "Dela Cruz, Juan M.",
            username: "jdelacruz",
            gender: "Male",
            birth_date: "1990-01-15",
            age: 35,
        },
        {
            customer_id: 2,
            full_name: "Santos, Maria L.",
            username: "msantos",
            gender: "Female",
            birth_date: "1995-03-22",
            age: 30,
        },
        {
            customer_id: 3,
            full_name: "Reyes, Carlo B.",
            username: "creyes",
            gender: "Male",
            birth_date: "1988-07-08",
            age: 36,
        },
    ];

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
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
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {customers.map((customer, index) => (
                            <TableRow className="hover:bg-gray-100" key={index}>
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
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            type="button"
                                            onClick={onEdit}
                                            className="text-green-600 hover:underline font-medium"
                                        >
                                            Edit
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
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CustomerList;