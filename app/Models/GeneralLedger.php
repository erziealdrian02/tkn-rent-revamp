<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GeneralLedger extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'log_general_ledger';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
