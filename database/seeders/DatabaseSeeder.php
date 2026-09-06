<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = \App\Models\Role::create([
            'code' => 'SUPER_ADMIN',
            'name' => 'Super Admin',
            'description' => 'Administrator with full access'
        ]);

        $gudangRole = \App\Models\Role::create([
            'code' => 'GUDANG',
            'name' => 'Gudang',
            'description' => 'Staff Gudang'
        ]);

        $supirRole = \App\Models\Role::create([
            'code' => 'SUPIR',
            'name' => 'Supir',
            'description' => 'Driver/Supir'
        ]);

        $financeRole = \App\Models\Role::create([
            'code' => 'FINANCE',
            'name' => 'Finance',
            'description' => 'Finance Staff'
        ]);

        $permViewRental = \App\Models\Permission::create([
            'code' => 'rental.view',
            'module' => 'Rental',
            'action' => 'View'
        ]);

        $permCreateRental = \App\Models\Permission::create([
            'code' => 'rental.create',
            'module' => 'Rental',
            'action' => 'Create'
        ]);

        \Illuminate\Support\Facades\DB::table('rl_role_permissions')->insert([
            ['id' => (string) \Illuminate\Support\Str::uuid(), 'role_id' => $superAdminRole->id, 'permission_id' => $permViewRental->id],
            ['id' => (string) \Illuminate\Support\Str::uuid(), 'role_id' => $superAdminRole->id, 'permission_id' => $permCreateRental->id],
        ]);

        $adminUser = \App\Models\User::create([
            'username' => 'admin',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'name' => 'System Admin',
            'email' => 'admin@equiprent.test',
        ]);

        \Illuminate\Support\Facades\DB::table('rl_user_roles')->insert([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => $adminUser->id,
            'role_id' => $superAdminRole->id
        ]);
    }
}
