<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tbl_recurring_orders', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
        });

        Schema::table('tbl_recurring_orders', function (Blueprint $table) {
            $table->foreign('customer_id')
                ->references('customer_id')
                ->on('tbl_customers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tbl_recurring_orders', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
        });

        Schema::table('tbl_recurring_orders', function (Blueprint $table) {
            $table->foreign('customer_id')
                ->references('user_id')
                ->on('tbl_users')
                ->nullOnDelete();
        });
    }
};
