<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Deletar todas as safras que não têm culturas associadas
        DB::statement('
            DELETE FROM harvests 
            WHERE id NOT IN (
                SELECT DISTINCT harvest_id 
                FROM crops 
                WHERE harvest_id IS NOT NULL
            )
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Não é possível reverter essa operação de deleção
        // A migration down não faz nada
    }
};
