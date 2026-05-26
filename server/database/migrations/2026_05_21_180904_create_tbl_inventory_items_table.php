<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_inventory_items', function (Blueprint $table) {
            $table->id('inventory_item_id');
            $table->string('item_name', 100);
            $table->enum('category', [
                'containers',
                'caps',
                'filters',
                'chemicals',
                'equipment',
                'other'
            ]);
            $table->integer('quantity')->default(0);
            $table->string('unit', 30);
            $table->integer('low_stock_threshold')->default(10);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_inventory_items');
        Schema::enableForeignKeyConstraints();
    }
};
