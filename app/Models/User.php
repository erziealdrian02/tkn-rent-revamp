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

    /**
     * Laravel Auth uses 'password' by default, but our column is 'password_hash'.
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    /**
     * Get user's initials for the sidebar avatar.
     */
    public function getInitialsAttribute(): string
    {
        $words = explode(' ', $this->name);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }
        return $initials;
    }

    /**
     * Roles relationship via junction table.
     */
    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'rl_user_roles', 'user_id', 'role_id');
    }

    /**
     * Check if user has a specific permission code.
     */
    public function hasPermission(string $permissionCode): bool
    {
        return $this->roles()
            ->where('ms_roles.status', 'ACTIVE')
            ->whereHas('permissions', function ($query) use ($permissionCode) {
                $query->where('code', $permissionCode)->where('ms_permissions.status', 'ACTIVE');
            })
            ->exists();
    }
}
