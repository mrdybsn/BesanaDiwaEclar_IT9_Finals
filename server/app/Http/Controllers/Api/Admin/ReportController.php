<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function weeklyReport(Request $request)
    {
        $dateFrom = $request->input('date_from', now()->startOfWeek()->toDateString());
        $dateTo   = $request->input('date_to', now()->endOfWeek()->toDateString());

        $orders = Order::where('is_deleted', false)
            ->where('payment_status', 'paid')
            ->whereDate('created_at', '>=', $dateFrom)
            ->whereDate('created_at', '<=', $dateTo)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as order_count')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'asc')
            ->get();

        $totalRevenue = $orders->sum('revenue');
        $totalOrders  = $orders->sum('order_count');

        $breakdown = Order::where('is_deleted', false)
            ->where('payment_status', 'paid')
            ->whereDate('created_at', '>=', $dateFrom)
            ->whereDate('created_at', '<=', $dateTo)
            ->select(
                'order_type',
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('order_type')
            ->get();

        $paymentBreakdown = Order::where('is_deleted', false)
            ->where('payment_status', 'paid')
            ->whereDate('created_at', '>=', $dateFrom)
            ->whereDate('created_at', '<=', $dateTo)
            ->select(
                'payment_method',
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('payment_method')
            ->get();

        $html = view('reports.weekly', compact(
            'dateFrom',
            'dateTo',
            'orders',
            'totalRevenue',
            'totalOrders',
            'breakdown',
            'paymentBreakdown'
        ))->render();

        $filename = "soldiers-thirst-report-{$dateFrom}-to-{$dateTo}.html";

        return response($html, 200, [
            'Content-Type'        => 'text/html; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
