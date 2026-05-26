import { useEffect, useState } from "react";
import { Table } from "lucide-react";
import type { LostItemReport } from "../RiderLostItemMainPage";
import { TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import LostItemService from "../../../services/LostItemService";

interface LostItemListProps {
    refreshKey: number;
}

const itemTypeBadge: Record<string, string> = {
    gallon: "bg-blue-100 text-blue-700",
    cap: "bg-yellow-100 text-yellow-700",
    seal: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-600",
};

const statusBadge = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-green-100 text-green-700",
};

const LostItemList = ({ refreshKey }: LostItemListProps) => {
    const [reports, setReports] = useState<LostItemReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await LostItemService.loadReports();
                setReports(data);
            } catch {
                setError("Could not load reports.");
                setReports([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [refreshKey]);

    if (loading) {
        return <p className="text-sm text-gray-400 text-center py-12">Loading reports…</p>;
    }

    if (error) {
        return <p className="text-sm text-red-500 text-center py-12">{error}</p>;
    }

    return (
        <>
            {reports.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="text-sm text-gray-400">No reports submitted yet.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
                                        Item Description
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                        Type
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                        Qty
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                        Notes
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                        Reported At
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                                {reports.map((report, index) => (
                                    <TableRow className="hover:bg-gray-50" key={report.report_id}>
                                        <TableCell className="px-4 py-3 text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <p className="font-medium text-gray-800">{report.customer_name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {report.delivery_address}
                                            </p>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {report.item_description}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${itemTypeBadge[report.item_type]}`}
                                            >
                                                {report.item_type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {report.quantity}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start text-xs text-gray-400 max-w-xs">
                                            {report.notes || "—"}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center text-xs">
                                            {report.reported_at}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge[report.status]}`}
                                            >
                                                {report.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    );
};

export default LostItemList;
