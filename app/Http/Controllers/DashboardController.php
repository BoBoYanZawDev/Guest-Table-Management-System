<?php

namespace App\Http\Controllers;

use App\Models\SaleReport;
use App\Services\DashboardService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $dashboardService;
    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }
    public function index(Request $request)
    {
        return Inertia::render('Admin/Dashboard');
    }
}
