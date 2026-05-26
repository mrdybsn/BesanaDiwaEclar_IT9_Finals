import { useEffect, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import GallonDebtService, { type GallonDebt } from "../../../services/GallonDebtService";

interface GallonDebtListProps {
    onResolve: () => void;
    onView: () => void;
    onNotify: () => void;
    refreshKey?: boolean;
}

const GallonDebtList: FC<GallonDebtListProps> = ({ refreshKey }) => {
    const [debts, setDebts] = useState<GallonDebt[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await GallonDebtService.loadDebts({ search: search || undefined });
                setDebts(res.debts?.data ?? []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [search, refreshKey]);

    const getCustomerName = (d: GallonDebt) => {
        if (!d.customer) return "—";
        return `${d.customer.last_name}, ${d.customer.first_name}`;
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Customer</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Borrowed</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Returned</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Owed</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Notes</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-8 text-center text-blue-600">Loading…</TableCell>
                            </TableRow>
                        ) : debts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-8 text-center text-gray-400">No gallon debts recorded.</TableCell>
                            </TableRow>
                        ) : (
                            debts.map((d) => (
                                <TableRow key={d.gallon_debt_id}>
                                    <TableCell className="px-5 py-3 font-medium text-gray-800">{getCustomerName(d)}</TableCell>
                                    <TableCell className="px-5 py-3 text-center">{d.gallons_borrowed}</TableCell>
                                    <TableCell className="px-5 py-3 text-center">{d.gallons_returned}</TableCell>
                                    <TableCell className="px-5 py-3 text-center">
                                        <span className={`font-bold ${d.gallons_owed > 0 ? "text-red-600" : "text-green-600"}`}>
                                            {d.gallons_owed}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-3 text-xs text-gray-400">{d.notes ?? "—"}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default GallonDebtList;
