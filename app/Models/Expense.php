<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'expense_date',
        'category',
        'amount',
        'description',
    ];

    protected $casts = [
        'expense_date' => 'date',
        'amount'       => 'float',
    ];
}
