<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Report;
use App\Models\Rating;
use Carbon\Carbon;

class DashboardService
{
    public function list($request)
    {
        $now = Carbon::now();
        $startOfYear = $now->copy()->startOfYear();
        $endOfYear = $now->copy()->endOfYear();
        $last30Days = $now->copy()->subDays(30);
        $startDate = $request->start_date
            ? Carbon::parse($request->start_date)->startOfDay()
            : $now->copy()->startOfDay();
        $endDate = $request->end_date
            ? Carbon::parse($request->end_date)->endOfDay()
            : $now->copy()->endOfDay();

        $totalRatings = Report::count();
        $activeRatings = Rating::where('is_delete', 0)
            ->where('is_active', 1)
            ->count();
        $activeBranches = Branch::where('is_delete', 0)->count();
        $activeDepartments = Department::where('is_delete', 0)->count();

        $avgScore = Report::query()
            ->leftJoin('ratings', 'ratings.id', '=', 'reports.rating_id')
            ->where('reports.created_at', '>=', $last30Days)
            ->avg('ratings.point');

        $monthlyCounts = Report::query()
            ->whereBetween('reports.created_at', [$startOfYear, $endOfYear])
            ->selectRaw('MONTH(reports.created_at) as month, COUNT(*) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $monthlyRatings = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthlyRatings[] = (int) ($monthlyCounts[$month] ?? 0);
        }

        $breakdown = Report::query()
            ->leftJoin('ratings', 'ratings.id', '=', 'reports.rating_id')
            ->selectRaw('ratings.title as label, COUNT(*) as total')
            ->groupBy('ratings.title')
            ->orderByDesc('total')
            ->limit(4)
            ->get();

        $ratingBreakdown = [
            'labels' => $breakdown->pluck('label')->filter()->values()->all(),
            'values' => $breakdown->pluck('total')->values()->all(),
        ];

        $todayRatingCounts = Report::query()
            ->leftJoin('ratings', 'ratings.id', '=', 'reports.rating_id')
            ->whereBetween('reports.created_at', [$startDate, $endDate])
            ->whereNotNull('ratings.title')
            ->selectRaw('ratings.title as label, ratings.order_no as order_no, COUNT(*) as total')
            ->groupBy('ratings.id', 'ratings.title', 'ratings.order_no')
            ->orderBy('ratings.order_no')
            ->get();

        $ratingList = Rating::where('is_delete', 0)
            ->orderBy('order_no')
            ->get(['title']);

        $ratingCountMap = $todayRatingCounts
            ->pluck('total', 'label')
            ->map(fn ($value) => (int) $value);

        $ratingLabels = $ratingList->pluck('title')->filter()->values();
        if ($ratingLabels->isEmpty()) {
            $ratingLabels = $ratingCountMap->keys()->values();
        }

        $ratingValues = $ratingLabels
            ->map(fn ($label) => (int) ($ratingCountMap[$label] ?? 0))
            ->values();

        $todayRatings = [
            'todayTotal' => (int) $todayRatingCounts->sum('total'),
            'ratings' => $ratingLabels
                ->mapWithKeys(fn ($label) => [$label => (int) ($ratingCountMap[$label] ?? 0)])
                ->all(),
        ];

        $categoryCounts = Report::query()
            ->leftJoin('categories', 'categories.id', '=', 'reports.cat_id')
            ->whereBetween('reports.created_at', [$startDate, $endDate])
            ->where('categories.is_delete', 0)
            ->whereNotNull('categories.cat_name')
            ->selectRaw('categories.cat_name as label, COUNT(*) as total')
            ->groupBy('categories.id', 'categories.cat_name')
            ->orderByDesc('total')
            ->get();

        $subcategoryCounts = Report::query()
            ->leftJoin('sub_categories', 'sub_categories.id', '=', 'reports.subcat_id')
            ->whereBetween('reports.created_at', [$startDate, $endDate])
            ->where('sub_categories.is_delete', 0)
            ->whereNotNull('sub_categories.subcat_name')
            ->selectRaw('sub_categories.subcat_name as label, COUNT(*) as total')
            ->groupBy('sub_categories.id', 'sub_categories.subcat_name')
            ->orderByDesc('total')
            ->get();

        return [
            'dashboardStats' => [
                'totalRatings' => (int) $totalRatings,
                'activeRatings' => (int) $activeRatings,
                'activeBranches' => (int) $activeBranches,
                'activeDepartments' => (int) $activeDepartments,
                'avgScore' => $avgScore ? round($avgScore, 1) : 0,
            ],
            'monthlyRatings' => $monthlyRatings,
            'ratingBreakdown' => $ratingBreakdown,
            'ratingSummary' => $todayRatings,
            'ratingChart' => [
                'labels' => $ratingLabels->all(),
                'values' => $ratingValues->all(),
            ],
            'categoryChart' => [
                'labels' => $categoryCounts->pluck('label')->values()->all(),
                'values' => $categoryCounts->pluck('total')->values()->all(),
            ],
            'subcategoryChart' => [
                'labels' => $subcategoryCounts->pluck('label')->values()->all(),
                'values' => $subcategoryCounts->pluck('total')->values()->all(),
            ],
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
        ];
    }
}
