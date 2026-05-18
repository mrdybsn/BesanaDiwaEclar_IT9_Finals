import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHeader } from "../contexts/HeaderContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useNotification } from "../contexts/NotificationContext";

const notificationColors: Record<string, string> = {
    low_stock: "text-red-600",
    jug_debt: "text-yellow-600",
    delivery: "text-blue-600",
    payment: "text-green-600",
    off_route: "text-orange-600",
};

const notificationLabels: Record<string, string> = {
    low_stock: "Low Stock",
    jug_debt: "Jug Debt",
    delivery: "Delivery",
    payment: "Payment",
    off_route: "Off Route",
};

// Notification page path per role — update once AuthContext is wired
const getNotifPath = (pathname: string) => {
    if (pathname.startsWith("/admin")) return "/admin/notifications";
    if (pathname.startsWith("/cashier")) return "/cashier/notifications";
    if (pathname.startsWith("/rider")) return "/rider/notifications";
    return "/notifications";
};

const AppHeader = () => {
    const { isOpen, toggleUserMenu } = useHeader();
    const { toggleSidebar } = useSidebar();
    const { notifications, unreadCount, markRead, markAllRead } = useNotification();

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const navigate = useNavigate();

    const toggleNotifications = () => setIsNotificationOpen((prev) => !prev);

    const recentNotifications = notifications.slice(0, 5);

    const handleViewAll = () => {
        setIsNotificationOpen(false);
        const path = getNotifPath(window.location.pathname);
        navigate(path);
    };

    return (
        <>
            {(isOpen || isNotificationOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        if (isOpen) toggleUserMenu();
                        if (isNotificationOpen) setIsNotificationOpen(false);
                    }}
                />
            )}

            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">

                        {/* Left — Logo + Sidebar Toggle */}
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                type="button"
                                onClick={toggleSidebar}
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                                </svg>
                            </button>
                            <a href="#" className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Soldier's Thirst
                                </span>
                            </a>
                        </div>

                        {/* Right — Notifications + User Menu */}
                        <div className="flex items-center space-x-3">

                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={toggleNotifications}
                                    className="relative p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>

                                    {/* Unread badge */}
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center dark:border-gray-800">
                                            <span className="text-white text-[9px] font-bold leading-none">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                <div className={`absolute right-0 top-11 w-80 z-50 ${
                                    isNotificationOpen ? "block" : "hidden"
                                } bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600`}>

                                    {/* Dropdown Header */}
                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg dark:bg-gray-700">
                                        <span className="font-medium text-sm text-gray-700 dark:text-white">
                                            Notifications
                                            {unreadCount > 0 && (
                                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </span>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAllRead();
                                                }}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    {/* Notification Items */}
                                    <div className="divide-y divide-gray-100 dark:divide-gray-600 max-h-80 overflow-y-auto">
                                        {recentNotifications.length === 0 ? (
                                            <p className="px-4 py-6 text-sm text-center text-gray-400">
                                                No notifications.
                                            </p>
                                        ) : (
                                            recentNotifications.map((notif) => (
                                                <div
                                                    key={notif.notification_id}
                                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                                                        !notif.is_read ? "bg-blue-50" : ""
                                                    }`}
                                                >
                                                    {/* Unread dot */}
                                                    <div className="mt-1.5 shrink-0">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            !notif.is_read ? "bg-blue-500" : "bg-transparent"
                                                        }`} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-semibold mb-0.5 ${notificationColors[notif.type]}`}>
                                                            {notificationLabels[notif.type]}
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {notif.created_at}
                                                        </p>
                                                    </div>

                                                    {!notif.is_read && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markRead(notif.notification_id);
                                                            }}
                                                            className="text-xs text-blue-600 hover:underline shrink-0 mt-1"
                                                        >
                                                            Read
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* View All */}
                                    <button
                                        type="button"
                                        onClick={handleViewAll}
                                        className="block w-full py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center ms-3">
                                <button
                                    type="button"
                                    onClick={toggleUserMenu}
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        alt="user photo"
                                    />
                                </button>

                                <div className={`absolute right-8 top-9 min-w-50 z-50 ${
                                    isOpen ? "block" : "hidden"
                                } my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow dark:bg-gray-700 dark:divide-gray-600`}>
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            Neil Sims
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            neil.sims@flowbite.com
                                        </p>
                                    </div>
                                    <ul className="p-2 text-sm font-medium" role="none">
                                        <li>
                                            <Link
                                                to="#"
                                                className="inline-flex items-center w-full p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-600"
                                                role="menuitem"
                                            >
                                                Sign out
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default AppHeader;