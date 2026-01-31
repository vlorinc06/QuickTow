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
        Schema::create('tow_users', function (Blueprint $table) {
            $table->id();
            $table->string('last_name', 50);
            $table->string('first_name', 50);
            $table->string('username', 50)->unique();
            $table->string('password');
            $table->string('email', 50)->unique();
            $table->string('phone_number', 50);
            $table->integer('price_per_km')->default(1000);
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->decimal('rating',3, 2)->default(0);
            $table->integer('rating_count')->default(0);
            $table->string('status', 20)->default('unavailable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tow_users');
    }
};
