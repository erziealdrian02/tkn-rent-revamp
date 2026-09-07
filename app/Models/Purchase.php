<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Purchase extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rnt_purchases';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function goodsReceipts()
    {
        return $this->hasMany(GoodsReceipt::class, 'purchase_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
