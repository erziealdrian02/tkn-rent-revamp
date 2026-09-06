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
}
