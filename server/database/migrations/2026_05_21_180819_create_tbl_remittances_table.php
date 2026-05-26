<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_remittances', function (Blueprint $table) {
            $table->id('remittance_id');
            $table->unsignedBigInteger('rider_id')->nullable();
            $table->unsignedBigInteger('delivery_id')->nullable();
            $table->date('date');
            $table->decimal('collected_amount', 10, 2)->default(0.00);
            $table->decimal('remitted_amount', 10, 2)->default(0.00);
            $table->enum('status', ['pending', 'verified', 'discrepancy'])->default('pending');
            $table->text('notes')->nullable();
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('rider_id')
                  ->references('user_id')
                  ->on('tbl_users')
                  ->nullOnDelete();

            $table->foreign('delivery_id')
                  ->references('delivery_id')
                  ->on('tbl_deliveries')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_remittances');
        Schema::enableForeignKeyConstraints();
    }
};
