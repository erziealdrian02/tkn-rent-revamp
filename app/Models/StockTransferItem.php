<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockTransferItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rl_stock_transfer_items';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
