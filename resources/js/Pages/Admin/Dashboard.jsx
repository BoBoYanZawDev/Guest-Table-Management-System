import React, { useEffect, useRef, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import { DatePicker, Empty, Select } from "antd";
import FlashMessage from "@/Components/FlashMessage";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    CalendarDays,
    Star,
    ThumbsUp,
    Smile,
    Frown,
    Angry,
} from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const palette = [
    "rgba(16, 185, 129, 0.85)",
    "rgba(59, 130, 246, 0.85)",
    "rgba(245, 158, 11, 0.85)",
    "rgba(239, 68, 68, 0.85)",
    "rgba(99, 102, 241, 0.85)",
    "rgba(14, 165, 233, 0.85)",
    "rgba(168, 85, 247, 0.85)",
    "rgba(20, 184, 166, 0.85)",
];

const buildBarData = (labels, values, color) => ({
    labels,
    datasets: [
        {
            label: "Count",
            data: values,
            backgroundColor: color,
            borderRadius: 8,
            maxBarThickness: 60,
        },
    ],
});

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: "#64748b" },
        },
        y: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.3)" },
            ticks: { color: "#64748b", precision: 0 },
        },
    },
};

const buildPieData = (labels, values) => ({
    labels,
    datasets: [
        {
            data: values,
            backgroundColor: labels.map((_, index) => palette[index % palette.length]),
            borderColor: "#ffffff",
            borderWidth: 2,
        },
    ],
});

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom",
            labels: { color: "#475569", padding: 16 },
        },
    },
    cutout: "50%",
};

