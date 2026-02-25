<?php

namespace App\Models;






use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class SurveyQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'custom_id', // Add this
        'question_set',
        'question_number',
        'question_text',
        'answer_type',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function responses()
    {
        return $this->hasMany(SurveyResponse::class, 'question_id');
    }
}
