import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Form, usePage } from "@inertiajs/react";
import { MenuOutlined } from "@ant-design/icons";
import { MoonStar, Sun } from "lucide-react";

const AdminLayout = ({ children, title, actions }) => {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [theme, setTheme] = useState("light");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const stored =
            typeof window !== "undefined"
                ? window.localStorage.getItem("theme")
                : null;
        const initial =
            stored ||
            (window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light");
        setTheme(initial);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        window.localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
        <div className="min-h-dvh w-full bg-gray-100 dark:bg-gray-900">
            <div className="flex">
                {/* Desktop sidebar */}
                <div
                    className={`hidden md:block transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:self-start ${
                        isSidebarCollapsed ? "w-16" : "w-64"
                    }`}
                >
                    <Sidebar
                        collapsed={isSidebarCollapsed}
                        onToggleCollapse={() =>
                            setIsSidebarCollapsed((prev) => !prev)
                        }
                    />
                </div>

                {/* Mobile sidebar overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 flex md:hidden"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className="fixed inset-0 bg-black/40"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <div className="relative z-50 min-h-full md:w-72 w-50 bg-white shadow-xl">
                            <div className="h-full overflow-y-auto">
                                <Sidebar />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main column */}
                <div className="flex-1 min-h-screen flex flex-col">
                    <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-30">
                        <div className="max-w-8xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {/* Mobile menu button */}
                                    <button
                                        type="button"
                                        className="pointer md:hidden inline-flex items-center justify-center rounded-full p-3 bg-slate-100 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none "
                                        onClick={() =>
                                            setIsSidebarOpen(!isSidebarOpen)
                                        }
                                        aria-label="Open sidebar"
                                    >
                                        {/* Bars icon */}
                                        <MenuOutlined className="w-4 h-4" />
                                    </button>
                                    {/* <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-slate-100 truncate">{title || 'Admin'}</h1> */}
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Actions slot */}
                                    {actions}
                                    {/* Theme toggle */}
                                    <button
                                        type="button"
                                        onClick={toggleTheme}
                                        className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 dark:text-indigo-600 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-100 "
                                        aria-label="Toggle theme"
                                        title={
                                            theme === "dark"
                                                ? "Switch to light mode"
                                                : "Switch to dark mode"
                                        }
                                    >
                                        {theme === "dark" ? (
                                            // Sun icon
                                            // <Icon
                                            //     key="dark-mode-icon"
                                            //     icon="line-md:sunny-outline-loop"
                                            //     width="22"
                                            // />
                                            <Sun className="w-4 h-4" />
                                        ) : (
                                            // Moon icon
                                            <MoonStar className="w-4 h-4" />
                                            // <Icon
                                            //     key="light-mode-icon"
                                            //     icon="line-md:sunny-outline-to-moon-loop-transition"
                                            //     width="22"
                                            // />
                                        )}
                                    </button>
                                    {/* User dropdown menu */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 flex items-center justify-center font-semibold select-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onClick={() =>
                                                setDropdownOpen((open) => !open)
                                            }
                                            aria-haspopup="true"
                                            // aria-expanded={
                                            //     dropdownOpen ? "true" : "false"
                                            // }
                                            id="user-menu-button"
                                        >
                                            <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 flex items-center justify-center font-semibold select-none">
                                                {auth.user?.name
                                                    ? auth.user.name
                                                          .charAt(0)
                                                          .toUpperCase()
                                                    : "A"}
                                            </div>
                                        </button>
                                        {dropdownOpen && (
                                            <div
                                                className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50"
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="user-menu-button"
                                            >
                                                <div className="py-2">
                                                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-300 font-semibold">
                                                        Welcome!
                                                    </div>
                                                    <div className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                                        <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 rounded-full p-1 mr-1">
                                                            {/* Person icon */}
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"
                                                                />
                                                            </svg>
                                                        </span>
                                                        <span className="text-sm">
                                                            {auth.user?.name
                                                                ? auth.user.name
                                                                      .charAt(0)
                                                                      .toUpperCase() +
                                                                  auth.user.name.slice(
                                                                      1
                                                                  )
                                                                : "User"}
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-gray-200 dark:border-slate-700 my-1" />
                                                    <Form
                                                        method="POST"
                                                        action={route("logout")}
                                                        className="px-2"
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="text-sm w-full flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded px-2 py-2 text-left"
                                                        >
                                                            {/* Logout icon */}
                                                            <svg
                                                                width="18"
                                                                height="18"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M16 13v-2H7V8l-5 4 5 4v-3h9Zm3-9H5a2 2 0 0 0-2 2v4h2V6h14v12H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
                                                                />
                                                            </svg>
                                                            <span>Logout</span>
                                                        </button>
                                                    </Form>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1">
                        <div className="max-w-8xl mx-auto px-3 py-6 sm:px-6 lg:px-3">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
