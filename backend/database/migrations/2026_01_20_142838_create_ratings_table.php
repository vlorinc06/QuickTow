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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->foreignId('tow_user')->nullable()->references('id')->on('tow_users')->nullOnDelete();
            $table->foreignId('tow_request')->references('id')->on('tow_requests');
            $table->integer('rating');
            $table->string('text', 200)->nullable();
            $table->date('date')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
