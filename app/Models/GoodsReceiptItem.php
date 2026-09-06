<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GoodsReceiptItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rl_goods_receipt_items';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
