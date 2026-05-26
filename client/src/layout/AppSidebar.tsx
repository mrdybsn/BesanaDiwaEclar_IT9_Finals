import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";

// ─── Water Refilling Station Palette ─────────────────────────────────────────
// Deep Ocean   : #0B2D4E   ← sidebar background
// Aqua Blue    : #1A6B9A   ← mid tone
// Sky Water    : #3B9DD2   ← accent
// Crystal      : #7DD4F8   ← light accent
// Foam White   : #F0F9FF   ← text / active bg
// ─────────────────────────────────────────────────────────────────────────────

const icons: Record<string, React.ReactElement> = {
    "/admin/dashboard":    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    "/admin/analytics":    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    "/admin/pos":          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
    "/admin/reports":      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    "/admin/orders":       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    "/admin/recurring":    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    "/admin/users":        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    "/admin/customers":    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    "/admin/products":     <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    "/admin/inventory":    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
    "/admin/gallon-debts": <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    "/admin/deliveries":   <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
    "/admin/remittances":  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    "/rider/tasks":        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    "/rider/map":          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
    "/rider/collection":   <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    "/rider/schedule":     <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    "/rider/lost-items":   <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
};

const NavIcon = ({ path }: { path: string }) => (
    <svg
        className="w-4.5 h-4.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        {icons[path] ?? <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
);

const adminSidebarItems = [
    { path: "/admin/dashboard",    text: "Dashboard",        section: null },
    { path: "/admin/reports",      text: "Reports",          section: null },
    { path: "/admin/pos",          text: "POS",              section: "Operations" },
    { path: "/admin/orders",       text: "Orders",           section: null },
    { path: "/admin/deliveries",   text: "Deliveries",       section: null },
    { path: "/admin/users",        text: "Riders",           section: "Management" },
    { path: "/admin/customers",    text: "Customers",        section: null },
    { path: "/admin/products",     text: "Products",         section: null },
    { path: "/admin/inventory",    text: "Inventory",        section: null },
    { path: "/admin/gallon-debts", text: "Gallon Debts",     section: null },
    { path: "/admin/remittances",  text: "Remittances",      section: null },
];

const riderSidebarItems = [
    { path: "/rider/tasks",         text: "My Tasks",        section: null },
    { path: "/rider/map",           text: "Map",             section: null },
    { path: "/rider/collection",    text: "Collection",      section: null },
    { path: "/rider/schedule",      text: "Schedule",        section: null },
    { path: "/rider/lost-items",    text: "Lost Items",      section: null },
];

const AppSidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path + "/");

    // Live clock
    useEffect(() => {
        const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const pad = (n: number) => String(n).padStart(2, "0");

        const tick = () => {
            const now = new Date();
            const clockEl = document.getElementById("sidebar-clock");
            const dateEl  = document.getElementById("sidebar-date");
            if (clockEl) clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            if (dateEl)  dateEl.textContent  = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    let lastSection: string | null = "NONE_SENTINEL";

    return (
        <>
            {/* mobile backdrop */}
            {!isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 sm:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-60 h-screen pt-14 transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? "-translate-x-full" : "translate-x-0"
                } sm:translate-x-0`}
                style={{
                    background: "linear-gradient(180deg, #0B2D4E 0%, #0d3258 60%, #0B2D4E 100%)",
                    boxShadow: "4px 0 30px rgba(11,45,78,0.5)",
                    borderRight: "1px solid rgba(125,212,248,0.1)",
                }}
                aria-label="Sidebar"
            >
                {/* subtle water ripple texture at top */}
                <div
                    className="absolute top-14 left-0 right-0 h-24 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse at 50% 0%, rgba(125,212,248,0.08) 0%, transparent 70%)",
                    }}
                />

                {/* ── Scrollable nav ── */}
                <div className="flex-1 overflow-y-auto px-3 py-3 relative">
                    <nav>
                        <ul className="space-y-0.5">
                            {(user?.role === "rider" ? riderSidebarItems : adminSidebarItems).map((item) => {
                                const active = isActive(item.path);
                                const showSection = item.section !== null && item.section !== lastSection;
                                if (item.section !== null) lastSection = item.section;

                                return (
                                    <li key={item.path}>
                                        {showSection && (
                                            <p
                                                className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-widest uppercase"
                                                style={{ color: "rgba(125,212,248,0.45)" }}
                                            >
                                                {item.section}
                                            </p>
                                        )}
                                        <Link
                                            to={item.path}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                                            style={
                                                active
                                                    ? {
                                                          background: "linear-gradient(135deg, rgba(125,212,248,0.2) 0%, rgba(59,157,210,0.15) 100%)",
                                                          color: "#F0F9FF",
                                                          boxShadow: "0 0 0 1px rgba(125,212,248,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                                                      }
                                                    : { color: "rgba(240,249,255,0.55)" }
                                            }
                                            onMouseEnter={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.backgroundColor = "rgba(125,212,248,0.08)";
                                                    e.currentTarget.style.color = "rgba(240,249,255,0.85)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.backgroundColor = "transparent";
                                                    e.currentTarget.style.color = "rgba(240,249,255,0.55)";
                                                }
                                            }}
                                        >
                                            {/* Active indicator bar */}
                                            {active && (
                                                <span
                                                    className="absolute left-0 w-1 h-7 rounded-r-full"
                                                    style={{ background: "linear-gradient(180deg, #7DD4F8, #3B9DD2)" }}
                                                />
                                            )}
                                            <span style={{ color: active ? "#7DD4F8" : "inherit" }}>
                                                <NavIcon path={item.path} />
                                            </span>
                                            <span className="truncate">{item.text}</span>

                                            {/* Active dot */}
                                            {active && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#7DD4F8" }} />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {/* ── Bottom: clock card + logout icon ── */}
                <div className="px-3 pb-4 pt-2 border-t" style={{ borderColor: "rgba(125,212,248,0.1)" }}>

                    {/* Clock card */}
                    <div
                        className="flex items-center justify-between rounded-xl px-3 py-2.5"
                        style={{
                            background: "rgba(125,212,248,0.06)",
                            border: "1px solid rgba(125,212,248,0.12)",
                        }}
                    >
                        <div className="flex flex-col gap-0.5">
                            <span
                                id="sidebar-clock"
                                className="text-lg font-medium tabular-nums"
                                style={{ color: "#F0F9FF", letterSpacing: "0.5px" }}
                            >
                                --:--:--
                            </span>
                            <span
                                id="sidebar-date"
                                className="text-[11px]"
                                style={{ color: "rgba(125,212,248,0.6)" }}
                            >
                                --- --, ----
                            </span>
                        </div>

                        {/* Logout — compact icon button */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            title="Log out"
                            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                            style={{
                                border: "1px solid rgba(125,212,248,0.15)",
                                background: "transparent",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                                const svg = e.currentTarget.querySelector("svg") as SVGElement | null;
                                if (svg) svg.style.stroke = "#fca5a5";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = "rgba(125,212,248,0.15)";
                                const svg = e.currentTarget.querySelector("svg") as SVGElement | null;
                                if (svg) svg.style.stroke = "rgba(240,249,255,0.4)";
                            }}
                        >
                            <svg
                                className="w-4 h-4 shrink-0"
                                fill="none"
                                stroke="rgba(240,249,255,0.4)"
                                strokeWidth={1.8}
                                viewBox="0 0 24 24"
                                style={{ transition: "stroke 0.2s" }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>

                    {/* Status row */}
                    <div className="flex items-center gap-1.5 mt-2 px-0.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                                backgroundColor: "#4ade80",
                                boxShadow: "0 0 4px rgba(74,222,128,0.5)",
                            }}
                        />
                        <span className="text-[10px]" style={{ color: "rgba(125,212,248,0.35)" }}>
                            System online · Admin Panel
                        </span>
                        <span className="ml-auto text-[10px]" style={{ color: "rgba(125,212,248,0.2)" }}>
                            v1.0
                        </span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AppSidebar;