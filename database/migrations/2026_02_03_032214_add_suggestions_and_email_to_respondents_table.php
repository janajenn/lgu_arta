<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->text('suggestions')->nullable()->after('service_availed');
            $table->string('email', 100)->nullable()->after('suggestions');
        });
    }

    public function down(): void
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->dropColumn(['suggestions', 'email']);
        });
    }
};