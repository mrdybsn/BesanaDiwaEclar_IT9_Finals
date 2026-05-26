import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import type { CustomerColumns, CustomerPagination } from "../../../interfaces/CustomerInterfaces";

const genderLabel: Record<string, string> = {
    male:              "Male",
    female:            "Female",
    prefer_not_to_say: "Prefer not to say",
};

interface CustomerListProps {
    customers:    CustomerColumns[];
    isLoading:    boolean;
    pagination:   Omit<CustomerPagination, "data"> | null;
    onEdit:       (customer: CustomerColumns) => void;
    onDelete:     (customer: CustomerColumns) => void;
    onPageChange: (page: number) => void;
}

const CustomerList: FC<CustomerListProps> = ({
    customers, isLoading, pagination, onEdit, onDelete, onPageChange,
}) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Full Name</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Username</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Contact</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Gender</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Birth Date</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Age</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {isLoading ? (
                            <TableRow>
                                <TableCell className="px-4 py-8 text-center text-blue-500" colSpan={8}>
                                    Loading customers…
                                </TableCell>
                            </TableRow>
                        ) : customers.length === 0 ? (
                            <TableRow>
                                <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={8}>
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer, index) => {
                                const fullName = `${customer.last_name}, ${customer.first_name}${
                                    customer.middle_name ? " " + customer.middle_name[0] + "." : ""
                                }${customer.suffix_name ? " " + customer.suffix_name : ""}`;

                                return (
                                    <TableRow className="hover:bg-gray-50" key={customer.customer_id}>
                                        <TableCell className="px-4 py-3 text-center">
                                            {((pagination?.current_page ?? 1) - 1) * (pagination?.per_page ?? 15) + index + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start font-medium text-gray-700">
                                            {fullName}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {customer.username ?? <span className="text-gray-300 italic">—</span>}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {customer.contact_number ?? <span className="text-gray-300 italic">—</span>}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {customer.gender ? genderLabel[customer.gender] : <span className="text-gray-300 italic">—</span>}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {customer.birth_date ?? <span className="text-gray-300 italic">—</span>}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {customer.age ?? <span className="text-gray-300 italic">—</span>}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <div className="flex gap-4 justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(customer)}
                                                    className="text-green-600 hover:underline font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(customer)}
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

            {/* ── pagination ── */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
                    <span>
                        Page {pagination.current_page} of {pagination.last_page} — {pagination.total} total
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={pagination.current_page <= 1}
                            onClick={() => onPageChange(pagination.current_page - 1)}
                            className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        <button
                            type="button"
                            disabled={pagination.current_page >= pagination.last_page}
                            onClick={() => onPageChange(pagination.current_page + 1)}
                            className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;