export default function Dashboard() {
    const {
        ratingSummary = { todayTotal: 0, ratings: {} },
        ratingChart = { labels: [], values: [] },
        categoryChart = { labels: [], values: [] },
        subcategoryChart = { labels: [], values: [] },
        filters: initialFilters = {},
    } = usePage().props;

    const { RangePicker } = DatePicker;
    const presets = {
        today: [dayjs().startOf("day"), dayjs().endOf("day")],
        this_month: [dayjs().startOf("month"), dayjs().endOf("month")],
        this_year: [dayjs().startOf("year"), dayjs().endOf("year")],
    };

    const detectPreset = (dates) => {
        if (!dates || dates.length !== 2) return null;
        const [start, end] = dates;
        if (start.isSame(presets.today[0], "day") && end.isSame(presets.today[1], "day")) {
            return "today";
        }
        if (
            start.isSame(presets.this_month[0], "day") &&
            end.isSame(presets.this_month[1], "day")
        ) {
            return "this_month";
        }
        if (
            start.isSame(presets.this_year[0], "day") &&
            end.isSame(presets.this_year[1], "day")
        ) {
            return "this_year";
        }
        return null;
    };
    const [range, setRange] = useState(() =>
        initialFilters?.start_date && initialFilters?.end_date
            ? [
                  dayjs(initialFilters.start_date),
                  dayjs(initialFilters.end_date),
              ]
            : [dayjs().startOf("day"), dayjs().endOf("day")]
    );
    const [presetKey, setPresetKey] = useState(() => detectPreset(range));
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (!range || range.length !== 2) return;
        const [start, end] = range;
        const params = {
            start_date: start.format("YYYY-MM-DD"),
            end_date: end.format("YYYY-MM-DD"),
        };
        const timer = setTimeout(() => {
            router.get(route("dashboard"), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [range]);

    const ratingCounts = ratingSummary?.ratings || {};
    const ratingEntries = Object.entries(ratingCounts);
    const iconCycle = [Star, ThumbsUp, Smile, Frown, Angry];
    const colorCycle = [
        { iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
        { iconBg: "bg-blue-100", iconText: "text-blue-600" },
        { iconBg: "bg-amber-100", iconText: "text-amber-600" },
        { iconBg: "bg-orange-100", iconText: "text-orange-600" },
        { iconBg: "bg-red-100", iconText: "text-red-600" },
    ];

    const cards = [
        {
            label: "Total Rating",
            value: ratingSummary?.todayTotal ?? 0,
            Icon: CalendarDays,
            iconBg: "bg-violet-100",
            iconText: "text-violet-600",
        },
        ...ratingEntries.map(([label, value], index) => {
            const Icon = iconCycle[index % iconCycle.length];
            const colors = colorCycle[index % colorCycle.length];
            return {
                label,
                value,
                Icon,
                iconBg: colors.iconBg,
                iconText: colors.iconText,
            };
        }),
    ];

    const ratingLabels = ratingChart.labels || [];
    const ratingValues = ratingChart.values || [];
    const ratingBar = {
        labels: ratingLabels,
        datasets: [
            {
                label: "Count",
                data: ratingValues,
                backgroundColor: ratingLabels.map(
                    (_, index) => palette[index % palette.length]
                ),
                borderRadius: 8,
                maxBarThickness: 60,
            },
        ],
    };

    const categoryBar = buildBarData(
        categoryChart.labels || [],
        categoryChart.values || [],
        "rgba(59, 130, 246, 0.75)"
    );

    const subcategoryBar = buildBarData(
        subcategoryChart.labels || [],
        subcategoryChart.values || [],
        "rgba(16, 185, 129, 0.75)"
    );

    return (
        <>
            <Head title="Dashboard" />
            <FlashMessage />
            <div className="min-h-screen bg-slate-50 rounded-md">
                <div className="mx-auto px-5 py-6 space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Rating Dashboard
                            </h2>
                            <p className="text-sm text-slate-500">
                                Track ratings in a selected date range.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                                Date Range
                            </span>
                            <Select
                                allowClear
                                placeholder="Preset"
                                value={presetKey}
                                style={{ width: 130 }}
                                options={[
                                    { value: "today", label: "Today" },
                                    { value: "this_month", label: "This Month" },
                                    { value: "this_year", label: "This Year" },
                                ]}
                                onChange={(value) => {
                                    setPresetKey(value || null);
                                    setRange(value ? presets[value] : null);
                                }}
                            />
                            <RangePicker
                                format="DD/MM/YYYY"
                                value={range}
                                onChange={(dates) => {
                                    setRange(dates);
                                    setPresetKey(detectPreset(dates));
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {cards.map(({ label, value, Icon, iconBg, iconText }) => (
                            <div
                                key={label}
                                className="rounded-2xl bg-white shadow-sm border border-slate-100 px-5 py-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-600">
                                        {label}
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {value}
                                    </p>
                                </div>
                                <div
                                    className={`h-12 w-12 rounded-2xl ${iconBg} flex items-center justify-center`}
                                >
                                    <Icon className={`h-6 w-6 ${iconText}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Rating Bar Chart
                                </h3>
                            </div>
                            <div className="mt-4 h-80">
                                {ratingChart.labels?.length ? (
                                    <Bar data={ratingBar} options={barOptions} />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Rating Pie Chart
                                </h3>
                            </div>
                            <div className="mt-4 h-80">
                                {ratingChart.labels?.length ? (
                                    <Doughnut
                                        data={buildPieData(
                                            ratingChart.labels,
                                            ratingChart.values
                                        )}
                                        options={pieOptions}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-base font-semibold text-slate-900">
                                Category Bar Chart
                            </h3>
                            <div className="mt-4 h-72">
                                {categoryChart.labels?.length ? (
                                    <Bar data={categoryBar} options={barOptions} />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-base font-semibold text-slate-900">
                                Category Pie Chart
                            </h3>
                            <div className="mt-4 h-72">
                                {categoryChart.labels?.length ? (
                                    <Doughnut
                                        data={buildPieData(
                                            categoryChart.labels,
                                            categoryChart.values
                                        )}
                                        options={pieOptions}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-base font-semibold text-slate-900">
                                Subcategory Bar Chart
                            </h3>
                            <div className="mt-4 h-72">
                                {subcategoryChart.labels?.length ? (
                                    <Bar data={subcategoryBar} options={barOptions} />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                            <h3 className="text-base font-semibold text-slate-900">
                                Subcategory Pie Chart
                            </h3>
                            <div className="mt-4 h-72">
                                {subcategoryChart.labels?.length ? (
                                    <Doughnut
                                        data={buildPieData(
                                            subcategoryChart.labels,
                                            subcategoryChart.values
                                        )}
                                        options={pieOptions}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
