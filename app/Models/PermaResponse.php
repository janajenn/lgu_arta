<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermaResponse extends Model
{
    protected $fillable = [
        'user_id', 'respondent_name', 'department_id', 'age_bracket',
        'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
        'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20',
        'q21', 'q22', 'q23'
    ];

    // Domain mappings – corrected according to the official PERMA profiler
    const DOMAINS = [
        'positive_emotion' => ['q5', 'q10', 'q22'],
        'engagement'       => ['q3', 'q11', 'q21'],
        'relationships'    => ['q6', 'q15', 'q19'],
        'meaning'          => ['q1', 'q9', 'q17'],
        'accomplishment'   => ['q2', 'q8', 'q16'],
        'health'           => ['q4', 'q13', 'q18'],
        'negative_emotion' => ['q7', 'q14', 'q20'],
        'loneliness'       => ['q12'],
        'overall_happiness'=> ['q23'], // single item, optional
    ];

    /**
     * Calculate average for a given domain.
     */
    public function domainAverage($domain)
    {
        if (!isset(self::DOMAINS[$domain])) {
            return null;
        }
        $questions = self::DOMAINS[$domain];
        $sum = 0;
        $count = count($questions);
        foreach ($questions as $q) {
            $sum += $this->$q ?? 0;
        }
        return $count > 0 ? round($sum / $count, 2) : null;
    }

    /**
     * Get all PERMA domain averages (core five).
     */
    public function permaAverages()
    {
        return [
            'positive_emotion' => $this->domainAverage('positive_emotion'),
            'engagement'       => $this->domainAverage('engagement'),
            'relationships'    => $this->domainAverage('relationships'),
            'meaning'          => $this->domainAverage('meaning'),
            'accomplishment'   => $this->domainAverage('accomplishment'),
        ];
    }

    /**
     * Calculate overall PERMA average (average of the five domains).
     */
    public function overallPermaAverage()
    {
        $avgs = $this->permaAverages();
        $sum = array_sum($avgs);
        $count = count(array_filter($avgs));
        return $count > 0 ? round($sum / $count, 2) : null;
    }

    /**
     * Get interpretation label and color for a given score.
     */
    public static function interpretScore($score)
    {
        if ($score >= 4.0) return ['label' => 'Very High', 'color' => 'green'];
        if ($score >= 3.5) return ['label' => 'High', 'color' => 'emerald'];
        if ($score >= 3.0) return ['label' => 'Moderate', 'color' => 'yellow'];
        if ($score >= 2.0) return ['label' => 'Low', 'color' => 'orange'];
        return ['label' => 'Very Low', 'color' => 'red'];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship
public function department()
{
    return $this->belongsTo(Department::class);
}
}