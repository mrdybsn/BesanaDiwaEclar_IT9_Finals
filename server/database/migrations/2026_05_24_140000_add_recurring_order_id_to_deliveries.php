<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tbl_deliveries', function (Blueprint $table) {
            $table->unsignedBigInteger('recurring_order_id')->nullable()->after('order_id');

            $table->foreign('recurring_order_id')
                ->references('recurring_order_id')
                ->on('tbl_recurring_orders')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tbl_deliveries', function (Blueprint $table) {
            $table->dropForeign(['recurring_order_id']);
            $table->dropColumn('recurring_order_id');
        });
    }
};
