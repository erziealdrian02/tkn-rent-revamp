<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SessionAuth extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'session_auth';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
