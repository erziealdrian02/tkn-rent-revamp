<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ms_permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 100)->unique();
            $table->string('module', 50);
            $table->string('action', 50);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('ms_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 50)->unique();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('rl_role_permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('role_id');
            $table->uuid('permission_id');
            $table->timestamps();

            $table->foreign('role_id')->references('id')->on('ms_roles')->onDelete('cascade');
            $table->foreign('permission_id')->references('id')->on('ms_permissions')->onDelete('cascade');
            $table->unique(['role_id', 'permission_id']);
        });

        Schema::create('rl_user_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('role_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('ms_users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('ms_roles')->onDelete('cascade');
            $table->unique(['user_id', 'role_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rl_user_roles');
        Schema::dropIfExists('rl_role_permissions');
        Schema::dropIfExists('ms_roles');
        Schema::dropIfExists('ms_permissions');
    }
};
