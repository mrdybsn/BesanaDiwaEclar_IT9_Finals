<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_deliveries', function (Blueprint $table) {
            $table->id('delivery_id');
            $table->unsignedBigInteger('rider_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->date('scheduled_date');
            $table->enum('status', ['pending', 'assigned', 'in_transit', 'delivered', 'failed'])->default('pending');
            $table->decimal('expected_amount', 10, 2)->default(0.00);
            $table->decimal('collected_amount', 10, 2)->default(0.00);
            $table->decimal('rider_gps_lat', 10, 7)->nullable();
            $table->decimal('rider_gps_lng', 10, 7)->nullable();
            $table->text('notes')->nullable();
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('rider_id')
                  ->references('user_id')
                  ->on('tbl_users')
                  ->nullOnDelete();

            $table->foreign('order_id')
                  ->references('order_id')
                  ->on('tbl_orders')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_deliveries');
        Schema::enableForeignKeyConstraints();
    }
};
