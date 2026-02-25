<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->string('service_availed', 255)->change();
        });
    }

    public function down()
    {
        // Reverting to ENUM is not straightforward; you can skip if needed.
        // If you must revert, you'd need to know the exact ENUM definition.
    }
};