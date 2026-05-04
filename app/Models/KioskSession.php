<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class KioskSession extends Model
{
    protected $fillable = [
        'department_id', 'token', 'activated_at', 'expires_at',
        'is_active', 'activated_by', 'deactivated_at', 'deactivated_by'
    ];

    protected $casts = [
        'activated_at' => 'datetime',
        'expires_at' => 'datetime',
        'deactivated_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($session) {
            $session->token = Str::random(64);
        });
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function activatedBy()
    {
        return $this->belongsTo(User::class, 'activated_by');
    }

    public function deactivatedBy()
    {
        return $this->belongsTo(User::class, 'deactivated_by');
    }
}

