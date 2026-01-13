import { router } from "@inertiajs/react";
import { Popconfirm } from "antd";
import React from "react";

function StatusButton({ guest }) {
    const checked = !!guest?.checked_in;

    function toggleStatus() {
        router.post(route("planner.guests.toggle", guest.id), {}, { preserveScroll: true });
    }

    // if (checked) {
    //     return (
    //         <button
    //             type="button"
    //             className="px-2 py-1 rounded-lg text-xs border bg-green-500 text-white font-semibold "
    //         >
    //             Present
    //         </button>
    //     );
    // }

    return (
        <Popconfirm
            title="Mark this guest as Present?"
            okText="Yes"
            cancelText="No"
            onConfirm={toggleStatus}
        >
            <button
                type="button"
                className="px-2 py-1 rounded-lg text-xs border bg-white hover:bg-gray-50"
            >
                Not Yet
            </button>
        </Popconfirm>
    );
}

export default StatusButton;
