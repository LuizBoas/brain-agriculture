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
        Schema::table('producers', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('farms', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('harvests', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('crops', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('producers', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('farms', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('harvests', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('crops', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
