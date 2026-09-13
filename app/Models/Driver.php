<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ms_drivers';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function generateDriverCode(string $name): string
    {
        $letters = collect(explode(' ', $name))
            ->map(fn ($word) => strtoupper(substr($word, 0, 1)))
            ->join('');

        if (strlen($letters) < 2) {
            $letters = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $name), 0, 3));
        }

        $prefix = "DRV-{$letters}-";
        $count = static::where('driver_code', 'like', "{$prefix}%")->count();

        $nextNumber = $count + 1;

        return $prefix.str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
