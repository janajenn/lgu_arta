<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Department;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department_id',
        'role', // Add this
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected $appends = ['is_hr_department','department_name']; // add this line




    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is department head
     */
    public function isDepartmentHead()
    {
        return $this->role === 'department_head';
    }

    public function getDepartmentNameAttribute()
    {
        return $this->department?->name;
    }

   

    // Add this method
    public function getIsHrDepartmentAttribute()
    {
        return $this->department && $this->department->is_hr;
    }


    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is regular user
     */
    public function isRegularUser(): bool
    {
        return $this->role === 'user';
    }



   


    public function department()
{
    return $this->belongsTo(Department::class);
}
 


}