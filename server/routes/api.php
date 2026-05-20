<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\UserController;

Route::controller(UserController::class)->prefix('/user')->group(function() {
    Route::get('/loadUsers',           'loadUsers');
    Route::post('/storeUser',          'storeUser');
    Route::post('/updateUser/{user}',  'updateUser');
    Route::put('/updateStatus/{user}', 'updateStatus');
    Route::put('/destroyUser/{user}',  'destroyUser');
});
