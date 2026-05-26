import { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { AlertTriangle, Bike, PhilippinePeso, ShoppingCart, Truck } from "lucide-react";
import AnalyticsService from "../../services/AnalyticsService";
import PageHeader from "../../components/Layout/PageHeader";
import LazyDashboardTable from "../../components/Table/LazyDashboardTable";
import LazyTableViewport from "../../components/Table/LazyTableViewport";
import { useLazySlice } from "../../hooks/useLazySlice";

interface DashboardData {
    date: string;
    low_stock_products: { product_id: number; name: string; size: string; stock: number; low_stock_threshold: number; unit: string }[];
    low_stock_inventory: { inventory_item_id: number; item_name: string; category: string; quantity: number; unit: string; low_stock_threshold: number }[];
    recent_orders: {
        order_id: number;
        order_type: string;
        total_amount: number;
        payment_method: string;
        status: string;
        created_at: string;
        customer?: { first_name: string; last_name: string };
        order_items?: { quantity: number; product?: { name: string; size: string } }[];
    }[];
    today_rider_deliveries: {
        rider_id: number;
        rider_name: string;
        count: number;
        deliveries: { delivery_id: number; status: string; order?: { delivery_address?: string } }[];
    }[];
    daily_summary: {
        walkin: { count: number; total: number };
        delivery: { count: number; total: number };
        total_sales: number;
    };
}

const AdminDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [revenueChart, setRevenueChart] = useState<{ label: string; total: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Dashboard & Analytics";
        const load = async () => {
            setLoading(true);
            try {
                const [dashboard, revenue] = await Promise.all([
                    AnalyticsService.loadDashboard(),
                    AnalyticsService.loadRevenue("weekly"),
                ]);
                setData(dashboard);
                setRevenueChart(
                    (revenue.data ?? []).map((row: { date?: string; week?: number; month?: number; total: number }) => ({
                        label: row.date ?? `W${row.week ?? row.month}`,
                        total: Number(row.total),
                    }))
                );
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const today = new Date().toLocaleDateString("en-PH", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const recentOrders = data?.recent_orders ?? [];
    const {
        visibleItems: visibleOrders,
        sentinelRef: ordersSentinelRef,
        hasMore: hasMoreOrders,
    } = useLazySlice(recentOrders, 8);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-blue-600 gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm">Loading dashboard…</span>
            </div>
        );
    }

    const summary = data?.daily_summary;
    const lowStockProducts = data?.low_stock_products ?? [];
    const lowStockInventory = data?.low_stock_inventory ?? [];
    const lowStockCount = lowStockProducts.length + lowStockInventory.length;

    const kpis = [
        { label: "Today's sales", value: `₱${Number(summary?.total_sales ?? 0).toLocaleString()}`, icon: PhilippinePeso, bg: "bg-blue-100 text-blue-600" },
        { label: "Walk-in orders", value: String(summary?.walkin?.count ?? 0), icon: ShoppingCart, bg: "bg-indigo-100 text-indigo-600" },
        { label: "Delivery orders", value: String(summary?.delivery?.count ?? 0), icon: Truck, bg: "bg-orange-100 text-orange-600" },
        { label: "Low stock alerts", value: `${lowStockCount} items`, icon: AlertTriangle, bg: "bg-red-100 text-red-600" },
        { label: "Riders on duty", value: String(data?.today_rider_deliveries?.length ?? 0), icon: Bike, bg: "bg-green-100 text-green-600" },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard & Analytics"
                description={`Soldier's Thirst · ${today}`}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${kpi.bg}`}>
                            <kpi.icon size={16} />
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-none">{kpi.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{kpi.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Weekly revenue (PHP)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={revenueChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₱${v}`} />
                            <Tooltip formatter={(v) => [`₱${Number(v).toLocaleString()}`, "Revenue"]} />
                            <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} fill="#2563eb22" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Walk-in vs delivery (today)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={[
                            { type: "Walk-in", total: Number(summary?.walkin?.total ?? 0) },
                            { type: "Delivery", total: Number(summary?.delivery?.total ?? 0) },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v) => [`₱${Number(v).toLocaleString()}`]} />
                            <Legend />
                            <Bar dataKey="total" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LazyDashboardTable<DashboardData["low_stock_products"][number]>
                    title="Products — low stock"
                    items={lowStockProducts}
                    getRowKey={(p) => p.product_id}
                    emptyMessage="No products below threshold."
                    headers={
                        <>
                            <th className="text-left px-4 py-2">Product</th>
                            <th className="text-left px-4 py-2">Stock</th>
                            <th className="text-left px-4 py-2">Threshold</th>
                        </>
                    }
                    renderRow={(p) => (
                        <>
                            <td className="px-4 py-2">{p.name} ({p.size})</td>
                            <td className="px-4 py-2 text-red-600 font-semibold">{p.stock} {p.unit}</td>
                            <td className="px-4 py-2 text-gray-400">{p.low_stock_threshold}</td>
                        </>
                    )}
                />
                <LazyDashboardTable<DashboardData["low_stock_inventory"][number]>
                    title="Inventory supplies — low stock"
                    items={lowStockInventory}
                    getRowKey={(i) => i.inventory_item_id}
                    emptyMessage="No supply items below threshold."
                    headers={
                        <>
                            <th className="text-left px-4 py-2">Item</th>
                            <th className="text-left px-4 py-2">Qty</th>
                            <th className="text-left px-4 py-2">Threshold</th>
                        </>
                    }
                    renderRow={(i) => (
                        <>
                            <td className="px-4 py-2">
                                {i.item_name}{" "}
                                <span className="text-gray-400 text-xs capitalize">({i.category})</span>
                            </td>
                            <td className="px-4 py-2 text-red-600 font-semibold">{i.quantity} {i.unit}</td>
                            <td className="px-4 py-2 text-gray-400">{i.low_stock_threshold}</td>
                        </>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">Recent purchases</h2>
                    </div>
                    <LazyTableViewport
                        isEmpty={recentOrders.length === 0}
                        emptyMessage="No recent orders."
                        maxHeight="16rem"
                        sentinelRef={ordersSentinelRef}
                        showBuiltInSentinel
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
                                    <th className="text-left px-4 py-2">Order</th>
                                    <th className="text-left px-4 py-2">Customer</th>
                                    <th className="text-left px-4 py-2">Items</th>
                                    <th className="text-left px-4 py-2">Amount</th>
                                    <th className="text-left px-4 py-2">Type</th>
                                    <th className="text-left px-4 py-2">Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleOrders.map((o) => (
                                    <tr key={o.order_id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-4 py-2 font-mono text-xs text-gray-500">#{o.order_id}</td>
                                        <td className="px-4 py-2 font-medium text-gray-800">
                                            {o.customer ? `${o.customer.first_name} ${o.customer.last_name}` : "Walk-in"}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500">
                                            {o.order_items?.map((i) => `${i.product?.name ?? "Item"} x${i.quantity}`).join(", ") ?? "—"}
                                        </td>
                                        <td className="px-4 py-2 font-semibold">₱{Number(o.total_amount).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-xs capitalize">{o.order_type}</td>
                                        <td className="px-4 py-2 text-xs uppercase">{o.payment_method}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {hasMoreOrders && (
                            <div className="px-4 py-2 text-center text-xs text-gray-400">Scroll for more…</div>
                        )}
                    </LazyTableViewport>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700">Riders with deliveries today</h2>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.today_rider_deliveries?.map((group) => (
                        <div key={group.rider_id} className="border border-gray-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-800 text-sm">{group.rider_name}</p>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{group.count} deliveries</span>
                            </div>
                            <ul className="space-y-1 text-xs text-gray-500">
                                {group.deliveries.slice(0, 4).map((d) => (
                                    <li key={d.delivery_id}>#{d.delivery_id} — {d.order?.delivery_address ?? "No address"} ({d.status})</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {!data?.today_rider_deliveries?.length && (
                        <p className="text-sm text-gray-400 col-span-full text-center py-4">No rider deliveries scheduled for today.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
