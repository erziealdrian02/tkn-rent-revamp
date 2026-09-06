<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, HasUuids;

    protected $table = 'ms_users';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
