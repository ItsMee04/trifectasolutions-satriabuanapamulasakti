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
        Schema::create('jeniskendaraan', function (Blueprint $table) {
            $table->id();
            $table->string('jenis', 100);
            $table->integer('indexperkm')->default(0);
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->default(1);
            $table->timestamps();

            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jeniskendaraan');
    }
};
