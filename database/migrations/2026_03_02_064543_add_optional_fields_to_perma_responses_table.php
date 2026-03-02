<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('perma_responses', function (Blueprint $table) {
            $table->string('respondent_name')->nullable()->after('user_id');
            $table->foreignId('department_id')->nullable()->after('respondent_name')
                  ->constrained('departments')->onDelete('set null');
            $table->string('age_bracket')->nullable()->after('department_id');
        });
    }

    public function down()
    {
        Schema::table('perma_responses', function (Blueprint $table) {
            $table->dropConstrainedForeignId('department_id');
            $table->dropColumn(['respondent_name', 'age_bracket']);
        });
    }
};