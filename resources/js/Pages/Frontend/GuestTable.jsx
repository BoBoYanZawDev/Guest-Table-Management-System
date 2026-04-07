import React, { useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlashMessage from "@/Components/FlashMessage";
import MoveModal from "@/Components/Frontend/MoveModal";
import TableBlock from "@/Components/Frontend/TableBlock";

export default function GuestTable() {
    const { tables = [] } = usePage().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [query, setQuery] = useState("");
    const [focusedGuestId, setFocusedGuestId] = useState(null);
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

    const stats = useMemo(() => {
        const totalTables = tables.length;
        const totalSeats = tables.reduce(
            (sum, t) => sum + (t.capacity || t.seats?.length || 0),
            0
        );
        const assigned = tables.reduce((sum, t) => {
            const seats = t.seats || [];
            return (
                sum +
                seats.reduce(
                    (seatSum, s) => seatSum + (s.assignment?.guest ? 1 : 0),
                    0
                )
            );
        }, 0);
        const blankSeats = totalSeats - assigned;

        return { totalTables, totalSeats, assigned, blankSeats };
    }, [tables]);

    const searchResults = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        const results = [];
        tables.forEach((t) => {
            (t.seats || []).forEach((s) => {
                const g = s.assignment?.guest;
                if (!g?.name) return;
                if (g.name.toLowerCase().includes(q)) {
                    results.push({
                        id: g.id,
                        name: g.name,
                        tableName: t.name,
                        seatNo: s.seat_no,
                        checkedIn: !!g.checked_in,
                    });
                }
            });
        });
        return results.slice(0, 20);
    }, [tables, query]);
    const visibleTables = useMemo(() => {
        if (!showOnlyAvailable) return tables;
        return tables.filter((t) =>
            (t.seats || []).some((s) => !s.assignment?.guest)
        );
    }, [tables, showOnlyAvailable]);

    function openGuest(g) {
        setSelectedGuest(g);
        setModalOpen(true);
    }

    function focusGuest(guestId) {
        setFocusedGuestId(null);
        setTimeout(() => setFocusedGuestId(guestId), 0);
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <>
            <Head title="Guest Table" />
            <div className="min-h-screen  px-4 py-8 bg-sky-50 ">
                <div className="mx-auto max-w-7xl space-y-3">
                    <div className="flex justify-center">
                        <img
                            src="/login_icont.png"
                            alt="logo"
                            className="h-16 w-auto"
                        />
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                                Guest Table Planner
                                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                            </div>
                            {/* <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Seating overview
            </h1>
            <p className="text-sm text-gray-600">
              Tap a guest name to move or update check-in status.
            </p> */}
                        </div>
                        {/* <div className="flex flex-wrap gap-2">
            <a
              className="rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
              href={route("planner.checkin")}
            >
              Check-in Page
            </a>
          </div> */}
                    </div>

                    <FlashMessage />

                    <div className="grid gap-3 md:grid-cols-4 grid-cols-2">
                        <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                            <div className="text-xs font-semibold uppercase text-gray-500">
                                Tables
                            </div>
                            <div className="text-2xl font-bold">
                                {stats.totalTables}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                            <div className="text-xs font-semibold uppercase text-gray-500">
                                Seats
                            </div>
                            <div className="text-2xl font-bold">
                                {stats.totalSeats}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                            <div className="text-xs font-semibold uppercase text-gray-500">
                                Assigned
                            </div>
                            <div className="text-2xl font-bold">
                                {stats.assigned}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                            <div className="text-xs font-semibold uppercase text-gray-500">
                                Blank Seats
                            </div>
                            <div className="text-2xl font-bold">
                                {stats.blankSeats}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-white/70 p-4 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm font-semibold">
                                    Search guest
                                </div>
                                <div className="text-xs text-gray-500">
                                    Scrolls to the guest row inside the table.
                                </div>
                            </div>
                            <div className="flex w-full max-w-md items-center gap-2">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type guest name..."
                                    className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                                />
                                {query && (
                                    <button
                                        className="rounded-full  bg-yellow-400 border border-black/10 px-3 py-2 text-xs font-semibold"
                                        onClick={() => {
                                            setQuery("");
                                            setFocusedGuestId(null);
                                        }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <label className="inline-flex items-center gap-2 text-xs font-semibold">
                                <input
                                    type="checkbox"
                                    checked={showOnlyAvailable}
                                    onChange={(e) =>
                                        setShowOnlyAvailable(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-black/20"
                                />
                                Show only tables with blank seats
                            </label>
                        </div>

                        {query && (
                            <div className="mt-3 max-h-56 space-y-2 overflow-auto rounded-2xl border border-black/5 bg-white/80 p-2">
                                {searchResults.length === 0 ? (
                                    <div className="p-3 text-sm text-gray-500">
                                        No results
                                    </div>
                                ) : (
                                    searchResults.map((g) => (
                                        <button
                                            key={g.id}
                                            onClick={() => focusGuest(g.id)}
                                            className="flex w-full items-center justify-between rounded-xl border border-black/5 bg-white px-3 py-2 text-left text-sm hover:bg-gray-50"
                                        >
                                            <div>
                                                <div className="font-semibold">
                                                    {g.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {g.tableName} • Seat{" "}
                                                    {g.seatNo}
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold">
                                                {g.checkedIn
                                                    ? "Present"
                                                    : "Absent"}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-white/70 p-2 shadow-sm">
                        <div
                            className="grid gap-3 md:grid-cols-2"
                            // style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
                        >
                            {visibleTables.length === 0 ? (
                                <div className="md:col-span-2 flex justify-center py-8">
                                    <Empty description="No tables available" />
                                </div>
                            ) : (
                                visibleTables.map((t) => (
                                    <TableBlock
                                        key={t.id}
                                        table={t}
                                        onClickGuest={openGuest}
                                        focusedGuestId={focusedGuestId}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 rounded-full border border-black/10 bg-white/90 p-3 text-xs font-semibold shadow-md hover:bg-white"
                    aria-label="Scroll to top"
                >
                    <FontAwesomeIcon icon="fa-solid fa-arrow-up" />
                </button>
            </div>
                <MoveModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    tables={tables}
                    selectedGuest={selectedGuest}
                />
        </>
    );
}
