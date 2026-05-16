import { useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    PhilippinePeso,
    ShoppingCart,
    Bike,
    AlertTriangle,
    Droplets,
    Users,
    Truck,
    CheckCircle,
    GlassWater,
    History,
    Wrench,
    Waves,
} from "lucide-react";

const AdminDashboard = () => {
    useEffect(() => {
        document.title = "Admin Dashboard";
    }, []);

    const kpis = [
        {
            label: "Total Revenue",
            value: "₱ 48,200.00",
            icon: PhilippinePeso,
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Total Orders",
            value: "1,240",
            icon: ShoppingCart,
            color: "bg-indigo-100 text-indigo-600",
        },
        {
            label: "Active Riders",
            value: "5",
            icon: Bike,
            color: "bg-green-100 text-green-600",
        },
        {
            label: "Low Stock Alerts",
            value: "3 Items",
            icon: AlertTriangle,
            color: "bg-red-100 text-red-600",
        },
        {
            label: "Gallons Sold Today",
            value: "84 gal",
            icon: Droplets,
            color: "bg-cyan-100 text-cyan-600",
        },
        {
            label: "Total Customers",
            value: "320",
            icon: Users,
            color: "bg-purple-100 text-purple-600",
        },
        {
            label: "Deliveries for Today",
            value: "12",
            icon: Truck,
            color: "bg-orange-100 text-orange-600",
        },
        {
            label: "Deliveries Made",
            value: "8",
            icon: CheckCircle,
            color: "bg-teal-100 text-teal-600",
        },
        {
            label: "Gallon Debts",
            value: "27 jugs",
            icon: GlassWater,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            label: "Repeat Customers",
            value: "198",
            icon: History,
            color: "bg-pink-100 text-pink-600",
        },
    ];

    const revenueData = [
        { day: "Mon", revenue: 4200 },
        { day: "Tue", revenue: 6800 },
        { day: "Wed", revenue: 5100 },
        { day: "Thu", revenue: 7300 },
        { day: "Fri", revenue: 8900 },
        { day: "Sat", revenue: 9400 },
        { day: "Sun", revenue: 6200 },
    ];

    const systemHealth = {
        last_maintenance: "2026-05-10",
        water_tank: {
            label: "Main Tank",
            current_liters: 320,
            capacity_liters: 500,
        },
    };

    const tankPercent = Math.round(
        (systemHealth.water_tank.current_liters / systemHealth.water_tank.capacity_liters) * 100
    );

    const tankColor =
        tankPercent <= 20
            ? "bg-red-500"
            : tankPercent <= 50
            ? "bg-yellow-400"
            : "bg-blue-500";

    const tankTextColor =
        tankPercent <= 20
            ? "text-red-600"
            : tankPercent <= 50
            ? "text-yellow-600"
            : "text-blue-600";

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {kpis.map((kpi, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 shadow-sm"
                    >
                        <div className={`p-2 rounded-lg ${kpi.color}`}>
                            <kpi.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{kpi.label}</p>
                            <p className="text-sm font-semibold text-gray-800">{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                        Weekly Revenue (PHP)
                    </h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                labelFormatter={(value) =>
                                    `₱ ${value.toLocaleString()}`
                                }
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2563eb"
                                strokeWidth={2}
                                fill="url(#revenueGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-5">
                    <h2 className="text-sm font-semibold text-gray-700">System Health</h2>

                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                            <Wrench size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Last Maintenance</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {systemHealth.last_maintenance}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <Waves size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500">
                                {systemHealth.water_tank.label}
                            </p>
                            <p className={`text-sm font-semibold ${tankTextColor}`}>
                                {systemHealth.water_tank.current_liters}L /{" "}
                                {systemHealth.water_tank.capacity_liters}L
                            </p>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${tankColor}`}
                                    style={{ width: `${tankPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{tankPercent}% full</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;