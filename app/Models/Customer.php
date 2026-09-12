<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ms_customers';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    public function projects()
    {
        return $this->hasMany(Project::class, 'customer_id');
    }
}
