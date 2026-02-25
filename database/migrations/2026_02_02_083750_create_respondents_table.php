<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('respondents', function (Blueprint $table) {
            $table->id();
            $table->enum('client_type', ['citizen', 'business', 'government']);
            $table->date('date_of_transaction');
            $table->enum('sex', ['male', 'female', 'prefer_not_to_say']);
            $table->tinyInteger('age')->unsigned();
            $table->string('region_of_residence', 100);
            $table->string('service_availed', 200);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('respondents');
    }
};