<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Delivery;
use App\Models\InventoryItem;
use App\Models\Product;
use App\Models\GallonDebt;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function loadDashboard()
    {
        $today = now()->toDateString();

        $lowStockProducts = Product::where('is_deleted', false)
            ->where('is_available', true)
            ->whereColumn('stock', '<=', 'low_stock_threshold')
            ->orderBy('stock', 'asc')
            ->limit(20)
            ->get(['product_id', 'name', 'size', 'stock', 'low_stock_threshold', 'unit']);

        $lowStockInventory = InventoryItem::where('is_deleted', false)
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->orderBy('quantity', 'asc')
            ->limit(20)
            ->get(['inventory_item_id', 'item_name', 'category', 'quantity', 'unit', 'low_stock_threshold']);

        $recentOrders = Order::with(['customer', 'orderItems.product'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $todayRiderDeliveries = Delivery::with(['rider', 'order.customer', 'order.orderItems.product'])
            ->where('is_deleted', false)
            ->whereDate('scheduled_date', $today)
            ->whereNotNull('rider_id')
            ->orderBy('rider_id')
            ->get()
            ->groupBy('rider_id')
            ->map(function ($deliveries) {
                $rider = $deliveries->first()->rider;
                return [
                    'rider_id'   => $rider?->user_id,
                    'rider_name' => $rider ? "{$rider->last_name}, {$rider->first_name}" : 'Unassigned',
                    'deliveries' => $deliveries->values(),
                    'count'      => $deliveries->count(),
                ];
            })
            ->values();

        $dailySummary = [
            'walkin' => Order::where('is_deleted', false)
                ->where('order_type', 'walkin')
                ->whereDate('created_at', $today)
                ->select(DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as total'))
                ->first(),
            'delivery' => Order::where('is_deleted', false)
                ->where('order_type', 'delivery')
                ->whereDate('created_at', $today)
                ->select(DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as total'))
                ->first(),
            'total_sales' => Order::where('is_deleted', false)
                ->where('payment_status', 'paid')
                ->whereDate('created_at', $today)
                ->sum('total_amount'),
        ];

        return response()->json([
            'date'                  => $today,
            'low_stock_products'    => $lowStockProducts,
            'low_stock_inventory'   => $lowStockInventory,
            'recent_orders'         => $recentOrders,
            'today_rider_deliveries'=> $todayRiderDeliveries,
            'daily_summary'         => $dailySummary,
        ], 200);
    }

    public function loadRevenue(Request $request)
    {
        $period = $request->input('period', 'weekly'); // weekly | monthly | yearly

        $query = Order::where('is_deleted', false)
            ->where('payment_status', 'paid');

        switch ($period) {
            case 'weekly':
                $data = $query->select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('SUM(total_amount) as total'),
                        DB::raw('COUNT(*) as order_count')
                    )
                    ->whereBetween('created_at', [
                        now()->startOfWeek(),
                        now()->endOfWeek()
                    ])
                    ->groupBy(DB::raw('DATE(created_at)'))
                    ->orderBy('date', 'asc')
                    ->get();
                break;

            case 'monthly':
                $data = $query->select(
                        DB::raw('WEEK(created_at) as week'),
                        DB::raw('SUM(total_amount) as total'),
                        DB::raw('COUNT(*) as order_count')
                    )
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->groupBy(DB::raw('WEEK(created_at)'))
                    ->orderBy('week', 'asc')
                    ->get();
                break;

            case 'yearly':
                $data = $query->select(
                        DB::raw('MONTH(created_at) as month'),
                        DB::raw('SUM(total_amount) as total'),
                        DB::raw('COUNT(*) as order_count')
                    )
                    ->whereYear('created_at', now()->year)
                    ->groupBy(DB::raw('MONTH(created_at)'))
                    ->orderBy('month', 'asc')
                    ->get();
                break;
        }

        // walkin vs delivery breakdown
        $breakdown = Order::where('is_deleted', false)
            ->where('payment_status', 'paid')
            ->select(
                'order_type',
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('order_type')
            ->get();

        return response()->json([
            'period'    => $period,
            'data'      => $data,
            'breakdown' => $breakdown,
        ], 200);
    }

    public function loadDailySummary()
    {
        $today = now()->toDateString();

        $walkin = Order::where('is_deleted', false)
            ->where('order_type', 'walkin')
            ->whereDate('created_at', $today)
            ->select(
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as total')
            )
            ->first();

        $delivery = Order::where('is_deleted', false)
            ->where('order_type', 'delivery')
            ->whereDate('created_at', $today)
            ->select(
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as total')
            )
            ->first();

        $totalSales = Order::where('is_deleted', false)
            ->where('payment_status', 'paid')
            ->whereDate('created_at', $today)
            ->sum('total_amount');

        return response()->json([
            'date'        => $today,
            'walkin'      => $walkin,
            'delivery'    => $delivery,
            'total_sales' => $totalSales,
        ], 200);
    }

    public function loadCustomerStats()
    {
        // top customers by order count
        $topCustomers = Order::where('is_deleted', false)
            ->whereNotNull('customer_id')
            ->select(
                'customer_id',
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total_amount) as total_spent')
            )
            ->with('customer')
            ->groupBy('customer_id')
            ->orderBy('order_count', 'desc')
            ->limit(10)
            ->get();

        // total active customers (riders excluded)
        $totalCustomers = Customer::count();

        // outstanding gallon debts
        $totalGallonDebt = DB::table('tbl_gallon_debts')
            ->where('is_deleted', false)
            ->sum(DB::raw('gallons_borrowed - gallons_returned'));

        return response()->json([
            'top_customers'    => $topCustomers,
            'total_customers'  => $totalCustomers,
            'total_gallon_debt'=> $totalGallonDebt,
        ], 200);
    }

    public function loadInventoryStats()
    {
        $lowStock = InventoryItem::where('is_deleted', false)
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->count();

        $categories = InventoryItem::where('is_deleted', false)
            ->select(
                'category',
                DB::raw('COUNT(*) as item_count'),
                DB::raw('SUM(quantity) as total_quantity')
            )
            ->groupBy('category')
            ->get();

        return response()->json([
            'low_stock_count' => $lowStock,
            'categories'      => $categories,
        ], 200);
    }

    public function loadDeliveryStats()
    {
        $today = now()->toDateString();

        $todayDeliveries = Delivery::where('is_deleted', false)
            ->whereDate('scheduled_date', $today)
            ->select(
                'status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('status')
            ->get();

        $pendingRemittances = DB::table('tbl_remittances')
            ->where('is_deleted', false)
            ->where('status', 'pending')
            ->count();

        $discrepancies = DB::table('tbl_remittances')
            ->where('is_deleted', false)
            ->where('status', 'discrepancy')
            ->count();

        return response()->json([
            'today_deliveries'    => $todayDeliveries,
            'pending_remittances' => $pendingRemittances,
            'discrepancies'       => $discrepancies,
        ], 200);
    }
}
