<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('transaction_logs', function (Blueprint $table) {
            $table->id();
            $table->string('service_type'); // Only field we need
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transaction_logs');
    }
};