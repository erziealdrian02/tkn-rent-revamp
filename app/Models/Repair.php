<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Repair extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rnt_repairs';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function returnItem()
    {
        return $this->belongsTo(ReturnItem::class, 'return_item_id');
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}
