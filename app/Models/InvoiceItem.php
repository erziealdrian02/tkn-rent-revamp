<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvoiceItem extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rl_invoice_items';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
