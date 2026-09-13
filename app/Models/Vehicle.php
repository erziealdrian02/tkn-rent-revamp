<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ms_vehicles';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'tax_expiry' => 'date',
    ];

    public static function generateVehicleCode(string $plateNumber): string
    {
        $prefix = 'VHC-';

        $digits = preg_replace('/[^0-9]/', '', $plateNumber);

        if (empty($digits)) {
            $digits = '00';
        }

        $randomDigits = '';
        for ($i = 0; $i < 2; $i++) {
            $randomDigits .= $digits[array_rand(str_split($digits))];
        }

        $codePrefix = "{$prefix}{$randomDigits}-";

        $count = static::where('vehicle_code', 'like', "{$codePrefix}%")->count();
        $nextNumber = $count + 1;

        return $codePrefix.str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
