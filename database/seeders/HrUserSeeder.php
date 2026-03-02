<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class HrUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = 'hrmo@gmail.com'; // Change to desired email
        $password = 'password123'; // Change to the password you want

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'HR Manager', // Adjust as needed
                'password' => Hash::make($password),
                'role' => 'hr', // Ensure role matches your application
                // Add any other required fields (email_verified_at, etc.)
            ]
        );

        $this->command->info('HR user created/updated successfully.');
    }
}