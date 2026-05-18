import { useEffect, useState, useRef } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
    PhilippinePeso, ShoppingCart, Bike, AlertTriangle, Droplets,
    Users, Truck, CheckCircle, GlassWater, History, Wrench, Waves,
    Wifi, WifiOff, Store, Globe,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
type PurchaseSource = "walk_in" | "online";
interface Purchase {
    id: number;
    customer: string;
    items: string;
    amount: number;
    source: PurchaseSource;
    payment: string;
    time: Date;
}

/* ─── Mock purchase generator ───────────────────────────────── */
const NAMES   = ["Maria Santos","Jun Reyes","Ana Lim","Carlo Bautista","Nena Cruz","Dodong Flores","Lyn Padilla","Roy Malig","Cris Torres","Beth Navarro"];
const ITEMS   = ["2× 5gal Exchange","1× 5gal New","5× 1L","3× 500ml","1× 5gal Exchange + 3× 1L","2× 5gal New","10× 500ml"];
const AMOUNTS = [70, 185, 75, 30, 145, 370, 100];
const PAYS    = ["Cash","GCash","Maya","Cash","Cash","GCash"];

let _id = 1020;
const randomPurchase = (): Purchase => {
    const i = Math.floor(Math.random() * NAMES.length);
    const a = Math.floor(Math.random() * AMOUNTS.length);
    return {
        id: ++_id,
        customer: NAMES[i],
        items: ITEMS[Math.floor(Math.random() * ITEMS.length)],
        amount: AMOUNTS[a],
        source: Math.random() > 0.45 ? "online" : "walk_in",
        payment: PAYS[Math.floor(Math.random() * PAYS.length)],
        time: new Date(),
    };
};

/* ─── Seed data ─────────────────────────────────────────────── */
const SEED_PURCHASES: Purchase[] = [
    { id:1019, customer:"Maria Santos",  items:"2× 5gal Exchange",        amount:70,  source:"online",  payment:"Cash",  time: new Date(Date.now()-1000*40)  },
    { id:1018, customer:"Jun Reyes",     items:"1× 5gal New Container",   amount:185, source:"online",  payment:"GCash", time: new Date(Date.now()-1000*130) },
    { id:1017, customer:"Ana Lim",       items:"5× 1L Bottle",            amount:75,  source:"walk_in", payment:"Cash",  time: new Date(Date.now()-1000*300) },
    { id:1016, customer:"Carlo Bautista",items:"2× 5gal New Container",   amount:370, source:"online",  payment:"Maya",  time: new Date(Date.now()-1000*480) },
    { id:1015, customer:"Nena Cruz",     items:"10× 500ml Bottle",        amount:100, source:"walk_in", payment:"Cash",  time: new Date(Date.now()-1000*700) },
    { id:1014, customer:"Dodong Flores", items:"2× 5gal Exchange + 3× 1L",amount:145, source:"walk_in", payment:"Cash",  time: new Date(Date.now()-1000*900) },
    { id:1013, customer:"Lyn Padilla",   items:"1× 5gal New Container",   amount:185, source:"online",  payment:"GCash", time: new Date(Date.now()-1000*1200)},
];

/* ─── Chart data ────────────────────────────────────────────── */
const revenueData = [
    { day:"Mon", revenue:4200 }, { day:"Tue", revenue:6800 },
    { day:"Wed", revenue:5100 }, { day:"Thu", revenue:7300 },
    { day:"Fri", revenue:8900 }, { day:"Sat", revenue:9400 }, { day:"Sun", revenue:6200 },
];

const productMixData = [
    { name:"5gal Exchange",     value:412 },
    { name:"5gal New",          value:280 },
    { name:"1L Bottle",         value:195 },
    { name:"500ml Bottle",      value:134 },
];
const PIE_COLORS = ["#378ADD","#534AB7","#1D9E75","#BA7517"];

const sourceData = [
    { day:"Mon", online:2800, walkin:1400 },
    { day:"Tue", online:4200, walkin:2600 },
    { day:"Wed", online:3100, walkin:2000 },
    { day:"Thu", online:4800, walkin:2500 },
    { day:"Fri", online:5500, walkin:3400 },
    { day:"Sat", online:6100, walkin:3300 },
    { day:"Sun", online:4000, walkin:2200 },
];

const hourlyData = [
    { h:"6AM",orders:2 },{ h:"7AM",orders:5 },{ h:"8AM",orders:9 },
    { h:"9AM",orders:14 },{ h:"10AM",orders:18 },{ h:"11AM",orders:22 },
    { h:"12PM",orders:30 },{ h:"1PM",orders:25 },{ h:"2PM",orders:20 },
    { h:"3PM",orders:17 },{ h:"4PM",orders:13 },{ h:"5PM",orders:8 },
];

