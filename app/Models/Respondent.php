<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Respondent extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_type',
        'date_of_transaction',
        'sex',
        'age',
        'region_of_residence',
        'service_availed',
        'suggestions',
        'email',
        'completed_survey',
        'service_id',
    ];

    protected $casts = [
        'date_of_transaction' => 'date',
    ];

    // Add this relationship
    public function surveyResponses()
    {
        return $this->hasMany(SurveyResponse::class);
    }

    // Get CC responses using question_id
    public function ccResponses()
    {
        return $this->surveyResponses()->whereHas('question', function($query) {
            $query->whereIn('custom_id', ['CC1', 'CC2', 'CC3']);
        });
    }

    // Get SQD responses using question_id
    public function sqdResponses()
    {
        return $this->surveyResponses()->whereHas('question', function($query) {
            $query->where('custom_id', 'like', 'SQD%');
        });
    }
    
    // ========== ADD THESE NEW METHODS ==========
    
    /**
     * Check if respondent completed at least one survey question
     */
    public function getHasCompletedSurveyAttribute()
    {
        return $this->surveyResponses()->exists();
    }
    
    /**
     * Check if respondent completed CC questions
     */
    public function getHasCompletedCCAttribute()
    {
        return $this->ccResponses()->exists();
    }
    
    /**
     * Check if respondent completed SQD questions
     */
    public function getHasCompletedSQDAttribute()
    {
        return $this->sqdResponses()->exists();
    }
    
    /**
     * Count how many survey questions were answered
     */
    public function getSurveyQuestionsAnsweredAttribute()
    {
        return $this->surveyResponses()->count();
    }
    
    /**
     * Get all respondents who completed at least one survey question
     */
    public function scopeCompletedSurvey($query)
    {
        return $query->whereHas('surveyResponses');
    }
    
    /**
     * Get all respondents who completed CC questions
     */
    public function scopeCompletedCC($query)
    {
        return $query->whereHas('ccResponses');
    }
    
    /**
     * Get all respondents who completed SQD questions
     */
    public function scopeCompletedSQD($query)
    {
        return $query->whereHas('sqdResponses');
    }

    public function service()
{
    return $this->belongsTo(Service::class);
}
}