<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DepartmentHeadSeeder extends Seeder
{
    public function run(): void
    {
        // Check if department head already exists
        $existingHead = User::where('email', 'hr@gmail.com')->first();
        
        if (!$existingHead) {
            User::create([
                'name' => 'Department Head',
                'email' => 'hr@gmail.com',
                'password' => Hash::make('password123'), // Change this!
                'role' => 'department_head',
                'email_verified_at' => now(), // Verify email immediately
            ]);
            
            $this->command->info('Department Head user created successfully!');
            $this->command->info('Email: hr@gmail.com');
            $this->command->info('Password: password123');
        } else {
            // Update existing user to be department head
            $existingHead->update([
                'role' => 'department_head',
            ]);
            $this->command->info('Existing user updated to Department Head role.');
        }
    }
}