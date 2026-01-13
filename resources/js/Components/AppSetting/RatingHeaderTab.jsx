import React from "react";

function RatingHeaderTab({ data, setData, errors, isLocked }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label
                    htmlFor="category_header"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                    Category Header
                </label>
                <input
                    type="text"
                    name="category_header"
                    id="category_header"
                    placeholder="Enter Category Header"
                    value={data.category_header}
                    onChange={(e) =>
                        setData("category_header", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    disabled={isLocked}
                    autoComplete="off"
                />
                {errors.category_header && (
                    <div className="text-red-500 text-sm mt-1">
                        {errors.category_header}
                    </div>
                )}
            </div>
            <div>
                <label
                    htmlFor="subcategory_header"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                    Subcategory Header
                </label>
                <input
                    type="text"
                    name="subcategory_header"
                    id="subcategory_header"
                    placeholder="Enter Subcategory Header"
                    value={data.subcategory_header}
                    onChange={(e) =>
                        setData("subcategory_header", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    disabled={isLocked}
                    autoComplete="off"
                />
                {errors.subcategory_header && (
                    <div className="text-red-500 text-sm mt-1">
                        {errors.subcategory_header}
                    </div>
                )}
            </div>
            <div className="">
                <label
                    htmlFor="rating_header"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                    Rating Header
                </label>
                <input
                    type="text"
                    name="rating_header"
                    id="rating_header"
                    placeholder="Enter Rating Header"
                    value={data.rating_header}
                    onChange={(e) => setData("rating_header", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    disabled={isLocked}
                    autoComplete="off"
                />
                {errors.rating_header && (
                    <div className="text-red-500 text-sm mt-1">
                        {errors.rating_header}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RatingHeaderTab;
