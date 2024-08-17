<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'code',
        'event',
        'element_group',
        'name',
        'alias',
        'difficulty',
        'row_number',
        'column_number',
        'start_direction',
        'end_direction',
    ];
}