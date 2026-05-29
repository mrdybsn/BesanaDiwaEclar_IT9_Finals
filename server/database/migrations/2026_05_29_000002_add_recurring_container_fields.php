<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tbl_recurring_orders', function (Blueprint $table) {
            $table->unsignedBigInteger('initial_product_id')->nullable()->after('product_id');
            $table->boolean('includes_container')->default(false)->after('initial_product_id');
            $table->boolean('first_delivery_completed')->default(false)->after('includes_container');

            $table->foreign('initial_product_id')
                ->references('product_id')
                ->on('tbl_products')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tbl_recurring_orders', function (Blueprint $table) {
            $table->dropForeign(['initial_product_id']);
            $table->dropColumn(['initial_product_id', 'includes_container', 'first_delivery_completed']);
        });
    }
};
