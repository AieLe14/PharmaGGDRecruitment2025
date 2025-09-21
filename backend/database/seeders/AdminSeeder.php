<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les rôles depuis les variables d'environnement
        $adminRoles = explode(',', env('ADMIN_ROLES', 'super_admin,catalog'));
        
        // Créer les rôles s'ils n'existent pas
        $superAdminRole = Role::firstOrCreate(
            ['code' => 'super_admin'],
            [
                'name' => env('SUPER_ADMIN_ROLE_NAME', 'Administrateur'),
                'description' => env('SUPER_ADMIN_ROLE_DESCRIPTION', 'Super administrateur avec tous les droits'),
                'all_permissions' => true
            ]
        );

        $catalogRole = Role::firstOrCreate(
            ['code' => 'catalog'],
            [
                'name' => env('CATALOG_ROLE_NAME', 'Admin Catalogue'),
                'description' => env('CATALOG_ROLE_DESCRIPTION', 'Administrateur du catalogue'),
                'all_permissions' => false
            ]
        );

        // Créer l'admin principal
        $adminEmail = env('ADMIN_EMAIL', 'admin@pharma-gdd.com');
        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => env('ADMIN_NAME', 'Admin Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'admin')),
                'role_id' => $superAdminRole->id,
                'email_verified_at' => now(),
            ]
        );

        // Créer l'admin catalogue
        $catalogEmail = env('CATALOG_EMAIL', 'catalog@pharma-gdd.com');
        User::updateOrCreate(
            ['email' => $catalogEmail],
            [
                'name' => env('CATALOG_NAME', 'Admin Catalogue'),
                'password' => Hash::make(env('CATALOG_PASSWORD', 'admin_cat')),
                'role_id' => $catalogRole->id,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admins créés avec succès !');
        $this->command->info('Email admin: ' . $adminEmail);
        $this->command->info('Email catalog: ' . $catalogEmail);
        $this->command->info('Rôles autorisés: ' . implode(', ', $adminRoles));
    }
}
