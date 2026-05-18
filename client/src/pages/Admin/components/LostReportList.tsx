import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface LostReportListProps {
    onView: () => void;
    onResolve: () => void;
}

const reports = [
    {
        report_id: 1,
        rider_name: "Reyes, Carlo B.",
        customer_name: "Dela Cruz, Juan M.",
        item: "5-gallon jug",
        quantity: 1,
        reason: "Cracked during delivery",
        status: "pending",
        date: "2026-05-15",
    },
    {
        report_id: 2,
        rider_name: "Santos, Mark A.",
        customer_name: "Garcia, Ana P.",
        item: "5-gallon jug",
        quantity: 2,
        reason: "Customer claims not received",
        status: "pending",
        date: "2026-05-14",
    },
    {
        report_id: 3,
        rider_name: "Dela Cruz, Jun R.",
        customer_name: "Reyes, Carlo B.",
        item: "1L bottle",
        quantity: 3,
        reason: "Bottle seal broken on arrival",
        status: "resolved",
        date: "2026-05-10",
    },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    resolved: { label: "Resolved", className: "bg-green-100 text-green-700" },
};

const LostReportList: FC<LostReportListProps> = ({ onView, onResolve }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                    Lost / Damaged Item Reports from Riders
                </h2>
                <span className="text-xs text-gray-400">
                    {reports.filter((r) => r.status === "pending").length} pending
                </span>
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Rider</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Customer</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Item</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Qty</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Reason</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Date</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {reports.map((report, index) => {
                            const status = statusConfig[report.status];
                            return (
                                <TableRow className="hover:bg-gray-100" key={index}>
                                    <TableCell className="px-4 py-3 text-center">{report.report_id}</TableCell>
                                    <TableCell className="px-4 py-3 text-start">{report.rider_name}</TableCell>
                                    <TableCell className="px-4 py-3 text-start">{report.customer_name}</TableCell>
                                    <TableCell className="px-4 py-3 text-start">{report.item}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">{report.quantity}</TableCell>
                                    <TableCell className="px-4 py-3 text-start text-xs">{report.reason}</TableCell>
                                    <TableCell className="px-4 py-3 text-center text-xs">{report.date}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                            {status.label}
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
                                            {report.status === "pending" && (
                                                <button
                                                    type="button"
                                                    onClick={onResolve}
                                                    className="text-green-600 hover:underline font-medium"
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default LostReportList;