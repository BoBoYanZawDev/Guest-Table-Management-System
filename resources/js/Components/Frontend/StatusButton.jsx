import { router } from "@inertiajs/react";
import { Modal } from "antd";
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

    function confirmToggle() {
        Modal.confirm({
            title: checked ? "Mark as Absent?" : "Mark as Present?",
            content: checked
                ? "This guest will be set to Not Yet."
                : "This guest will be set to Present.",
            okText: "Confirm",
            cancelText: "Cancel",
            onOk: toggleStatus,
        });
    }

    return (
        <button
            type="button"
            onClick={confirmToggle}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
                checked ? "bg-green-500 text-white font-semibold" : "bg-white"
            }`}
        >
            {checked ? "Present" : "Not Yet"}
        </button>
    );
}

export default StatusButton;
