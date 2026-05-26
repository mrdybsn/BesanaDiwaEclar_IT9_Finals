<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_lost_item_reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->unsignedBigInteger('rider_id');
            $table->unsignedBigInteger('delivery_id')->nullable();
            $table->string('customer_name');
            $table->string('delivery_address')->nullable();
            $table->string('item_description');
            $table->enum('item_type', ['gallon', 'cap', 'seal', 'other']);
            $table->unsignedInteger('quantity')->default(1);
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'reviewed'])->default('pending');
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('rider_id')
                ->references('user_id')
                ->on('tbl_users')
                ->cascadeOnDelete();

            $table->foreign('delivery_id')
                ->references('delivery_id')
                ->on('tbl_deliveries')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_lost_item_reports');
        Schema::enableForeignKeyConstraints();
    }
};
