<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('respondent_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained('survey_questions')->onDelete('cascade');
            $table->string('answer_value');
            $table->timestamps();

            // Prevent duplicate responses from same respondent for same question
            $table->unique(['respondent_id', 'question_id'], 'unique_respondent_question');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_responses');
    }
};