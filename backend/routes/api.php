<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ElementController;

Route::get('elements', [ElementController::class, 'index']);
