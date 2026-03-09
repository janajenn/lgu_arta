<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_add_category_to_services_table.php
public function up()
{
    Schema::table('services', function (Blueprint $table) {
        $table->string('category')->default('internal')->after('description');
    });
}

public function down()
{
    Schema::table('services', function (Blueprint $table) {
        $table->dropColumn('category');
    });
}
};
