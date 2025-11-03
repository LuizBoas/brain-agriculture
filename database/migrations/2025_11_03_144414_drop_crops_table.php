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
        Schema::dropIfExists('crops');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recriar a tabela crops caso precise reverter (não recomendado)
        Schema::create('crops', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('harvest_id');
            $table->string('name');
            $table->timestamps();

            $table->foreign('harvest_id')->references('id')->on('harvests')->onDelete('cascade');
        });
    }
};
