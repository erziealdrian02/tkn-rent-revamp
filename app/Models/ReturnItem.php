<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReturnItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rl_return_items';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function returnRecord()
    {
        return $this->belongsTo(ReturnRecord::class, 'return_id');
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }
}
