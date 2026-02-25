<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id();
            $table->enum('question_set', ['first', 'second'])->nullable(false);
            $table->tinyInteger('question_number')->unsigned()->nullable(false);
            $table->text('question_text')->nullable(false);
            $table->enum('answer_type', ['checkbox', 'likert'])->nullable(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Unique constraint to prevent duplicate questions in same set
            $table->unique(['question_set', 'question_number'], 'unique_question_set_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_questions');
    }
};