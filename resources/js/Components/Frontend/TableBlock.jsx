import React, { useEffect, useMemo, useRef, useState } from "react";
import StatusButton from "@/Components/Frontend/StatusButton";
import { router } from "@inertiajs/react";

function TableBlock({ table, onClickGuest, focusedGuestId }) {
  const seats = useMemo(() => {
    const sorted = (table.seats || []).slice().sort((a, b) => a.seat_no - b.seat_no);
    return sorted;
  }, [table]);

  const rowRefs = useRef(new Map());
  const [editingSeatNo, setEditingSeatNo] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [saving, setSaving] = useState(false);

  const bodyMaxHeight = useMemo(() => {
    const capacity = table.capacity || seats.length || 0;
    const rowHeight = 36;
    const minHeight = 250;
    const maxHeight = 1000;
    return Math.min(maxHeight, Math.max(minHeight, capacity * rowHeight));
  }, [table, seats.length]);

  useEffect(() => {
    if (!focusedGuestId) return;
    const el = rowRefs.current.get(focusedGuestId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusedGuestId]);

  function startAdd(seatNo) {
    setEditingSeatNo(seatNo);
    setGuestName("");
  }

  function cancelAdd() {
    setEditingSeatNo(null);
    setGuestName("");
  }

  function saveGuest() {
    if (!guestName.trim()) return;
    setSaving(true);
    router.post(
      route("planner.guests.store"),
      {
        name: guestName.trim(),
        table_id: table.id,
        seat_no: editingSeatNo,
      },
      {
        preserveScroll: true,
        onFinish: () => setSaving(false),
        onSuccess: () => cancelAdd(),
      }
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
      {/* Title */}
      <div className="text-center font-bold py-3 border-b border-black/10">
        {table.name}
      </div>

      {/* Header */}
      <div className="grid grid-cols-[60px_1fr_120px] border-b border-black/10 text-sm font-semibold">
        <div className="p-2 border-r border-black/10">No</div>
        <div className="p-2 border-r border-black/10">Name</div>
        <div className="p-2">Status</div>
      </div>

      {/* Rows */}
      <div className="overflow-auto" style={{ maxHeight: bodyMaxHeight }}>
        {seats.map((s) => {
          const g = s.assignment?.guest || null;
          const isFocused = g && g.id === focusedGuestId;
          const isEditing = !g && editingSeatNo === s.seat_no;
          return (
            <div
              key={s.id}
              ref={(el) => {
                if (g?.id && el) rowRefs.current.set(g.id, el);
              }}
              className={`grid grid-cols-[60px_1fr_120px] border-b border-black/10 text-sm ${
                isFocused ? "bg-amber-50" : ""
              }`}
            >
              <div className="p-2 border-r border-black/10">{s.seat_no}</div>

              {g ? (
                <button
                  type="button"
                  onClick={() => g && onClickGuest(g)}
                  className="p-2 text-left border-r border-black/10 hover:bg-gray-50 cursor-pointer"
                  title="Click to open modal"
                >
                  {g.name}
                </button>
              ) : isEditing ? (
                <div className="p-2 border-r border-black/10">
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Guest name"
                    className="w-full rounded-md border border-black/10 px-2 py-1 text-sm"
                  />
                </div>
              ) : (
                <div className="p-2 border-r border-black/10 text-gray-400">
                  Empty
                </div>
              )}

              <div className="p-2">
                {g ? (
                  <StatusButton guest={g} />
                ) : isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={saveGuest}
                      disabled={saving || !guestName.trim()}
                      className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelAdd}
                      disabled={saving}
                      className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startAdd(s.seat_no)}
                    className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TableBlock;
