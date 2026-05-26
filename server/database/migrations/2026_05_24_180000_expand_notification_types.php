<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE tbl_notifications MODIFY COLUMN type VARCHAR(30) NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE tbl_notifications MODIFY COLUMN type ENUM(
            'low_stock','jug_debt','delivery','payment','off_route'
        ) NOT NULL");
    }
};
