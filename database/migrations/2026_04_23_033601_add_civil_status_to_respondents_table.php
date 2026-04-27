<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->enum('civil_status', ['single', 'married', 'divorced', 'widowed', 'prefer_not_to_say'])
                  ->nullable()
                  ->after('sex');
        });
    }

    public function down()
    {
        Schema::table('respondents', function (Blueprint $table) {
            $table->dropColumn('civil_status');
        });
    }
};
