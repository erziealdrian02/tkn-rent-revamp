<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RentalItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rl_rental_items';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function rental()
    {
        return $this->belongsTo(Rental::class, 'rental_id');
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }
}
