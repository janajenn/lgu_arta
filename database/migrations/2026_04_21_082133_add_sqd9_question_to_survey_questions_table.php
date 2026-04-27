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
    DB::table('survey_questions')->insert([
        'custom_id' => 'SQD9',
        'question_set' => 'second',
        'question_number' => 9,
        'question_text' => 'SQD9. The office completed my transaction within the time stated in the Citizen’s Charter.',
        'answer_type' => 'likert',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

public function down()
{
    DB::table('survey_questions')->where('custom_id', 'SQD9')->delete();
}
};
