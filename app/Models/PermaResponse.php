<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class PermaResponse extends Model
{
    protected $fillable = [
        'user_id', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
        'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20',
        'q21', 'q22', 'q23'
    ];

    protected $casts = [
        'q1' => 'integer',
        'q2' => 'integer',
        'q3' => 'integer',
        'q4' => 'integer',
        'q5' => 'integer',
        'q6' => 'integer',
        'q7' => 'integer',
        'q8' => 'integer',
        'q9' => 'integer',
        'q10' => 'integer',
        'q11' => 'integer',
        'q12' => 'integer',
        'q13' => 'integer',
        'q14' => 'integer',
        'q15' => 'integer',
        'q16' => 'integer',
        'q17' => 'integer',
        'q18' => 'integer',
        'q19' => 'integer',
        'q20' => 'integer',
        'q21' => 'integer',
        'q22' => 'integer',
        'q23' => 'integer',
    ];

    // Optional: relationship if you want to link to users table
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
