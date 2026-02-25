<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SurveyQuestion;
use Illuminate\Support\Facades\DB;

class SurveyQuestionsSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing questions to avoid duplicates
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        SurveyQuestion::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $questions = [
            // First Set (CC Questions)
            [
                'custom_id' => 'CC1',
                'question_set' => 'first',
                'question_number' => 1,
                'question_text' => 'CC1. Which of the following best describes your awareness of a CC?',
                'answer_type' => 'checkbox',
                'is_active' => true,
            ],
            [
                'custom_id' => 'CC2',
                'question_set' => 'first',
                'question_number' => 2,
                'question_text' => 'CC2. If aware of CC (answered 1–3 in CC1), would you say that the CC of this office was … ?',
                'answer_type' => 'checkbox',
                'is_active' => true,
            ],
            [
                'custom_id' => 'CC3',
                'question_set' => 'first',
                'question_number' => 3,
                'question_text' => 'CC3. If aware of CC (answered codes 1–3 in CC1), how much did the CC help you in your transaction?',
                'answer_type' => 'checkbox',
                'is_active' => true,
            ],
            
            // Second Set (SQD Questions)
            [
                'custom_id' => 'SQD0',
                'question_set' => 'second',
                'question_number' => 0,
                'question_text' => 'SQD0. I am satisfied with the service that I availed.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD1',
                'question_set' => 'second',
                'question_number' => 1,
                'question_text' => 'SQD1. I spent a reasonable amount of time for my transaction.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD2',
                'question_set' => 'second',
                'question_number' => 2,
                'question_text' => 'SQD2. The office followed the transaction\'s requirements and steps based on the information provided.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD3',
                'question_set' => 'second',
                'question_number' => 3,
                'question_text' => 'SQD3. The steps (including payment) I needed to do for my transaction were easy and simple.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD4',
                'question_set' => 'second',
                'question_number' => 4,
                'question_text' => 'SQD4. I easily found information about my transaction from the office or its website.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD5',
                'question_set' => 'second',
                'question_number' => 5,
                'question_text' => 'SQD5. I paid a reasonable amount of fees for my transaction.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD6',
                'question_set' => 'second',
                'question_number' => 6,
                'question_text' => 'SQD6. I feel the office was fair to everyone, or "walang palakasan", during my transaction.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD7',
                'question_set' => 'second',
                'question_number' => 7,
                'question_text' => 'SQD7. I was treated courteously by the staff, and (if asked for help) the staff was helpful.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
            [
                'custom_id' => 'SQD8',
                'question_set' => 'second',
                'question_number' => 8,
                'question_text' => 'SQD8. I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me.',
                'answer_type' => 'likert',
                'is_active' => true,
            ],
        ];

        foreach ($questions as $question) {
            SurveyQuestion::create($question);
        }
        
        $this->command->info('✓ Survey questions seeded successfully!');
        $this->command->info('Total questions: ' . count($questions));
    }
}