<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'event',
        'element_group',
        'name',
        'alias',
        'difficulty',
        'row_number',
    ];
}