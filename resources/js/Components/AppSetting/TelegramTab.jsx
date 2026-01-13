import React from "react";

function TelegramTab({ data, setData, errors, isLocked }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label
                    htmlFor="bot_token"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                    Bot Token
                </label>
                <input
                    type="text"
                    name="bot_token"
                    id="bot_token"
                    placeholder="Enter Bot Token"
                    value={data.bot_token}
                    onChange={(e) => setData("bot_token", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    disabled={isLocked}
                    autoComplete="off"
                />
                {errors.bot_token && (
                    <div className="text-red-500 text-sm mt-1">
                        {errors.bot_token}
                    </div>
                )}
            </div>
            <div>
                <label
                    htmlFor="chat_id"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                    Chat ID
                </label>
                <input
                    type="text"
                    name="chat_id"
                    id="chat_id"
                    placeholder="Enter Chat ID"
                    value={data.chat_id}
                    onChange={(e) => setData("chat_id", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    disabled={isLocked}
                    autoComplete="off"
                />
                {errors.chat_id && (
                    <div className="text-red-500 text-sm mt-1">
                        {errors.chat_id}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TelegramTab;
