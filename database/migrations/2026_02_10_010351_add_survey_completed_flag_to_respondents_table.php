<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('respondents', function (Blueprint $table) {
            // Add new nullable columns for survey data
            
            $table->boolean('completed_survey')->default(false)->after('email');
            
            // Make existing columns nullable (if they aren't already)
            $table->enum('client_type', ['citizen', 'business', 'government'])->nullable()->change();
            $table->enum('sex', ['male', 'female', 'prefer_not_to_say'])->nullable()->change();
            $table->tinyInteger('age')->unsigned()->nullable()->change();
            $table->string('region_of_residence', 100)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('respondents', function (Blueprint $table) {
            // Remove new columns
            $table->dropColumn(['suggestions', 'email', 'completed_survey']);
            
            // Restore columns to not nullable (if they were before)
            $table->enum('client_type', ['citizen', 'business', 'government'])->nullable(false)->change();
            $table->enum('sex', ['male', 'female', 'prefer_not_to_say'])->nullable(false)->change();
            $table->tinyInteger('age')->unsigned()->nullable(false)->change();
            $table->string('region_of_residence', 100)->nullable(false)->change();
        });
    }
};