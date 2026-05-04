<?php
// app/Models/Department.php

namespace App\Models;
use App\Models\Service;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
   protected $fillable = ['name', 'description', 'logo', 'is_hr', 'opening_time', 'closing_time'];

public function kioskSessions()
{
    return $this->hasMany(KioskSession::class);
}

public function activeKioskSession()
{
    return $this->hasOne(KioskSession::class)
        ->where('is_active', true)
        ->where('expires_at', '>', now())
        ->latest();
}

    public function head()
    {
        return $this->hasOne(User::class)->where('role', 'department_head');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function services()
{
    return $this->hasMany(Service::class);
}
}
