<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Clear all existing data (USE WITH CAUTION!)
        // DB::table('respondents')->truncate();

        // OR just modify the column structure
        Schema::table('respondents', function (Blueprint $table) {
            $table->enum('service_availed', [
                'Internal Service 1 – Issuance of Certificates',
                'Internal Service 2 – Issuance of Travel Order',
                'Internal Service 3 – Administration of Leave Application'
            ])->default('Internal Service 1 – Issuance of Certificates')->change();
        });
    }

    public function down(): void
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->string('service_availed', 200)->change();
        });
    }
};