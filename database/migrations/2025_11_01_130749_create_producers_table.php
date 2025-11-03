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
        Schema::create('producers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('document'); // CPF ou CNPJ
            $table->enum('document_type', ['CPF', 'CNPJ']);
            $table->string('name');
            $table->timestamps();
            
            $table->unique(['document', 'document_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('producers');
    }
};
