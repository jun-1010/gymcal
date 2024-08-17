<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('elements', function (Blueprint $table) {
            $table->unsignedInteger('id');
            $table->unsignedInteger('code');
            $table->unsignedTinyInteger('event');
            $table->unsignedTinyInteger('element_group');
            $table->string('name');
            $table->string('alias')->nullable();
            $table->unsignedTinyInteger('difficulty');
            $table->unsignedTinyInteger('row_number');
            $table->unsignedTinyInteger('column_number');
            $table->unsignedTinyInteger('start_direction');
            $table->unsignedTinyInteger('end_direction');

            // 複合主キーを設定
            $table->primary(['id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('elements');
    }
};
