<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->enum('type', [
                'low_stock',
                'jug_debt',
                'delivery',
                'payment',
                'off_route'
            ]);
            $table->string('title', 100);
            $table->text('message');
            $table->tinyInteger('is_read')->default(0);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('tbl_users')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('tbl_notifications');
        Schema::enableForeignKeyConstraints();
    }
};
