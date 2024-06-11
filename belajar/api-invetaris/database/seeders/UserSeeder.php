<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;    

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
          'email' => 'riski@gmail.com', 
          'username' => 'riskiaja',
          'role' => 'staff',
          'password' => Hash::make('223')
       ]);
    }
}

// ganti aja kalau mau bikin seed baru jangan buat baru
// php artisan db:seed --class=NamaFile