<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyAccount extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ms_company_accounts';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public static function generateAccountCode(string $bankName): string
    {
        $letters = collect(explode(' ', $bankName))
            ->map(fn ($word) => strtoupper(substr($word, 0, 1)))
            ->join('');

        if (strlen($letters) < 2) {
            $letters = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $bankName), 0, 3));
        }

        $prefix = "ACC-{$letters}-";
        $count = static::where('account_code', 'like', "{$prefix}%")->count();

        $nextNumber = $count + 1;

        return $prefix.str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
