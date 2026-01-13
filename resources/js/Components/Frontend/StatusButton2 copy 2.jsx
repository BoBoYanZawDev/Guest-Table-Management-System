import { router } from "@inertiajs/react";
import { Popconfirm } from "antd";
import React from "react";

function StatusButton({ guest }) {
    const checked = !!guest?.checked_in;

    function toggleStatus() {
        router.post(
            route("planner.guests.toggle", guest.id),
            {},
            { preserveScroll: true }
        );
    }

    return (
        <button
            onClick={() =>
                router.post(
                    route("planner.guests.toggle", guest.id),
                    {},
                    { preserveScroll: true }
                )
            }
            className={`px-2 py-1 rounded-lg text-xs border   ${
                checked ? "bg-green-500 text-white font-semibold" : "bg-white"
            }`}
        >
            {checked ? "Present" : "Not Yet"}
        </button>
    );
}

export default StatusButton;
