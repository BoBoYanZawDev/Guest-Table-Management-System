import React, { useEffect, useState } from "react";
import { Select, message } from "antd";
import { router } from "@inertiajs/react";

function MoveModal({ open, onClose, tables, selectedGuest }) {
    const [q, setQ] = useState("");
    const [results, setResults] = useState([]);
    const [moving, setMoving] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [toTableId, setToTableId] = useState("");

    useEffect(() => {
        if (!open) return;
        setQ("");
        setResults([]);
        setToTableId("");
    }, [open]);

    // search inside modal (JSON route)
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(async () => {
            if (!q.trim()) {
                setResults([]);
                return;
            }
            try {
                const res = await fetch(route("planner.search.json", { q }), {
                    headers: { Accept: "application/json" },
                });
                const data = await res.json();
                setResults(data.data || []);
            } catch (e) {
                setResults([]);
            }
        }, 250);
        return () => clearTimeout(t);
    }, [q, open]);

    function showMoveError(errors) {
        const firstError =
            errors?.to_table_id ||
            errors?.guest_id ||
            errors?.seat_no ||
            errors?.name;
        messageApi.error(firstError || "Unable to move guest.");
    }

    function moveSelectedGuest() {
        if (!selectedGuest) return;

        setMoving(true);
        router.post(
            route("planner.move"),
            {
                guest_id: selectedGuest.id,
                to_table_id: toTableId || null, // empty => auto
                reason: "manual_move",
            },
            {
                preserveScroll: true,
                onFinish: () => setMoving(false),
                onSuccess: () => {
                    messageApi.success("Guest moved successfully.");
                    onClose();
                },
                onError: showMoveError,
            }
        );
    }

    // Optional: Move another searched guest quickly (if you want)
    function moveGuestFromSearch(g) {
        setMoving(true);
        router.post(
            route("planner.move"),
            {
                guest_id: g.id,
                to_table_id: toTableId || null,
                reason: "manual_move",
            },
            {
                preserveScroll: true,
                onFinish: () => setMoving(false),
                onSuccess: () => {
                    messageApi.success("Guest moved successfully.");
                    onClose();
                },
                onError: showMoveError,
            }
        );
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 mt-0">
            {contextHolder}
            <div className="bg-white w-full max-w-2xl rounded-2xl border p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-lg">Guest Detail / Move</div>
                    <button
                        className="px-3 py-1 rounded-lg border"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

                {/* Selected guest */}
                <div className="border rounded-xl p-3">
                    <div className="font-semibold">
                        Selected: {selectedGuest?.name || "-"}
                    </div>
                    <div className="text-sm text-gray-600">
                        (Name only system — duplicates possible)
                    </div>
                </div>

                {/* Move controls */}
                <div className="flex flex-wrap gap-2 items-center">
                    <label className="text-sm font-semibold">
                        Move to table:
                    </label>
                    <Select
                        value={toTableId}
                        onChange={(value) => setToTableId(value)}
                        placeholder="Auto (any free seat)"
                        className="min-w-[220px]"
                        size="large"
                        options={[
                            { value: "", label: "Auto (any free seat)" },
                            ...tables.map((t) => ({
                                value: t.id,
                                label: t.name,
                            })),
                        ]}
                        showSearch
                        optionFilterProp="label"
                    />

                    <button
                        onClick={moveSelectedGuest}
                        disabled={!selectedGuest || moving}
                        className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
                    >
                        Move
                    </button>
                </div>

                {/* Search feature inside modal */}
                {/* <div className="border rounded-2xl p-3 space-y-2">
                    <div className="font-semibold">Search Guest (optional)</div>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Type guest name..."
                        className="w-full border rounded-xl px-4 py-3"
                    />

                    <div className="max-h-56 overflow-auto space-y-2">
                        {results.map((g) => {
                            const tableName = g.assignment?.table?.name || "-";
                            const seatNo = g.assignment?.seat?.seat_no || "-";
                            return (
                                <div
                                    key={g.id}
                                    className="flex items-center justify-between border rounded-xl p-2"
                                >
                                    <div>
                                        <div className="font-semibold">
                                            {g.name}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {tableName} / Seat {seatNo} /{" "}
                                            {g.checked_in
                                                ? "Present"
                                                : "Absent"}
                                        </div>
                                    </div>
                                    <button
                                        className="px-3 py-1 rounded-lg border"
                                        disabled={moving}
                                        onClick={() => moveGuestFromSearch(g)}
                                    >
                                        Move this
                                    </button>
                                </div>
                            );
                        })}
                        {!q.trim() ? (
                            <div className="text-sm text-gray-500">
                                Type to search...
                            </div>
                        ) : results.length === 0 ? (
                            <div className="text-sm text-gray-500">
                                No results
                            </div>
                        ) : null}
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default MoveModal;
