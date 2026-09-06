<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Delivery extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rnt_deliveries';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function rental()
    {
        return $this->belongsTo(Rental::class, 'rental_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function items()
    {
        return $this->hasMany(DeliveryItem::class, 'delivery_id');
    }
}
