import { useState } from "react";

const mmk = new Intl.NumberFormat("en-US");

const getStatus = (p) => {
    if (p >= 100) return "HIT";
    if (p >= 90) return "NEAR";
    return "MISS";
};

export default function MonthAccordion({ month }) {
    const [open, setOpen] = useState(false);

    const primaryTarget =
        month.targets.find((t) => t.title === "Target 1") || month.targets[0];
    const targetTotal = primaryTarget ? primaryTarget.target : 0;
    const saleTotal = primaryTarget ? primaryTarget.sale : 0;
    const perf = targetTotal ? (saleTotal / targetTotal) * 100 : 0;
    const gap = saleTotal - targetTotal;
    const status = getStatus(perf);

    return (
        <div className="mb-3 rounded-xl bg-white shadow mt-3 transition-all">
            {/* HEADER */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 text-left"
            >
                <div className="font-semibold">{month.monthLabel}</div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        Target (1) -{" "}
                        <span className="font-mono">
                            {mmk.format(targetTotal)}
                        </span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        Sales -{" "}
                        <span className="font-mono">
                            {mmk.format(saleTotal)}
                        </span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        Perf -{" "}
                        <span className="font-semibold">
                            {Math.floor(perf)}%
                        </span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        Gap -
                        <span
                            className={`font-mono font-semibold ${
                                gap < 0 ? "text-red-600" : "text-green-600"
                            }`}
                        >
                            {/* {gap < 0 ? "-" : ""} */}
                            {mmk.format(Math.abs(gap))}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                            status === "HIT"
                                ? "bg-green-500"
                                : status === "NEAR"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                    >
                        {status}
                    </span>
                    <span
                        className={`inline-flex items-center transition-transform duration-200 ${
                            open ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden="true"
                    >
                        <svg
                            className="h-5 w-5 text-slate-500"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M6 8l4 4 4-4" strokeLinecap="round" />
                        </svg>
                    </span>
                </div>
            </button>

            {/* BODY */}
            {open && (
                <div className="px-4 pb-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b text-slate-500 bg-slate-100">
                                <tr>
                                    <th className="py-2 text-left">#</th>
                                    <th className="text-left">Title</th>
                                    <th className="text-left">Target</th>
                                    <th className="text-left">Sales</th>
                                    <th className="text-left">Performance</th>
                                    <th className="text-center">Gap</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {month.targets.map((t, i) => {
                                    const p = t.target
                                        ? (t.sale / t.target) * 100
                                        : 0;
                                    const g = t.sale - t.target;
                                    const st = getStatus(p);

                                    return (
                                        <tr
                                            key={i}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-2 text-slate-400">
                                                {i + 1}
                                            </td>
                                            <td>{t.title}</td>
                                            <td className="text-left font-mono">
                                                {mmk.format(t.target)}
                                            </td>
                                            <td className="text-left font-mono">
                                                {mmk.format(t.sale)}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-full rounded bg-slate-200">
                                                        <div
                                                            className={`h-2 rounded ${
                                                                st === "HIT"
                                                                    ? "bg-green-500"
                                                                    : st ===
                                                                      "NEAR"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-red-500"
                                                            }`}
                                                            style={{
                                                                width: `${Math.min(
                                                                    p,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-10 text-right font-mono">
                                                        {Math.floor(p)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td
                                                className={`text-center font-mono font-semibold ${
                                                    g < 0
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                {g < 0 ? "-" : ""}
                                                {mmk.format(Math.abs(g))}
                                            </td>
                                            <td className="text-center">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs text-white ${
                                                        st === "HIT"
                                                            ? "bg-green-500"
                                                            : st === "NEAR"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                                >
                                                    {st}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
