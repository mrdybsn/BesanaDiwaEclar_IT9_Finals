import { useCallback, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import LazyTableViewport from "../../../components/Table/LazyTableViewport";
import { useLazyPaginatedList } from "../../../hooks/useLazyPaginatedList";
import RemittanceService, { type Remittance } from "../../../services/RemittanceService";

type TabType = "current" | "history";
type FilterType = "today" | "yesterday" | "this_week" | "this_month" | "custom";

interface RemittanceListProps {
    refreshKey?: number;
    onVerify: (remittance: Remittance) => void;
    onView: (remittance: Remittance) => void;
}

const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    verified: { label: "Verified", className: "bg-green-100 text-green-700" },
    discrepancy: { label: "Discrepancy", className: "bg-red-100 text-red-700" },
};

const filterLabels: Record<FilterType, string> = {
    today: "Today",
    yesterday: "Yesterday",
    this_week: "This Week",
    this_month: "This Month",
    custom: "Custom",
};

const RemittanceList: FC<RemittanceListProps> = ({ refreshKey = 0, onVerify, onView }) => {
    const [tab, setTab] = useState<TabType>("current");
    const [activeFilter, setActiveFilter] = useState<FilterType>("this_week");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const getDateParams = () => {
        const today = new Date();
        const fmt = (d: Date) => d.toISOString().split("T")[0];
        switch (activeFilter) {
            case "today": return { date_from: fmt(today), date_to: fmt(today) };
            case "yesterday": {
                const y = new Date(today);
                y.setDate(today.getDate() - 1);
                return { date_from: fmt(y), date_to: fmt(y) };
            }
            case "this_week": {
                const start = new Date(today);
                start.setDate(today.getDate() - today.getDay());
                return { date_from: fmt(start), date_to: fmt(today) };
            }
            case "this_month": {
                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                return { date_from: fmt(start), date_to: fmt(today) };
            }
            case "custom":
                return { date_from: customFrom, date_to: customTo };
        }
    };

    const fetchPage = useCallback(async (page: number) => {
        const params: Record<string, string | number | undefined> = {
            page,
            per_page: 15,
            ...(tab === "current" ? { status: "pending" } : getDateParams()),
        };
        const res = await RemittanceService.loadRemittances(params);
        const block = res.remittances;
        return {
            data: block?.data ?? [],
            current_page: block?.current_page ?? 1,
            last_page: block?.last_page ?? 1,
        };
    }, [tab, activeFilter, customFrom, customTo]);

    const {
        items: remittances,
        scrollRef,
        sentinelRef,
        viewportRef,
        initialLoading,
        loadingMore,
    } = useLazyPaginatedList<Remittance>({
        fetchPage,
        resetKey: `${tab}-${activeFilter}-${customFrom}-${customTo}-${refreshKey}`,
    });

    const getRiderName = (r: Remittance) =>
        r.rider ? `${r.rider.last_name}, ${r.rider.first_name}` : "—";

    const totalCollected = remittances.reduce((s, r) => s + Number(r.collected_amount), 0);
    const totalRemitted = remittances.reduce((s, r) => s + Number(r.remitted_amount), 0);

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button type="button" onClick={() => setTab("current")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "current" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                    Current Remits
                </button>
                <button type="button" onClick={() => setTab("history")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "history" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                    History
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Collected</p>
                    <p className="text-lg font-bold text-blue-600">₱{totalCollected.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Remitted</p>
                    <p className="text-lg font-bold text-green-600">₱{totalRemitted.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 rounded-lg border border-red-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Discrepancy</p>
                    <p className="text-lg font-bold text-red-600">₱{(totalCollected - totalRemitted).toFixed(2)}</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {tab === "history" && (
                    <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
                        {(["today", "yesterday", "this_week", "this_month", "custom"] as FilterType[]).map((f) => (
                            <button key={f} type="button" onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                                {filterLabels[f]}
                            </button>
                        ))}
                        {activeFilter === "custom" && (
                            <div className="flex items-center gap-2">
                                <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="text-xs border rounded-lg px-2 py-1" />
                                <span className="text-xs text-gray-400">to</span>
                                <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="text-xs border rounded-lg px-2 py-1" />
                            </div>
                        )}
                    </div>
                )}

                <LazyTableViewport
                    viewportRef={viewportRef}
                    scrollRef={scrollRef}
                    sentinelRef={sentinelRef}
                    initialLoading={initialLoading}
                    loadingMore={loadingMore}
                    isEmpty={!initialLoading && remittances.length === 0}
                    emptyMessage="No remittances found."
                >
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 text-white text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-4 py-3">ID</TableCell>
                                <TableCell isHeader className="px-4 py-3">Rider</TableCell>
                                <TableCell isHeader className="px-4 py-3">Delivery</TableCell>
                                <TableCell isHeader className="px-4 py-3">Date</TableCell>
                                <TableCell isHeader className="px-4 py-3">Collected</TableCell>
                                <TableCell isHeader className="px-4 py-3">Remitted</TableCell>
                                <TableCell isHeader className="px-4 py-3">Status</TableCell>
                                <TableCell isHeader className="px-4 py-3">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-sm text-gray-600">
                            {remittances.map((r) => {
                                const st = statusConfig[r.status];
                                return (
                                    <TableRow key={r.remittance_id} className="hover:bg-gray-50">
                                        <TableCell className="px-4 py-3">{r.remittance_id}</TableCell>
                                        <TableCell className="px-4 py-3">{getRiderName(r)}</TableCell>
                                        <TableCell className="px-4 py-3">#{r.delivery_id}</TableCell>
                                        <TableCell className="px-4 py-3">{r.date}</TableCell>
                                        <TableCell className="px-4 py-3">₱{Number(r.collected_amount).toFixed(2)}</TableCell>
                                        <TableCell className="px-4 py-3">₱{Number(r.remitted_amount).toFixed(2)}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${st.className}`}>{st.label}</span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <button type="button" onClick={() => onView(r)} className="text-blue-600 hover:underline text-xs mr-2">View</button>
                                            {(r.status === "pending" || r.status === "discrepancy") && (
                                                <button type="button" onClick={() => onVerify(r)} className="text-green-600 hover:underline text-xs">Verify</button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </LazyTableViewport>
            </div>
        </div>
    );
};

export default RemittanceList;
