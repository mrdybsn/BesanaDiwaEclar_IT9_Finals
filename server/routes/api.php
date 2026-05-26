<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\RecurringOrderController;
use App\Http\Controllers\Api\Admin\DeliveryController;
use App\Http\Controllers\Api\Admin\RemittanceController;
use App\Http\Controllers\Api\Admin\InventoryController;
use App\Http\Controllers\Api\Admin\GallonDebtController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Rider\DeliveryTaskController;
use App\Http\Controllers\Api\Rider\LostItemController;
use App\Http\Controllers\Api\Admin\CustomerController;
use App\Http\Controllers\Api\Admin\GeocodingController;
use App\Http\Controllers\Api\NotificationController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::controller(NotificationController::class)->group(function () {
        Route::get('/notifications', 'index');
        Route::patch('/notifications/read-all', 'markAllRead');
        Route::patch('/notifications/{notification}/read', 'markRead');
    });

    Route::controller(UserController::class)->prefix('/admin')->group(function () {
        Route::get('/users',                'loadUsers');
        Route::get('/riders',               'loadRiders');
        Route::post('/users',               'storeUser');
        Route::post('/users/{user}',        'updateUser');
        Route::patch('/users/{user}/status','updateStatus');
        Route::delete('/users/{user}',      'destroyUser');
    });

    Route::controller(ProductController::class)->prefix('/admin')->group(function () {
        Route::get('/products',                      'loadProducts');
        Route::get('/products/{product}',            'getProduct');
        Route::post('/products',                     'storeProduct');
        Route::post('/products/{product}',           'updateProduct');
        Route::patch('/products/{product}/available','toggleAvailable');
        Route::delete('/products/{product}',         'destroyProduct');
    });

    Route::post('/admin/geocode', [GeocodingController::class, 'geocode']);

    Route::controller(OrderController::class)->prefix('/admin')->group(function () {
        Route::get('/orders',                  'loadOrders');
        Route::get('/orders/{order}',          'getOrder');
        Route::post('/orders',                 'storeOrder');
        Route::put('/orders/{order}',          'updateOrder');
        Route::patch('/orders/{order}/status', 'updateStatus');
        Route::delete('/orders/{order}',       'destroyOrder');
    });

    Route::get('/admin/customers',         [CustomerController::class, 'loadCustomers']);
    Route::post('/admin/customers',        [CustomerController::class, 'storeCustomer']);
    Route::put('/admin/customers/{customer}',    [CustomerController::class, 'updateCustomer']);
    Route::delete('/admin/customers/{customer}', [CustomerController::class, 'destroyCustomer']);

    Route::controller(RecurringOrderController::class)->prefix('/admin')->group(function () {
        Route::get('/recurring',                       'loadRecurring');
        Route::get('/recurring/{recurringOrder}',      'getRecurring');
        Route::post('/recurring',                      'storeRecurring');
        Route::put('/recurring/{recurringOrder}',      'updateRecurring');
        Route::patch('/recurring/{recurringOrder}/status', 'updateStatus');
        Route::delete('/recurring/{recurringOrder}',   'destroyRecurring');
    });

    Route::controller(DeliveryController::class)->prefix('/admin')->group(function () {
        Route::get('/deliveries',                    'loadDeliveries');
        Route::get('/deliveries/calendar',           'loadCalendar');
        Route::post('/deliveries',                   'storeDelivery');
        Route::put('/deliveries/{delivery}',         'updateDelivery');
        Route::patch('/deliveries/{delivery}/status','updateStatus');
        Route::delete('/deliveries/{delivery}',      'destroyDelivery');
    });

    Route::controller(RemittanceController::class)->prefix('/admin')->group(function () {
        Route::get('/remittances',                      'loadRemittances');
        Route::post('/remittances',                     'storeRemittance');
        Route::patch('/remittances/{remittance}/verify','verifyRemittance');
        Route::delete('/remittances/{remittance}',      'destroyRemittance');
    });

    Route::controller(InventoryController::class)->prefix('/admin')->group(function () {
        Route::get('/inventory',                  'loadInventory');
        Route::get('/inventory/alerts',           'loadAlerts');
        Route::post('/inventory',                 'storeInventory');
        Route::put('/inventory/{inventoryItem}',  'updateInventory');
        Route::delete('/inventory/{inventoryItem}','destroyInventory');
    });

    Route::controller(GallonDebtController::class)->prefix('/admin')->group(function () {
        Route::get('/gallon-debts',                       'loadDebts');
        Route::post('/gallon-debts',                      'storeDebt');
        Route::put('/gallon-debts/{gallonDebt}',          'updateDebt');
        Route::patch('/gallon-debts/{gallonDebt}/resolve','resolveDebt');
        Route::delete('/gallon-debts/{gallonDebt}',       'destroyDebt');
    });

    Route::controller(AnalyticsController::class)->prefix('/admin')->group(function () {
        Route::get('/analytics/dashboard',      'loadDashboard');
        Route::get('/analytics/revenue',        'loadRevenue');
        Route::get('/analytics/daily-summary',  'loadDailySummary');
        Route::get('/analytics/customer-stats', 'loadCustomerStats');
        Route::get('/analytics/inventory-stats','loadInventoryStats');
        Route::get('/analytics/delivery-stats', 'loadDeliveryStats');
    });

    Route::controller(ReportController::class)->prefix('/admin')->group(function () {
        Route::get('/reports/weekly', 'weeklyReport');
    });

    Route::controller(DeliveryTaskController::class)->prefix('/rider')->group(function () {
        Route::get('/deliveries',                        'myDeliveries');
        Route::patch('/deliveries/{delivery}/gps',       'updateGPS');
        Route::patch('/deliveries/{delivery}/delivered', 'markDelivered');
        Route::patch('/deliveries/{delivery}/failed',    'markFailed');
        Route::get('/schedule',                          'weeklySchedule');
    });

    Route::controller(LostItemController::class)->prefix('/rider')->group(function () {
        Route::get('/lost-items',  'index');
        Route::post('/lost-items', 'store');
    });
});
