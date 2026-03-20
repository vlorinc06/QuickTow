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
        Schema::create('tow_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->foreignId('vehicle')->references('id')->on('vehicles');
            $table->foreignId('tow_user')->nullable()->references('id')->on('tow_users')->nullOnDelete();
            $table->double('pickup_lat');
            $table->double('pickup_long');
            $table->string('pickup_note')->nullable();
            $table->double('dropoff_lat');
            $table->double('dropoff_long');
            $table->string('status', 20);
            $table->integer('price')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tow_requests');
    }
};
