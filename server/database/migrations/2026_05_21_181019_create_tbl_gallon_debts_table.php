<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_gallon_debts', function (Blueprint $table) {
            $table->id('gallon_debt_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->integer('gallons_borrowed')->default(0);
            $table->integer('gallons_returned')->default(0);
            $table->integer('gallons_owed')->storedAs('gallons_borrowed - gallons_returned');
            $table->text('notes')->nullable();
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('customer_id')
                  ->references('user_id')
                  ->on('tbl_users')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_gallon_debts');
        Schema::enableForeignKeyConstraints();
    }
};
