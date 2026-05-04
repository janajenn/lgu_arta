<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->foreignId('kiosk_session_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->dropForeign(['kiosk_session_id']);
            $table->dropColumn('kiosk_session_id');
        });
    }
};