/* ─── Helpers ───────────────────────────────────────────────── */
const formatTime = (d: Date) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60)   return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    return d.toLocaleTimeString("en-PH",{ hour:"2-digit", minute:"2-digit" });
};

/* ─── Component ─────────────────────────────────────────────── */
const AdminDashboard = () => {
    const [purchases, setPurchases] = useState<Purchase[]>(SEED_PURCHASES);
    const [live, setLive] = useState(true);
    const [filter, setFilter] = useState<"all"|"online"|"walk_in">("all");
    const [flash, setFlash] = useState<number|null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

    useEffect(() => { document.title = "Admin Dashboard"; }, []);

    useEffect(() => {
        if (!live) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
        intervalRef.current = setInterval(() => {
            const p = randomPurchase();
            setFlash(p.id);
            setPurchases(prev => [p, ...prev].slice(0, 30));
            setTimeout(() => setFlash(null), 1200);
        }, 5000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [live]);

    const kpis = [
        { label:"Total revenue",       value:"₱48,200", icon:PhilippinePeso, bg:"bg-blue-100 text-blue-600",   delta:"+12.4%", up:true },
        { label:"Total orders",        value:"1,240",   icon:ShoppingCart,   bg:"bg-indigo-100 text-indigo-600",delta:"+8.1%",  up:true },
        { label:"Active riders",       value:"5",       icon:Bike,           bg:"bg-green-100 text-green-600",  delta:"2 idle",  up:null },
        { label:"Low stock alerts",    value:"3 items", icon:AlertTriangle,  bg:"bg-red-100 text-red-600",      delta:"Restock", up:false },
        { label:"Gallons sold today",  value:"84 gal",  icon:Droplets,       bg:"bg-cyan-100 text-cyan-600",    delta:"+6 vs yesterday", up:true },
        { label:"Total customers",     value:"320",     icon:Users,          bg:"bg-purple-100 text-purple-600",delta:"+5 new",  up:true },
        { label:"Deliveries today",    value:"12",      icon:Truck,          bg:"bg-orange-100 text-orange-600",delta:"8 done",  up:null },
        { label:"Deliveries made",     value:"8",       icon:CheckCircle,    bg:"bg-teal-100 text-teal-600",    delta:"67% rate", up:true },
        { label:"Gallon debts",        value:"27 jugs", icon:GlassWater,     bg:"bg-yellow-100 text-yellow-600",delta:"Follow up", up:false },
        { label:"Repeat customers",    value:"198",     icon:History,        bg:"bg-pink-100 text-pink-600",    delta:"61.9% retention", up:true },
    ];

    const systemHealth = {
        last_maintenance: "2026-05-10",
        water_tank: { label:"Main Tank", current_liters:320, capacity_liters:500 },
    };
    const tankPercent = Math.round(
        (systemHealth.water_tank.current_liters / systemHealth.water_tank.capacity_liters) * 100
    );

    const filtered = purchases.filter(p => filter === "all" || p.source === filter);

    return (
        <div className="space-y-6">

            {/* Greeting */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Admin</span>
                        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                            🛡 Administrator
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin!</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Soldier's Thirst · Monday, May 18, 2026
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs ${
                        live ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                        {live ? <Wifi size={12}/> : <WifiOff size={12}/>}
                        {live ? "Live" : "Paused"}
                    </span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${kpi.bg}`}>
                            <kpi.icon size={16}/>
                        </div>
                        <p className="text-lg font-bold text-gray-800 leading-none">{kpi.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{kpi.label}</p>
                        {kpi.delta && (
                            <p className={`text-xs mt-1.5 font-medium ${
                                kpi.up === true ? "text-green-600" : kpi.up === false ? "text-red-500" : "text-gray-400"
                            }`}>
                                {kpi.up === true ? "↑" : kpi.up === false ? "↓" : ""} {kpi.delta}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue area chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Weekly revenue (PHP)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="day" tick={{ fontSize:12 }}/>
                            <YAxis tick={{ fontSize:12 }} tickFormatter={(v: any) => `₱${(Number(v)/1000).toFixed(0)}k`}/>
                            <Tooltip formatter={(v: any) => [`₱${Number(v).toLocaleString()}`, "Revenue"]}/>
                            <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revGrad)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Product mix pie */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Product mix</h2>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={productMixData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                dataKey="value" paddingAngle={3}>
                                {productMixData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i]}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: any) => [`${v} sold`]}/>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                        {productMixData.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: PIE_COLORS[i] }}/>
                                    <span className="text-gray-600">{p.name}</span>
                                </div>
                                <span className="text-gray-500 font-medium">{p.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Online vs Walk-in stacked bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Online vs walk-in revenue (PHP)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sourceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="day" tick={{ fontSize:12 }}/>
                            <YAxis tick={{ fontSize:12 }} tickFormatter={(v: any) => `₱${(Number(v)/1000).toFixed(0)}k`}/>
                            <Tooltip formatter={(v: any) => [`₱${Number(v).toLocaleString()}`]}/>
                            <Legend wrapperStyle={{ fontSize:12 }}/>
                            <Bar dataKey="online"  name="Online"   fill="#2563eb" radius={[4,4,0,0]} stackId="a"/>
                            <Bar dataKey="walkin"  name="Walk-in"  fill="#6366f1" radius={[4,4,0,0]} stackId="a"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Hourly orders */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Orders by hour (today)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={hourlyData}>
                            <defs>
                                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                            <XAxis dataKey="h" tick={{ fontSize:11 }}/>
                            <YAxis tick={{ fontSize:12 }}/>
                            <Tooltip formatter={(v: any) => [`${v} orders`]}/>
                            <Area type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={2} fill="url(#hourGrad)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Real-time purchases feed */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-semibold text-gray-700">Real-time purchases</h2>
                        {live && (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"/>
                                Live
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Source filter */}
                        <div className="flex gap-1">
                            {(["all","online","walk_in"] as const).map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFilter(f)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                                        filter === f
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    {f === "online"   && <Globe size={11}/>}
                                    {f === "walk_in"  && <Store size={11}/>}
                                    {f === "all" ? "All" : f === "online" ? "Online" : "Walk-in"}
                                </button>
                            ))}
                        </div>
                        {/* Live toggle */}
                        <button
                            type="button"
                            onClick={() => setLive(l => !l)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                                live
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                        >
                            {live ? <Wifi size={12}/> : <WifiOff size={12}/>}
                            {live ? "Pause" : "Resume"}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Order</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Source</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr
                                    key={p.id}
                                    className={`border-b border-gray-50 transition-colors ${
                                        flash === p.id ? "bg-blue-50" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">#{p.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{p.customer}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{p.items}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">₱{p.amount}</td>
                                    <td className="px-4 py-3">
                                        {p.source === "online" ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                                <Globe size={10}/> Online
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                                <Store size={10}/> Walk-in
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{p.payment}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs tabular-nums">{formatTime(p.time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* System health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                    <h2 className="text-sm font-semibold text-gray-700">System health</h2>
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-600"><Wrench size={16}/></div>
                        <div>
                            <p className="text-xs text-gray-400">Last maintenance</p>
                            <p className="text-sm font-semibold text-gray-800">{systemHealth.last_maintenance}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Waves size={16}/></div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400">{systemHealth.water_tank.label}</p>
                            <p className={`text-sm font-semibold ${tankPercent <= 20 ? "text-red-600" : tankPercent <= 50 ? "text-yellow-600" : "text-blue-600"}`}>
                                {systemHealth.water_tank.current_liters}L / {systemHealth.water_tank.capacity_liters}L
                            </p>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${tankPercent <= 20 ? "bg-red-500" : tankPercent <= 50 ? "bg-yellow-400" : "bg-blue-500"}`}
                                    style={{ width:`${tankPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{tankPercent}% full</p>
                        </div>
                    </div>
                </div>

                {/* Active riders summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Active riders</h2>
                    <div className="space-y-2.5">
                        {[
                            { name:"Ramon Cruz",     deliveries:3, active:true  },
                            { name:"Ben Malig",      deliveries:2, active:true  },
                            { name:"Jose Padilla",   deliveries:2, active:true  },
                            { name:"Leo Torres",     deliveries:0, active:false },
                            { name:"Ricky Dela Cruz",deliveries:0, active:false },
                        ].map((r, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${r.active ? "bg-green-500" : "bg-gray-300"}`}/>
                                    <span className="text-sm text-gray-700">{r.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">{r.deliveries} deliveries</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gallon debts */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Gallon debts</h2>
                    <div className="space-y-2.5">
                        {[
                            { name:"Carlo Bautista", jugs:8 },
                            { name:"Maria Santos",   jugs:5 },
                            { name:"Jun Reyes",      jugs:7 },
                            { name:"Ana Lim",        jugs:3 },
                            { name:"Nena Cruz",      jugs:4 },
                        ].map((d, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">{d.name}</span>
                                <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                    {d.jugs} jugs
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;