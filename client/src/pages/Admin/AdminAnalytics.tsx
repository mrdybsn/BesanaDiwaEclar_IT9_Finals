import { useEffect } from "react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const AdminAnalytics = () => {
    useEffect(() => {
        document.title = "Admin Analytics";
    }, []);

    const revenueData = [
        { month: "Jan", walkin: 12000, delivery: 18000 },
        { month: "Feb", walkin: 9500, delivery: 21000 },
        { month: "Mar", walkin: 14000, delivery: 19500 },
        { month: "Apr", walkin: 11000, delivery: 23000 },
        { month: "May", walkin: 16000, delivery: 25000 },
        { month: "Jun", walkin: 13500, delivery: 22000 },
    ];

    const waterVolumeData = [
        { month: "Jan", liters: 3200 },
        { month: "Feb", liters: 2900 },
        { month: "Mar", liters: 4100 },
        { month: "Apr", liters: 3800 },
        { month: "May", liters: 4500 },
        { month: "Jun", liters: 4200 },
    ];

    const bottleStockData = [
        { month: "Jan", small_bottles: 320, large_bottles: 180, gallons: 95 },
        { month: "Feb", small_bottles: 290, large_bottles: 160, gallons: 80 },
        { month: "Mar", small_bottles: 410, large_bottles: 200, gallons: 110 },
        { month: "Apr", small_bottles: 380, large_bottles: 175, gallons: 100 },
        { month: "May", small_bottles: 450, large_bottles: 220, gallons: 130 },
        { month: "Jun", small_bottles: 420, large_bottles: 210, gallons: 120 },
    ];

    const summaryCards = [
        {
            label: "Total Revenue (6 months)",
            value: "₱ 204,500.00",
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Total Water Volume",
            value: "22,700 L",
            color: "text-cyan-600",
            bg: "bg-cyan-50",
        },
        {
            label: "Walk-in Revenue",
            value: "₱ 76,000.00",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            label: "Delivery Revenue",
            value: "₱ 128,500.00",
            color: "text-green-600",
            bg: "bg-green-50",
        },
    ];

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, index) => (
                    <div
                        key={index}
                        className={`rounded-lg border border-gray-200 p-4 shadow-sm ${card.bg}`}
                    >
                        <p className="text-xs text-gray-500">{card.label}</p>
                        <p className={`text-lg font-bold mt-1 ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">
                    Revenue Breakdown — Walk-in vs Delivery (PHP)
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            labelFormatter={(value) => `₱ ${value.toLocaleString()}`}
                        />
                        <Legend />
                        <Bar dataKey="walkin" name="Walk-in" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="delivery" name="Delivery" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                        Water Volume Processed (Liters)
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={waterVolumeData}>
                            <defs>
                                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip labelFormatter={(value) => `${value.toLocaleString()} L`} />
                            <Area
                                type="monotone"
                                dataKey="liters"
                                name="Liters"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                fill="url(#waterGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                        Bottle Stock Movement
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={bottleStockData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="small_bottles"
                                name="Small Bottles"
                                stroke="#6366f1"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="large_bottles"
                                name="Large Bottles"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="gallons"
                                name="Gallons"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;