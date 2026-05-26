import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AnalyticsService from "../../services/AnalyticsService";
import ReportService from "../../services/ReportService";
import PageHeader from "../../components/Layout/PageHeader";

const AdminReportsPage = () => {
    const [revenueData, setRevenueData] = useState<{ label: string; total: number; order_count: number }[]>([]);
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Reports";
        AnalyticsService.loadRevenue("weekly")
            .then((res) => {
                setRevenueData(
                    (res.data ?? []).map((row: { date: string; total: number; order_count: number }) => ({
                        label: row.date,
                        total: Number(row.total),
                        order_count: Number(row.order_count),
                    }))
                );
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const start = new Date();
            start.setDate(start.getDate() - start.getDay());
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            const fmt = (d: Date) => d.toISOString().split("T")[0];
            await ReportService.downloadWeeklyReport(fmt(start), fmt(end));
        } catch (e) {
            console.error(e);
            alert("Failed to download report.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Reports"
                description="Download weekly revenue and sales breakdown."
            >
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl"
                >
                    {downloading ? "Generating…" : "Download Weekly Report"}
                </button>
            </PageHeader>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">This week&apos;s revenue</h2>
                {loading ? (
                    <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v, name) => [name === "total" ? `₱${Number(v).toLocaleString()}` : v, name === "total" ? "Revenue" : "Orders"]} />
                            <Bar dataKey="total" name="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="order_count" name="order_count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
                <p className="text-xs text-gray-400 mt-4">
                    The downloaded report opens as HTML. Use your browser&apos;s Print → Save as PDF to export as PDF.
                </p>
            </div>
        </div>
    );
};

export default AdminReportsPage;
