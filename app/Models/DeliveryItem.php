<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rl_delivery_items';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class, 'delivery_id');
    }

    public function rentalItem()
    {
        return $this->belongsTo(RentalItem::class, 'rental_item_id');
    }
}
