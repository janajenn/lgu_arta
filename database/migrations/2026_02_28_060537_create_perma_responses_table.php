<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('perma_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedTinyInteger('q1');
            $table->unsignedTinyInteger('q2');
            $table->unsignedTinyInteger('q3');
            $table->unsignedTinyInteger('q4');
            $table->unsignedTinyInteger('q5');
            $table->unsignedTinyInteger('q6');
            $table->unsignedTinyInteger('q7');
            $table->unsignedTinyInteger('q8');
            $table->unsignedTinyInteger('q9');
            $table->unsignedTinyInteger('q10');
            $table->unsignedTinyInteger('q11');
            $table->unsignedTinyInteger('q12');
            $table->unsignedTinyInteger('q13');
            $table->unsignedTinyInteger('q14');
            $table->unsignedTinyInteger('q15');
            $table->unsignedTinyInteger('q16');
            $table->unsignedTinyInteger('q17');
            $table->unsignedTinyInteger('q18');
            $table->unsignedTinyInteger('q19');
            $table->unsignedTinyInteger('q20');
            $table->unsignedTinyInteger('q21');
            $table->unsignedTinyInteger('q22');
            $table->unsignedTinyInteger('q23');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('perma_responses');
    }
};
