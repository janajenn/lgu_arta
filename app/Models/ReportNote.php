<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportNote extends Model
{
    protected $fillable = ['user_id', 'report_type', 'section_key', 'content'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
