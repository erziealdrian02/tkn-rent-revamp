<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rnt_rentals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('status', 50);
            $table->date('start_date');
            $table->date('return_date');
            $table->decimal('total_amount', 15, 2);
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('ms_projects')->onDelete('restrict');
            $table->foreign('created_by')->references('id')->on('ms_users')->onDelete('set null');
        });

        Schema::create('rl_rental_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('rental_id');
            $table->uuid('equipment_id');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->timestamps();

            $table->foreign('rental_id')->references('id')->on('rnt_rentals')->onDelete('cascade');
            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
        });

        Schema::create('rnt_deliveries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('rental_id');
            $table->uuid('driver_id')->nullable();
            $table->uuid('vehicle_id')->nullable();
            $table->string('status', 50);
            $table->date('delivery_date');
            $table->string('receiver_name', 100)->nullable();
            $table->text('signature_data')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamps();

            $table->foreign('rental_id')->references('id')->on('rnt_rentals')->onDelete('restrict');
            $table->foreign('driver_id')->references('id')->on('ms_drivers')->onDelete('set null');
            $table->foreign('vehicle_id')->references('id')->on('ms_vehicles')->onDelete('set null');
        });

        Schema::create('rl_delivery_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('delivery_id');
            $table->uuid('rental_item_id');
            $table->integer('qty_delivered');
            $table->timestamps();

            $table->foreign('delivery_id')->references('id')->on('rnt_deliveries')->onDelete('cascade');
            $table->foreign('rental_item_id')->references('id')->on('rl_rental_items')->onDelete('restrict');
        });

        Schema::create('rnt_returns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('rental_id');
            $table->date('return_date');
            $table->string('status', 50);
            $table->uuid('inspected_by')->nullable();
            $table->timestamps();

            $table->foreign('rental_id')->references('id')->on('rnt_rentals')->onDelete('restrict');
            $table->foreign('inspected_by')->references('id')->on('ms_users')->onDelete('set null');
        });

        Schema::create('rl_return_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('return_id');
            $table->uuid('equipment_id');
            $table->integer('qty_good')->default(0);
            $table->integer('qty_damaged')->default(0);
            $table->integer('qty_missing')->default(0);
            $table->integer('qty_lost')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('return_id')->references('id')->on('rnt_returns')->onDelete('cascade');
            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
        });

        Schema::create('rnt_repairs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('return_item_id')->nullable();
            $table->uuid('equipment_id');
            $table->uuid('branch_id');
            $table->integer('quantity');
            $table->string('status', 50);
            $table->decimal('cost', 15, 2)->default(0);
            $table->text('resolution')->nullable();
            $table->timestamps();

            $table->foreign('return_item_id')->references('id')->on('rl_return_items')->onDelete('set null');
            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
            $table->foreign('branch_id')->references('id')->on('ms_branches')->onDelete('restrict');
        });

        Schema::create('rnt_claims', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('return_id')->nullable();
            $table->uuid('customer_id');
            $table->string('type', 50);
            $table->string('status', 50);
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('return_id')->references('id')->on('rnt_returns')->onDelete('set null');
            $table->foreign('customer_id')->references('id')->on('ms_customers')->onDelete('restrict');
        });

        Schema::create('rl_claim_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('claim_id');
            $table->uuid('return_item_id')->nullable();
            $table->decimal('amount_charged', 15, 2);
            $table->timestamps();

            $table->foreign('claim_id')->references('id')->on('rnt_claims')->onDelete('cascade');
            $table->foreign('return_item_id')->references('id')->on('rl_return_items')->onDelete('set null');
        });

        Schema::create('rnt_maintenance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipment_id');
            $table->uuid('branch_id');
            $table->integer('quantity');
            $table->string('type', 50);
            $table->string('status', 50);
            $table->date('start_date');
            $table->date('completion_date')->nullable();
            $table->text('notes')->nullable();
            $table->text('resolution')->nullable();
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
            $table->foreign('branch_id')->references('id')->on('ms_branches')->onDelete('restrict');
        });

        Schema::create('rnt_purchases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('vendor_name', 100);
            $table->uuid('branch_id');
            $table->string('status', 50);
            $table->date('order_date');
            $table->decimal('total_amount', 15, 2);
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('ms_branches')->onDelete('restrict');
        });

        Schema::create('rl_purchase_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('purchase_id');
            $table->uuid('equipment_id');
            $table->integer('qty_ordered');
            $table->decimal('unit_price', 15, 2);
            $table->timestamps();

            $table->foreign('purchase_id')->references('id')->on('rnt_purchases')->onDelete('cascade');
            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
        });

        Schema::create('rnt_goods_receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('purchase_id');
            $table->date('receive_date');
            $table->uuid('received_by')->nullable();
            $table->timestamps();

            $table->foreign('purchase_id')->references('id')->on('rnt_purchases')->onDelete('restrict');
            $table->foreign('received_by')->references('id')->on('ms_users')->onDelete('set null');
        });

        Schema::create('rl_goods_receipt_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('goods_receipt_id');
            $table->uuid('purchase_item_id');
            $table->integer('qty_received');
            $table->timestamps();

            $table->foreign('goods_receipt_id')->references('id')->on('rnt_goods_receipts')->onDelete('cascade');
            $table->foreign('purchase_item_id')->references('id')->on('rl_purchase_items')->onDelete('restrict');
        });

        Schema::create('rnt_stock_transfers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('source_branch_id');
            $table->uuid('dest_branch_id');
            $table->date('transfer_date');
            $table->string('status', 50);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('source_branch_id')->references('id')->on('ms_branches')->onDelete('restrict');
            $table->foreign('dest_branch_id')->references('id')->on('ms_branches')->onDelete('restrict');
        });

        Schema::create('rl_stock_transfer_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('stock_transfer_id');
            $table->uuid('equipment_id');
            $table->integer('qty_transferred');
            $table->timestamps();

            $table->foreign('stock_transfer_id')->references('id')->on('rnt_stock_transfers')->onDelete('cascade');
            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
        });

        Schema::create('rnt_disposals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('equipment_id');
            $table->uuid('branch_id');
            $table->integer('qty_disposed');
            $table->text('reason')->nullable();
            $table->date('disposal_date');
            $table->uuid('approved_by')->nullable();
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('ms_equipment')->onDelete('restrict');
            $table->foreign('branch_id')->references('id')->on('ms_branches')->onDelete('restrict');
            $table->foreign('approved_by')->references('id')->on('ms_users')->onDelete('set null');
        });

        Schema::create('rnt_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('reference_id', 36)->nullable();
            $table->uuid('customer_id');
            $table->string('type', 50);
            $table->string('status', 50);
            $table->date('issue_date');
            $table->date('due_date');
            $table->decimal('amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('ms_customers')->onDelete('restrict');
        });

        Schema::create('rl_invoice_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->text('description');
            $table->decimal('amount', 15, 2);
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('rnt_invoices')->onDelete('cascade');
        });

        Schema::create('rnt_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->uuid('bank_account_id');
            $table->date('payment_date');
            $table->decimal('amount', 15, 2);
            $table->string('payment_method', 50)->nullable();
            $table->string('reference_number', 100)->nullable();
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('rnt_invoices')->onDelete('restrict');
            $table->foreign('bank_account_id')->references('id')->on('ms_company_accounts')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rnt_payments');
        Schema::dropIfExists('rl_invoice_items');
        Schema::dropIfExists('rnt_invoices');
        Schema::dropIfExists('rnt_disposals');
        Schema::dropIfExists('rl_stock_transfer_items');
        Schema::dropIfExists('rnt_stock_transfers');
        Schema::dropIfExists('rl_goods_receipt_items');
        Schema::dropIfExists('rnt_goods_receipts');
        Schema::dropIfExists('rl_purchase_items');
        Schema::dropIfExists('rnt_purchases');
        Schema::dropIfExists('rnt_maintenance');
        Schema::dropIfExists('rl_claim_items');
        Schema::dropIfExists('rnt_claims');
        Schema::dropIfExists('rnt_repairs');
        Schema::dropIfExists('rl_return_items');
        Schema::dropIfExists('rnt_returns');
        Schema::dropIfExists('rl_delivery_items');
        Schema::dropIfExists('rnt_deliveries');
        Schema::dropIfExists('rl_rental_items');
        Schema::dropIfExists('rnt_rentals');
    }
};
