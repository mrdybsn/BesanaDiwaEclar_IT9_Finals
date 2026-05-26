import { useState, useEffect, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import DeliveryService from "../../../services/DeliveryService";
import type { Delivery } from "../../../interfaces/DeliveryInterfaces";

type FilterType = "today" | "yesterday" | "this_week" | "this_month" | "all";

interface DeliveryListProps {
    onView:    (delivery: Delivery) => void;
    onDelete:  (delivery: Delivery) => void;
    refreshKey: number; // increment from parent to trigger re-fetch
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-700" },
    assigned:   { label: "Assigned",   className: "bg-blue-100   text-blue-700"   },
    in_transit: { label: "In Transit", className: "bg-indigo-100 text-indigo-700" },
    delivered:  { label: "Delivered",  className: "bg-green-100  text-green-700"  },
    failed:     { label: "Failed",     className: "bg-red-100    text-red-700"    },
};

const filterLabels: Record<FilterType, string> = {
    today:      "Today",
    yesterday:  "Yesterday",
    this_week:  "This Week",
    this_month: "This Month",
    all:        "All",
};

const toLocalDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const DeliveryList: FC<DeliveryListProps> = ({ onView, onDelete, refreshKey }) => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading]       = useState(false);
    const [page, setPage]             = useState(1);
    const [lastPage, setLastPage]     = useState(1);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [search, setSearch]         = useState("");

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const res = await DeliveryService.loadDeliveries({ search, page });
            setDeliveries(res.deliveries.data);
            setLastPage(res.deliveries.last_page);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveries();
    }, [page, search, refreshKey]);

    const getFiltered = () => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        return deliveries.filter((d) => {
            const date = toLocalDate(d.scheduled_date);
            switch (activeFilter) {
                case "today":      return date.getTime() === today.getTime();
                case "yesterday":  return date.getTime() === yesterday.getTime();
                case "this_week":  return date >= weekStart && date <= today;
                case "this_month": return date >= monthStart && date <= today;
                default:           return true;
            }
        });
    };

    const filtered = getFiltered();

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Filter / Search Bar */}
            <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 mr-1">Delivery History:</span>
                {(Object.keys(filterLabels) as FilterType[]).map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            activeFilter === f
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {filterLabels[f]}
                    </button>
                ))}
                <input
                    type="text"
                    placeholder="Search rider / notes…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="ml-auto w-48 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Rider</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Address</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Scheduled</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Expected (₱)</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Collected (₱)</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {loading ? (
                            <TableRow>
                                <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={8}>Loading…</TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell className="px-4 py-8 text-center text-gray-400" colSpan={8}>No deliveries found.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((delivery, index) => {
                                const status = statusConfig[delivery.status] ?? { label: delivery.status, className: "bg-gray-100 text-gray-600" };
                                const riderName = delivery.rider
                                    ? `${delivery.rider.last_name}, ${delivery.rider.first_name}`
                                    : <span className="text-yellow-600 font-medium text-xs">Unassigned</span>;

                                return (
                                    <TableRow className="hover:bg-gray-50" key={delivery.delivery_id}>
                                        <TableCell className="px-4 py-3 text-center">
                                            {(page - 1) * 15 + index + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {riderName}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start text-xs max-w-40 truncate">
                                            {delivery.order?.delivery_address ?? "—"}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center text-xs">
                                            {delivery.scheduled_date}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            ₱{Number(delivery.expected_amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            ₱{Number(delivery.collected_amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                                {status.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => onView(delivery)}
                                                    className="text-blue-600 hover:underline font-medium text-xs"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(delivery)}
                                                    className="text-red-500 hover:underline font-medium text-xs"
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

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex justify-end items-center gap-2 p-4 text-sm">
                    <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50">Prev</button>
                    <span className="text-gray-500">Page {page} of {lastPage}</span>
                    <button type="button" onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}
                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50">Next</button>
                </div>
            )}
        </div>
    );
};

export default DeliveryList;