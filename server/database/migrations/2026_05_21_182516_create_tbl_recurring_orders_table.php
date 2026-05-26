<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_recurring_orders', function (Blueprint $table) {
            $table->id('recurring_order_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->integer('quantity')->default(1);
            $table->enum('day_of_week', [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday'
            ]);
            $table->tinyInteger('is_active')->default(1);
            $table->string('delivery_address')->nullable();
            $table->text('notes')->nullable();
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('customer_id')
                  ->references('user_id')
                  ->on('tbl_users')
                  ->nullOnDelete();

            $table->foreign('product_id')
                  ->references('product_id')
                  ->on('tbl_products')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_recurring_orders');
        Schema::enableForeignKeyConstraints();
    }
};
