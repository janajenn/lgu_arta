<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['department_id', 'name', 'description'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function respondents()
    {
        return $this->hasMany(Respondent::class);
    }
}