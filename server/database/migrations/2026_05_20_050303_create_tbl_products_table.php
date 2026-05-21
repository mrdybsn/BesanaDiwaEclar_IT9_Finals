<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('image')->nullable();
            $table->string('name', 100);
            $table->enum('size', ['500ml', '1L', '5gal', 'custom']);
            $table->string('unit', 30);
            $table->decimal('price', 8, 2);
            $table->decimal('price_per_liter', 8, 2)->default(0.00);
            $table->integer('custom_volume_ml')->nullable();
            $table->decimal('container_deposit', 8, 2)->default(0.00);
            $table->integer('stock')->default(0);
            $table->integer('low_stock_threshold')->default(10);
            $table->tinyInteger('is_available')->default(true);
            $table->tinyInteger('is_deleted')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_products');
        Schema::enableForeignKeyConstraints();
    }
};
