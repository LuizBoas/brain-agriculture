<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('farms', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('producer_id');
            $table->string('name'); // Nome da fazenda
            $table->string('city');
            $table->string('state', 2); // UF com 2 caracteres
            $table->decimal('total_area', 15, 2); // Área total em hectares
            $table->decimal('arable_area', 15, 2); // Área agricultável em hectares
            $table->decimal('vegetation_area', 15, 2); // Área de vegetação em hectares
            $table->timestamps();

            $table->foreign('producer_id')->references('id')->on('producers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farms');
    }
};
