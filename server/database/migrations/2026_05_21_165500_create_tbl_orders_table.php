<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->enum('order_type', ['walkin', 'delivery'])->default('walkin');
            $table->decimal('total_amount', 10, 2)->default(0.00);
            $table->integer('gallon_owned')->default(0);
            $table->integer('gallon_exchange')->default(0);
            $table->enum('status', ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'])->default('pending');
            $table->enum('payment_method', ['cash', 'gcash', 'maya', 'other'])->default('cash');
            $table->enum('payment_status', ['unpaid', 'paid', 'partial'])->default('unpaid');
            $table->string('delivery_address')->nullable();
            $table->decimal('gps_lat', 10, 7)->nullable();
            $table->decimal('gps_lng', 10, 7)->nullable();
            $table->text('notes')->nullable();
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            // ── foreign keys ──────────────────────────────────────────────
            $table->foreign('customer_id')
                ->references('customer_id')   // ← fixed
                ->on('tbl_customers')          // ← fixed
                ->nullOnDelete();

            $table->foreign('processed_by')
                ->references('user_id')
                ->on('tbl_users')
                ->nullOnDelete();
                    });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_orders');
        Schema::enableForeignKeyConstraints();
    }
};
