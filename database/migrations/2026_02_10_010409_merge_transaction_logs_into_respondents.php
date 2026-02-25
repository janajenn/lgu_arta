<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // First, mark all existing respondents as having completed the survey
        DB::table('respondents')->update(['completed_survey' => true]);
        
        // Check if transaction_logs table exists and has data
        if (Schema::hasTable('transaction_logs')) {
            $transactionCount = DB::table('transaction_logs')->count();
            
            if ($transactionCount > 0) {
                // Copy transaction_logs data into respondents table
                DB::statement("
                    INSERT INTO respondents (
                        service_availed,
                        date_of_transaction,
                        completed_survey,
                        client_type,
                        sex,
                        age,
                        region_of_residence,
                        suggestions,
                        email,
                        created_at,
                        updated_at
                    )
                    SELECT 
                        service_type,
                        DATE(created_at),
                        false as completed_survey,
                        NULL as client_type,
                        NULL as sex,
                        NULL as age,
                        NULL as region_of_residence,
                        NULL as suggestions,
                        NULL as email,
                        created_at,
                        updated_at
                    FROM transaction_logs
                ");
            }
            
            // Drop the transaction_logs table
            Schema::dropIfExists('transaction_logs');
        }
    }

    public function down(): void
    {
        // Recreate transaction_logs table if rolling back
        if (!Schema::hasTable('transaction_logs')) {
            Schema::create('transaction_logs', function (Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->string('service_type');
                $table->timestamps();
            });
        }
        
        // Move non-survey respondents back to transaction_logs
        $nonSurveyRespondents = DB::table('respondents')
            ->where('completed_survey', false)
            ->get();
            
        foreach ($nonSurveyRespondents as $respondent) {
            DB::table('transaction_logs')->insert([
                'service_type' => $respondent->service_availed,
                'created_at' => $respondent->created_at,
                'updated_at' => $respondent->updated_at,
            ]);
        }
        
        // Delete non-survey respondents from respondents table
        DB::table('respondents')->where('completed_survey', false)->delete();
        
        // Reset completed_survey flag for remaining respondents
        DB::table('respondents')->update(['completed_survey' => false]);
    }
};