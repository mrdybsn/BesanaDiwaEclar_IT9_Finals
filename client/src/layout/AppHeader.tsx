import { Link } from "react-router-dom";
import { useHeader } from "../contexts/HeaderContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useState } from "react";

const AppHeader = () => {
    const { isOpen, toggleUserMenu } = useHeader();
    const { toggleSidebar } = useSidebar();

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const toggleNotifications = () => setIsNotificationOpen(!isNotificationOpen);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-40" 
                onClick={() => {
                    if (isOpen) toggleUserMenu();
                    if (isNotificationOpen) setIsNotificationOpen(false);
                }}
                ></div>
            )}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                data-drawer-target="logo-sidebar"
                                data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar"
                                type="button"
                                onClick={toggleSidebar}
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        d="M5 7h14M5 12h14M5 17h10"
                                    ></path>
                                </svg>
                            </button>
                            <a href="#" className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Soldier's Thirst
                                </span>
                            </a>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={toggleNotifications}
                                    className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                                    </svg>
                                    <div className="absolute top-2 right-2.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full dark:border-gray-800"></div>
                                </button>

                                <div className={`absolute right-0 top-10 w-80 z-50 ${isNotificationOpen ? "block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600`}>
                                    <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-700 dark:text-white">
                                        Notifications
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-600 max-h-96 overflow-y-auto">
                                        <Link to="#" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                                            <div className="w-full ps-3">
                                                <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                                    New message from <span className="font-semibold text-gray-900 dark:text-white">Bonnie Green</span>: "Hey, what's up?"
                                                </div>
                                                <div className="text-xs text-blue-600 dark:text-blue-500">a few moments ago</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <Link to="#" className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center ms-3">
                                <div>
                                    <button
                                        type="button"
                                        onClick={toggleUserMenu}
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                        aria-expanded="false"
                                        data-dropdown-toggle="dropdown-user"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                            alt="user photo"
                                        />
                                    </button>
                                </div>
                                <div
                                    className={`absolute right-8 top-9 min-w-50 z-50 ${
                                        isOpen ? "block" : "hidden"
                                    } my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm dark:bg-gray-700 dark:divide-gray-600`}
                                    id="dropdown-user"
                                >
                                    <div className="px-4 py-3" role="none">
                                        <p
                                            className="text-sm text-gray-900 dark:text-white"
                                            role="none"
                                        >
                                            Neil Sims
                                        </p>
                                        <p
                                            className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                            role="none"
                                        >
                                            neil.sims@flowbite.com
                                        </p>
                                    </div>
                                    <ul className="p-2 text-sm text-body font-medium" role="none">
                                        <li>
                                            <Link
                                                to="#"
                                                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
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