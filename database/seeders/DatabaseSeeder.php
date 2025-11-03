<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Usuário admin padrão para testes
        User::updateOrCreate(
            ['email' => 'admin@brain-agriculture.com'],
            [
                'name' => 'Administrador',
                'email' => 'admin@brain-agriculture.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Usuário comum para testes
        User::updateOrCreate(
            ['email' => 'user@brain-agriculture.com'],
            [
                'name' => 'Usuário Teste',
                'email' => 'user@brain-agriculture.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Usuários criados com sucesso!');
        $this->command->info('Email: admin@brain-agriculture.com');
        $this->command->info('Senha: password');
    }
}
