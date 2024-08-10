<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('elements', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('event');
            $table->unsignedTinyInteger('element_group');
            $table->string('name');
            $table->string('alias')->nullable();
            $table->unsignedTinyInteger('difficulty');
            $table->unsignedTinyInteger('row_number');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('elements');
    }
};