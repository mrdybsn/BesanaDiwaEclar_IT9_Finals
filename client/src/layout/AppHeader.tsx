import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useHeader } from "../contexts/HeaderContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/soldiers thirst white.png";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

const formatUserName = (user: {
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    suffix_name?: string | null;
}) => {
    const parts = [user.first_name, user.middle_name?.charAt(0) ? `${user.middle_name.charAt(0)}.` : null, user.last_name, user.suffix_name].filter(Boolean);
    return parts.join(" ");
};

const roleLabel = (role: string) => (role === "admin" ? "Admin" : role === "rider" ? "Rider" : role);

// ─── Water Refilling Station Palette ─────────────────────────────────────────
// Deep Ocean   : #0B2D4E   ← sidebar / header base
// Aqua Blue    : #1A6B9A   ← mid tone
// Sky Water    : #3B9DD2   ← primary accent
// Crystal      : #7DD4F8   ← light accent / hover glow
// Foam White   : #F0F9FF   ← background / text on dark
// Ripple Gray  : #E8F4FD   ← subtle bg
// ─────────────────────────────────────────────────────────────────────────────

const notificationColors: Record<string, string> = {
    low_stock: "text-rose-400",
    jug_debt:  "text-amber-400",
    delivery:  "text-[#7DD4F8]",
    payment:   "text-emerald-400",
    off_route: "text-orange-400",
    lost_item: "text-purple-400",
    general:   "text-slate-400",
};

const notificationLabels: Record<string, string> = {
    low_stock: "Low Stock",
    jug_debt:  "Jug Debt",
    delivery:  "Delivery",
    payment:   "Payment",
    off_route: "Off Route",
    lost_item: "Lost Item",
    general:   "General",
};

