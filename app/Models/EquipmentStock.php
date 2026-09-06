<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EquipmentStock extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ms_equipment_stock';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
