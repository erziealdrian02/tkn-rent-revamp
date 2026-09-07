<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClaimItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rl_claim_items';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function claim()
    {
        return $this->belongsTo(Claim::class, 'claim_id');
    }

    public function returnItem()
    {
        return $this->belongsTo(ReturnItem::class, 'return_item_id');
    }
}
