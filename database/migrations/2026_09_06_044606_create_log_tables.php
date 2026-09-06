<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_audits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('action', 50);
            $table->string('entity_type', 100);
            $table->uuid('entity_id')->nullable();
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('ms_users')->onDelete('set null');
        });

        Schema::create('log_inventory_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipment_id');
            $table->string('type', 50);
            $table->integer('quantity');
            $table->string('source_location', 100)->nullable();
            $table->string('destination_location', 100)->nullable();
            $table->string('reference_id', 50)->nullable(); // Loosely coupled reference
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
        });

        Schema::create('log_general_ledger', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('bank_account_id');
            $table->date('date');
            $table->string('reference', 50)->nullable();
            $table->string('type', 10);
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('bank_account_id')->references('id')->on('ms_company_accounts')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_general_ledger');
        Schema::dropIfExists('log_inventory_movements');
        Schema::dropIfExists('log_audits');
    }
};
