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
        Schema::create('crops', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('harvest_id');
            $table->string('name'); // Nome da cultura (ex: Soja, Milho, Café)
            $table->timestamps();

            $table->foreign('harvest_id')->references('id')->on('harvests')->onDelete('cascade');
        });

        // Migrar dados existentes: criar crop para cada harvest que tem name
        // Isso garante que dados existentes não sejam perdidos
        $harvestsWithName = DB::table('harvests')
            ->whereNotNull('name')
            ->where('name', '!=', '')
            ->get();

        foreach ($harvestsWithName as $harvest) {
            DB::table('crops')->insert([
                'id' => 'crop_' . uniqid(),
                'harvest_id' => $harvest->id,
                'name' => $harvest->name,
                'created_at' => $harvest->created_at,
                'updated_at' => $harvest->updated_at,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crops');
    }
};
