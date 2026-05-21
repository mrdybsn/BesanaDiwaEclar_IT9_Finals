<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\ProductController;

Route::controller(UserController::class)->prefix('/user')->group(function() {
    Route::get('/loadUsers',           'loadUsers');
    Route::post('/storeUser',          'storeUser');
    Route::post('/updateUser/{user}',  'updateUser');
    Route::put('/updateStatus/{user}', 'updateStatus');
    Route::put('/destroyUser/{user}',  'destroyUser');
});

Route::controller(ProductController::class)->prefix('/product')->group(function () {
    Route::get('/loadProducts',              'loadProducts');
    Route::get('/getProduct/{product}',      'getProduct');
    Route::post('/storeProduct',             'storeProduct');
    Route::put('/updateProduct/{product}',   'updateProduct');
    Route::put('/toggleAvailable/{product}', 'toggleAvailable');
    Route::put('/destroyProduct/{product}',  'destroyProduct');
});

