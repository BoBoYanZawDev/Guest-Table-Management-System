import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import nav from "../Layouts/nav.json";
const Sidebar = ({ collapsed = false, onToggleCollapse }) => {
    const { url, props } = usePage();
    const currentPath = url.split("?")[0];
    const currentRole = props?.auth?.user?.role;
    const { company } = usePage().props;
    const canView = (item) => {
        if (!item?.roles || item.roles.length === 0) {
            return true;
        }
        return item.roles.includes(currentRole);
    };

    const safeRoute = (name) => {
        try {
            return new URL(route(name)).pathname;
        } catch (e) {
            return "#";
        }
    };
    return (
        <aside className="sticky top-0 h-full flex flex-col border-r border-gray-200 bg-white text-gray-900 dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 dark:text-white">
            <div
                className={`px-2 pb-2 pt-3 border-b border-gray-200 dark:border-slate-700 flex items-center ${
                    collapsed ? "justify-center" : "justify-between"
                }`}
            >
                <div className="flex flex-col items-center justify-center flex-1">
                    <div className="mb-1 flex justify-center w-full mt-2">
                        <img
                            src={
                                company?.logo ? company.logo : "/linn_logo.png"
                            }
                            alt="Linn Logo"
                            className={`object-contain w-20 ${
                                collapsed ? "w-10 hidden" : "md:w-[40%] "
                            }`}
                        />
                    </div>
                    {!collapsed && (
                        <div className="text-sm font-bold text-gray-500 dark:text-slate-300 text-center">
                            Table Management System
                        </div>
                    )}
                </div>
                {onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-white"
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`h-4 w-4 transition-transform ${
                                collapsed ? "rotate-180" : ""
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <nav
                className={`flex-1 px-2 py-4 space-y-1 overflow-y-auto ${
                    collapsed ? "items-center" : ""
                }`}
            >
                {nav.map((item) => {
                    if (!canView(item)) return null;

                    const matchHref = safeRoute(item.route);
                    const isActiveTop =
                        matchHref === "/admin"
                            ? currentPath === "/admin" //
                            : currentPath === matchHref ||
                              currentPath.startsWith(matchHref + "/");

                    const baseClasses = `flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                        collapsed ? "justify-center px-2" : ""
                    }`;
                    const activeTopClasses = isActiveTop
                        ? "bg-gray-200 text-gray-900 dark:bg-slate-900 dark:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-slate-700 dark:hover:text-white  dark:bg-slate-800 bg-slate-50";

                    const visibleChildren =
                        item.children?.filter(canView) || [];

                    if (
                        item.children &&
                        Array.isArray(item.children) &&
                        visibleChildren.length > 0
                    ) {
                        return (
                            <div key={item.name} className="space-y-1">
                                {!collapsed && (
                                    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-300">
                                        {item.name}
                                    </div>
                                )}
                                <div
                                    className={`space-y-1 ${
                                        collapsed ? "px-0" : "pl-2"
                                    }`}
                                >
                                    {visibleChildren.map((child) => {
                                        const childHref = safeRoute(
                                            child.route
                                        );
                                        let isActive = false;
                                        const ignoreActiveFor = [
                                            "sale_report.create",
                                        ];

                                        if (
                                            !ignoreActiveFor.includes(
                                                child.route
                                            )
                                        ) {
                                            isActive =
                                                url.split("?")[0] === childHref;
                                        } else {
                                            isActive =
                                                url === childHref ||
                                                currentPath.startsWith(
                                                    childHref
                                                );
                                        }

                                        const childBase = `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                            collapsed
                                                ? "justify-center px-2"
                                                : ""
                                        }`;
                                        const childClasses = isActive
                                            ? "bg-gray-200 text-gray-900 dark:bg-slate-900 dark:text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-slate-700 dark:hover:text-white dark:bg-slate-800 bg-slate-50";
                                        return (
                                            <Link
                                                key={child.name}
                                                prefetch="click"
                                                href={childHref}
                                                className={`${childBase} ${childClasses}`}
                                                title={child.name}
                                            >
                                                {child.icon &&
                                                    child.icon_type && (
                                                        <FontAwesomeIcon
                                                            className="me-1"
                                                            icon={[
                                                                child.icon_type,
                                                                child.icon,
                                                            ]}
                                                        />
                                                    )}
                                                {!collapsed && child.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <Link
                            prefetch="click"
                            key={item.name}
                            href={matchHref}
                            className={`${baseClasses} ${activeTopClasses}`}
                            title={item.name}
                        >
                            {item.icon && item.icon_type && (
                                <FontAwesomeIcon
                                    className="me-1"
                                    icon={[item.icon_type, item.icon]}
                                />
                            )}
                            {!collapsed && item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 py-4 border-t border-gray-200 text-sm text-gray-500 dark:border-slate-700 dark:text-slate-300 text-center">
                {!collapsed && (
                    <div>
                        © {new Date().getFullYear()}. Developed By Linn R&D
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
