<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rental extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rnt_rentals';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function items()
    {
        return $this->hasMany(RentalItem::class, 'rental_id');
    }

    public function deliveries()
    {
        return $this->hasMany(Delivery::class, 'rental_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
