<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ms_customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->string('pic_name', 100)->nullable();
            $table->string('contact', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('address')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('ms_projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->string('name', 100);
            $table->text('location');
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
            
            $table->foreign('customer_id')->references('id')->on('ms_customers')->onDelete('cascade');
        });

        Schema::create('ms_branches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->text('location')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('ms_equipment', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->unique();
            $table->string('category', 50)->nullable();
            $table->decimal('daily_rate', 15, 2);
            $table->decimal('replacement_value', 15, 2);
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('ms_equipment_stock', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipment_id');
            $table->uuid('branch_id');
            $table->integer('total_qty')->default(0);
            $table->integer('available_qty')->default(0);
            $table->integer('on_rental_qty')->default(0);
            $table->integer('maintenance_qty')->default(0);
            $table->integer('damaged_qty')->default(0);
            $table->integer('lost_qty')->default(0);
            $table->integer('missing_qty')->default(0);
            $table->integer('reserved_qty')->default(0);
            $table->timestamps();
            
            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('cascade');
            $table->foreign('branch_id')->references('id')->on('ms_branches')->onDelete('cascade');
            $table->unique(['equipment_id', 'branch_id']);
        });

        Schema::create('ms_drivers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('license_number', 100)->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('ms_users')->onDelete('cascade');
        });

        Schema::create('ms_vehicles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('plate_number', 50)->unique();
            $table->string('type', 50)->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
        });

        Schema::create('ms_company_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->string('account_number', 50)->unique();
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ms_company_accounts');
        Schema::dropIfExists('ms_vehicles');
        Schema::dropIfExists('ms_drivers');
        Schema::dropIfExists('ms_equipment_stock');
        Schema::dropIfExists('ms_equipment');
        Schema::dropIfExists('ms_branches');
        Schema::dropIfExists('ms_projects');
        Schema::dropIfExists('ms_customers');
    }
};
