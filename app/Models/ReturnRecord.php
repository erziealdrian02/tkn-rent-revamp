<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReturnRecord extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rnt_returns';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function rental()
    {
        return $this->belongsTo(Rental::class, 'rental_id');
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }

    public function items()
    {
        return $this->hasMany(ReturnItem::class, 'return_id');
    }
}
