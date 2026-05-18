import { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell, PolarRadiusAxis,
} from "recharts";

const AdminAnalytics = () => {
    useEffect(() => { document.title = "Admin Analytics"; }, []);

    const [revRange, setRevRange] = useState<"6mo"|"3mo">("6mo");

    /* ─── Data ─────────────────────────────────────────────── */
    const revenueData6 = [
        { month:"Jan", walkin:12000, delivery:18000 },
        { month:"Feb", walkin:9500,  delivery:21000 },
        { month:"Mar", walkin:14000, delivery:19500 },
        { month:"Apr", walkin:11000, delivery:23000 },
        { month:"May", walkin:16000, delivery:25000 },
        { month:"Jun", walkin:13500, delivery:22000 },
    ];
    const revenueData3 = revenueData6.slice(3);
    const revenueData = revRange === "6mo" ? revenueData6 : revenueData3;

    const waterVolumeData = [
        { month:"Jan", liters:3200 },
        { month:"Feb", liters:2900 },
        { month:"Mar", liters:4100 },
        { month:"Apr", liters:3800 },
        { month:"May", liters:4500 },
        { month:"Jun", liters:4200 },
    ];

    const bottleStockData = [
        { month:"Jan", small:320, large:180, gallons:95 },
        { month:"Feb", small:290, large:160, gallons:80 },
        { month:"Mar", small:410, large:200, gallons:110 },
        { month:"Apr", small:380, large:175, gallons:100 },
        { month:"May", small:450, large:220, gallons:130 },
        { month:"Jun", small:420, large:210, gallons:120 },
    ];

    const customerRetentionData = [
        { month:"Jan", new:45, returning:120 },
        { month:"Feb", new:38, returning:130 },
        { month:"Mar", new:55, returning:145 },
        { month:"Apr", new:42, returning:155 },
        { month:"May", new:60, returning:168 },
        { month:"Jun", new:50, returning:178 },
    ];

    const radarData = [
        { metric:"Revenue",     score:88 },
        { metric:"Orders",      score:74 },
        { metric:"Retention",   score:82 },
        { metric:"Riders",      score:65 },
        { metric:"Stock",       score:70 },
        { metric:"Satisfaction",score:90 },
    ];

    const deliveryTimeData = [
        { x:1,  y:15, name:"Brgy. Baybay"    },
        { x:2,  y:22, name:"Brgy. Pueblo"    },
        { x:3,  y:18, name:"Brgy. Lawaan"    },
        { x:4,  y:30, name:"Brgy. Bolo"      },
        { x:5,  y:12, name:"Brgy. Culasi"    },
        { x:6,  y:25, name:"Brgy. Tanza"     },
        { x:7,  y:20, name:"Brgy. Dumolog"   },
        { x:8,  y:35, name:"Brgy. Milibili"  },
    ];

    const paymentMethodData = [
        { month:"Jan", cash:65, gcash:25, maya:10 },
        { month:"Feb", cash:60, gcash:28, maya:12 },
        { month:"Mar", cash:55, gcash:32, maya:13 },
        { month:"Apr", cash:50, gcash:35, maya:15 },
        { month:"May", cash:48, gcash:37, maya:15 },
        { month:"Jun", cash:45, gcash:40, maya:15 },
    ];

    const summaryCards = [
        { label:"Total revenue (6 mo)",  value:"₱204,500", color:"text-blue-600",   bg:"bg-blue-50",   delta:"+14.2% vs prev period" },
        { label:"Total water volume",    value:"22,700 L",  color:"text-cyan-600",   bg:"bg-cyan-50",   delta:"+8.7% vs prev period"  },
        { label:"Walk-in revenue",       value:"₱76,000",  color:"text-indigo-600", bg:"bg-indigo-50", delta:"+5.1% vs prev period"  },
        { label:"Delivery revenue",      value:"₱128,500", color:"text-green-600",  bg:"bg-green-50",  delta:"+19.6% vs prev period" },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Admin</p>
                <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
                <p className="text-sm text-gray-400 mt-0.5">6-month performance overview · Soldier's Thirst</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {summaryCards.map((c, i) => (
                    <div key={i} className={`rounded-xl border border-gray-200 p-4 shadow-sm ${c.bg}`}>
                        <p className="text-xs text-gray-500">{c.label}</p>
                        <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{c.delta}</p>
                    </div>
                ))}
            </div>

            {/* Revenue breakdown with range toggle */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-700">Revenue — walk-in vs delivery (PHP)</h2>
                    <div className="flex gap-1">
                        {(["6mo","3mo"] as const).map(r => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRevRange(r)}
                                className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                                    revRange === r ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                            >
                                {r === "6mo" ? "6 months" : "3 months"}
                            </button>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                        <XAxis dataKey="month" tick={{ fontSize:12 }}/>
                        <YAxis tick={{ fontSize:12 }} tickFormatter={(v: any) => `₱${(Number(v)/1000).toFixed(0)}k`}/>
                        <Tooltip formatter={(v: any) => [`₱${Number(v).toLocaleString()}`]}/>
                        <Legend wrapperStyle={{ fontSize:12 }}/>
                        <Bar dataKey="walkin"   name="Walk-in"   fill="#6366f1" radius={[4,4,0,0]}/>
                        <Bar dataKey="delivery" name="Delivery"  fill="#2563eb" radius={[4,4,0,0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Row 2 — water volume + customer retention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Water volume processed (liters)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={waterVolumeData}>
                            <defs>
                                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="month" tick={{ fontSize:12 }}/>
                            <YAxis tick={{ fontSize:12 }}/>
                            <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} L`]}/>
                            <Area type="monotone" dataKey="liters" name="Liters" stroke="#06b6d4" strokeWidth={2} fill="url(#waterGrad)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">New vs returning customers</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={customerRetentionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="month" tick={{ fontSize:12 }}/>
                            <YAxis tick={{ fontSize:12 }}/>
                            <Tooltip/>
                            <Legend wrapperStyle={{ fontSize:12 }}/>
                            <Bar dataKey="new"       name="New"       fill="#f59e0b" radius={[4,4,0,0]}/>
                            <Bar dataKey="returning" name="Returning" fill="#10b981" radius={[4,4,0,0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 3 — payment trends + stock movement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Payment method trend (%)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={paymentMethodData}>
                            <defs>
                                <linearGradient id="cashGrad"  x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="gcashGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="month" tick={{ fontSize:12 }}/>
                            <YAxis tick={{ fontSize:12 }} unit="%"/>
                            <Tooltip formatter={(v: any) => [`${v}%`]}/>
                            <Legend wrapperStyle={{ fontSize:12 }}/>
                            <Area type="monotone" dataKey="cash"  name="Cash"  stroke="#6366f1" strokeWidth={2} fill="url(#cashGrad)"/>
                            <Area type="monotone" dataKey="gcash" name="GCash" stroke="#2563eb" strokeWidth={2} fill="url(#gcashGrad)"/>
                            <Area type="monotone" dataKey="maya"  name="Maya"  stroke="#06b6d4" strokeWidth={2} fill="none"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Bottle stock movement</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={bottleStockData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="month" tick={{ fontSize:12 }}/>
                            <YAxis tick={{ fontSize:12 }}/>
                            <Tooltip/>
                            <Legend wrapperStyle={{ fontSize:12 }}/>
                            <Line type="monotone" dataKey="small"   name="Small bottles" stroke="#6366f1" strokeWidth={2} dot={false}/>
                            <Line type="monotone" dataKey="large"   name="Large bottles" stroke="#2563eb" strokeWidth={2} dot={false}/>
                            <Line type="monotone" dataKey="gallons" name="Gallons"        stroke="#06b6d4" strokeWidth={2} dot={false}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 4 — radar + delivery scatter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Business performance radar</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#f3f4f6"/>
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize:12 }}/>
                            <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fontSize:10 }}/>
                            <Radar name="Score" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2}/>
                            <Tooltip formatter={(v: any) => [`${v}/100`]}/>
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-1">Delivery time by barangay (min)</h2>
                    <p className="text-xs text-gray-400 mb-4">X = route index · Y = avg delivery time</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="x" tick={{ fontSize:12 }} name="Route"/>
                            <YAxis dataKey="y" tick={{ fontSize:12 }} unit=" min" name="Time"/>
                            <Tooltip
                                cursor={{ strokeDasharray:"3 3" }}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const d = payload[0].payload;
                                    return (
                                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-sm">
                                            <p className="font-semibold text-gray-800">{d.name}</p>
                                            <p className="text-gray-500">Avg: {d.y} min</p>
                                        </div>
                                    );
                                }}
                            />
                            <Scatter data={deliveryTimeData} fill="#2563eb">
                                {deliveryTimeData.map((_, i) => (
                                    <Cell key={i} fill={_.y > 25 ? "#ef4444" : "#2563eb"}/>
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-400 mt-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"/>Routes over 25 min flagged for optimization
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;