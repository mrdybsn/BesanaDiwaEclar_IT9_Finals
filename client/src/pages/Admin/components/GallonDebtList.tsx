import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface GallonDebtListProps {
    onResolve: () => void;
    onView: () => void;
    onNotify: () => void;
}

const debts = [
    {
        debt_id: 1,
        customer_name: "Dela Cruz, Juan M.",
        gallons_borrowed: 5,
        gallons_returned: 2,
        gallons_owed: 3,
        notes: "Borrowed last Monday delivery.",
    },
    {
        debt_id: 2,
        customer_name: "Santos, Maria L.",
        gallons_borrowed: 3,
        gallons_returned: 3,
        gallons_owed: 0,
        notes: "Fully returned.",
    },
    {
        debt_id: 3,
        customer_name: "Reyes, Carlo B.",
        gallons_borrowed: 8,
        gallons_returned: 4,
        gallons_owed: 4,
        notes: "Promised to return Friday.",
    },
    {
        debt_id: 4,
        customer_name: "Garcia, Ana P.",
        gallons_borrowed: 2,
        gallons_returned: 0,
        gallons_owed: 2,
        notes: "",
    },
];

const GallonDebtList: FC<GallonDebtListProps> = ({ onResolve, onView, onNotify }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Customer Name</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Borrowed</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Returned</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Still Owes</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {debts.map((debt, index) => (
                            <TableRow className="hover:bg-gray-100" key={index}>
                                <TableCell className="px-4 py-3 text-center">{debt.debt_id}</TableCell>
                                <TableCell className="px-4 py-3 text-start">{debt.customer_name}</TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {debt.gallons_borrowed} jug{debt.gallons_borrowed !== 1 ? "s" : ""}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {debt.gallons_returned} jug{debt.gallons_returned !== 1 ? "s" : ""}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center font-semibold">
                                    {debt.gallons_owed > 0 ? (
                                        <span className="text-red-600">
                                            {debt.gallons_owed} jug{debt.gallons_owed !== 1 ? "s" : ""}
                                        </span>
                                    ) : (
                                        <span className="text-green-600">0</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        debt.gallons_owed === 0
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {debt.gallons_owed === 0 ? "Settled" : "With Debt"}
                                    </span>
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
                                        {debt.gallons_owed > 0 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={onNotify}
                                                    className="text-yellow-600 hover:underline font-medium"
                                                >
                                                    Notify
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onResolve}
                                                    className="text-green-600 hover:underline font-medium"
                                                >
                                                    Resolve
                                                </button>
                                            </>
                                        )}
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

export default GallonDebtList;