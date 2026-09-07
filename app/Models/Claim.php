<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Claim extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rnt_claims';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function returnRecord()
    {
        return $this->belongsTo(ReturnRecord::class, 'return_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function items()
    {
        return $this->hasMany(ClaimItem::class, 'claim_id');
    }
}