const AppHeader = () => {
    const { isOpen, toggleUserMenu }                            = useHeader();
    const { toggleSidebar }                                     = useSidebar();
    const { notifications, unreadCount, markRead, markAllRead } = useNotification();
    const { user, logout } = useAuth();

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isRiderPortal = location.pathname.startsWith("/rider");

    const toggleNotifications = () => setIsNotificationOpen((prev) => !prev);
    const displayedNotifications = isRiderPortal ? notifications : notifications.slice(0, 5);

    const handleViewAll = () => {
        setIsNotificationOpen(false);
        if (!isRiderPortal) {
            navigate("/admin/notifications");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const displayName = user ? formatUserName(user) : "User";
    const avatarSrc = user?.profile_picture
        ? user.profile_picture
        : `${DEFAULT_AVATAR}${encodeURIComponent(`${user?.first_name ?? "U"} ${user?.last_name ?? ""}`)}`;
    const subtitle = user?.username ?? user?.contact_number ?? "";

    return (
        <>
            {(isOpen || isNotificationOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        if (isOpen)             toggleUserMenu();
                        if (isNotificationOpen) setIsNotificationOpen(false);
                    }}
                />
            )}

            <nav
                className="fixed top-0 z-50 w-full"
                style={{
                    background: "linear-gradient(135deg, #0B2D4E 0%, #1A6B9A 100%)",
                    boxShadow: "0 2px 20px rgba(11,45,78,0.4), 0 1px 0 rgba(125,212,248,0.15)",
                }}
            >
                <div className="px-4 py-0 lg:px-6">
                    <div className="flex items-center justify-between h-14">

                        {/* ── Left: hamburger + logo ── */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={toggleSidebar}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl sm:hidden transition-all duration-200"
                                style={{ color: "#F0F9FF", backgroundColor: "rgba(125,212,248,0.1)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(125,212,248,0.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(125,212,248,0.1)")}
                            >
                                <span className="sr-only">Toggle sidebar</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            </button>

                            <Link to={isRiderPortal ? "/rider/tasks" : "/admin/dashboard"} className="flex items-center gap-2.5 group">
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(125,212,248,0.15)", border: "1px solid rgba(125,212,248,0.3)" }}
                                >
                                    <img src={logo} alt="Soldier's Thirst" className="h-5 w-auto object-contain" />
                                </div>
                                <div className="hidden sm:flex flex-col leading-none">
                                    <span
                                        className="text-sm font-bold tracking-wide"
                                        style={{ color: "#F0F9FF", fontFamily: "'Georgia', serif", letterSpacing: "0.06em" }}
                                    >
                                        Soldier&apos;s Thirst
                                    </span>
                                    <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "#7DD4F8", opacity: 0.8 }}>
                                        Water Station
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* ── Right: bell + avatar ── */}
                        <div className="flex items-center gap-1.5">

                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={toggleNotifications}
                                    className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                                    style={{ color: "#F0F9FF", backgroundColor: "rgba(125,212,248,0.08)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(125,212,248,0.18)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(125,212,248,0.08)")}
                                >
                                    <span className="sr-only">Notifications</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span
                                            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "2px solid #0B2D4E" }}
                                        >
                                            <span className="text-white text-[9px] font-bold leading-none">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        </span>
                                    )}
                                </button>

                                {/* Notification dropdown */}
                                {isNotificationOpen && (
                                    <div
                                        className="absolute right-0 top-12 w-80 z-50 rounded-2xl overflow-hidden"
                                        style={{
                                            background: "#F0F9FF",
                                            boxShadow: "0 20px 60px rgba(11,45,78,0.3), 0 0 0 1px rgba(59,157,210,0.15)",
                                        }}
                                    >
                                        {/* header */}
                                        <div
                                            className="flex items-center justify-between px-4 py-3"
                                            style={{ background: "linear-gradient(135deg, #0B2D4E, #1A6B9A)" }}
                                        >
                                            <span className="font-semibold text-sm text-white flex items-center gap-2">
                                                Notifications
                                                {unreadCount > 0 && (
                                                    <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-bold">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </span>
                                            {unreadCount > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                                                    className="text-xs font-medium transition-colors"
                                                    style={{ color: "#7DD4F8" }}
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>

                                        {/* items */}
                                        <div className={`divide-y divide-blue-50 overflow-y-auto ${isRiderPortal ? "max-h-[min(70vh,28rem)]" : "max-h-72"}`}>
                                            {displayedNotifications.length === 0 ? (
                                                <div className="px-4 py-8 text-center">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                                                        <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm text-blue-300">No notifications</p>
                                                </div>
                                            ) : (
                                                displayedNotifications.map((notif) => (
                                                    <div
                                                        key={notif.notification_id}
                                                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                                                            !notif.is_read ? "bg-sky-50" : "hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div className="mt-1.5 shrink-0">
                                                            <div className={`w-2 h-2 rounded-full ${!notif.is_read ? "bg-sky-400" : "bg-transparent"}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs font-bold mb-0.5 ${notificationColors[notif.type] ?? "text-slate-400"}`}>
                                                                {notificationLabels[notif.type] ?? "Alert"}
                                                            </p>
                                                            <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                                                            <p className="text-[10px] text-slate-300 mt-0.5">{notif.created_at}</p>
                                                        </div>
                                                        {!notif.is_read && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); markRead(notif.notification_id); }}
                                                                className="text-xs font-medium shrink-0 mt-1 transition-colors"
                                                                style={{ color: "#1A6B9A" }}
                                                            >
                                                                Read
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {!isRiderPortal && (
                                            <button
                                                type="button"
                                                onClick={handleViewAll}
                                                className="block w-full py-3 text-sm font-semibold text-center transition-colors border-t border-blue-100"
                                                style={{ color: "#1A6B9A", backgroundColor: "#F0F9FF" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E8F4FD")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F0F9FF")}
                                            >
                                                View all notifications →
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* User avatar */}
                            <div className="relative flex items-center">
                                <button
                                    type="button"
                                    onClick={toggleUserMenu}
                                    className="flex items-center gap-2 p-1 rounded-xl transition-all duration-200"
                                    style={{ backgroundColor: "rgba(125,212,248,0.08)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(125,212,248,0.18)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(125,212,248,0.08)")}
                                >
                                    <span className="sr-only">User menu</span>
                                    <img
                                        className="w-7 h-7 rounded-lg object-cover"
                                        style={{ outline: "2px solid rgba(125,212,248,0.5)", outlineOffset: "1px" }}
                                        src={avatarSrc}
                                        alt={displayName}
                                    />
                                    <div className="hidden sm:flex flex-col items-start leading-none pr-1">
                                        <span className="text-xs font-semibold" style={{ color: "#F0F9FF" }}>
                                            {displayName}
                                        </span>
                                        <span className="text-[10px] capitalize" style={{ color: "#7DD4F8", opacity: 0.75 }}>
                                            {user ? roleLabel(user.role) : "—"}
                                        </span>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div
                                        className="absolute right-0 top-12 min-w-44 z-50 rounded-2xl overflow-hidden"
                                        style={{
                                            background: "#F0F9FF",
                                            boxShadow: "0 20px 60px rgba(11,45,78,0.25), 0 0 0 1px rgba(59,157,210,0.15)",
                                        }}
                                    >
                                        <div
                                            className="px-4 py-3"
                                            style={{ background: "linear-gradient(135deg, #0B2D4E, #1A6B9A)" }}
                                        >
                                            <p className="text-sm font-bold text-white">{displayName}</p>
                                            <p className="text-xs truncate capitalize" style={{ color: "#7DD4F8" }}>
                                                {user ? roleLabel(user.role) : "—"}
                                                {subtitle ? ` · @${subtitle}` : ""}
                                            </p>
                                        </div>
                                        <ul className="p-1.5">
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-xl font-medium transition-colors cursor-pointer"
                                                    style={{ color: "#0B2D4E" }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E8F4FD")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default AppHeader;