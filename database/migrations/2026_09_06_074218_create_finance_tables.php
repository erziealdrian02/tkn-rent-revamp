<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Phase 6 Finance Tables:
     *   rnt_purchases       – Purchase Orders for new equipment
     *   rnt_goods_receipts  – Goods Receipt against a PO (triggers StockIn)
     *   rnt_invoices        – Invoices (rental or claim-based)
     *   rnt_invoice_items   – Line items for each invoice
     *   rnt_payments        – Payment records (supports partial/instalment)
     *   log_general_ledger  – Immutable cashflow ledger (money-in / money-out)
     */
    public function up(): void
    {
        // ── Purchase Orders ──────────────────────────────────────────────────
        Schema::create('rnt_purchases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('po_number')->unique();
            $table->uuid('equipment_id');
            $table->integer('qty_ordered');
            $table->decimal('unit_price', 18, 2)->default(0);
            $table->decimal('total_amount', 18, 2)->default(0);
            $table->string('vendor_name')->nullable();
            $table->string('status')->default('DRAFT'); // DRAFT | APPROVED | RECEIVED | CANCELLED
            $table->date('order_date');
            $table->date('expected_delivery')->nullable();
            $table->text('notes')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('ms_equipment');
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });

        // ── Goods Receipts ────────────────────────────────────────────────────
        Schema::create('rnt_goods_receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('gr_number')->unique();
            $table->uuid('purchase_id');
            $table->uuid('branch_id');                  // destination warehouse
            $table->integer('qty_received');
            $table->date('received_date');
            $table->text('notes')->nullable();
            $table->uuid('received_by')->nullable();
            $table->timestamps();

            $table->foreign('purchase_id')->references('id')->on('rnt_purchases');
            $table->foreign('branch_id')->references('id')->on('ms_branches');
            $table->foreign('received_by')->references('id')->on('users')->nullOnDelete();
        });

        // ── Invoices ──────────────────────────────────────────────────────────
        Schema::create('rnt_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->string('type')->default('RENTAL'); // RENTAL | CLAIM
            $table->uuid('rental_id')->nullable();
            $table->uuid('claim_id')->nullable();
            $table->uuid('customer_id');
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->decimal('discount', 18, 2)->default(0);
            $table->decimal('tax', 18, 2)->default(0);
            $table->decimal('total_amount', 18, 2)->default(0);
            $table->decimal('paid_amount', 18, 2)->default(0);
            $table->string('status')->default('DRAFT'); // DRAFT | ISSUED | PARTIAL | PAID | OVERDUE | CANCELLED
            $table->date('issue_date');
            $table->date('due_date');
            $table->text('notes')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->foreign('rental_id')->references('id')->on('rnt_rentals')->nullOnDelete();
            $table->foreign('customer_id')->references('id')->on('ms_customers');
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });

        // ── Invoice Items ─────────────────────────────────────────────────────
        Schema::create('rnt_invoice_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->string('description');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 18, 2)->default(0);
            $table->decimal('subtotal', 18, 2)->default(0);
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('rnt_invoices')->cascadeOnDelete();
        });

        // ── Payments ──────────────────────────────────────────────────────────
        Schema::create('rnt_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->decimal('amount', 18, 2);
            $table->string('payment_method')->default('BANK_TRANSFER'); // BANK_TRANSFER | CASH | CHEQUE
            $table->string('reference_number')->nullable();             // bank ref / cheque no
            $table->uuid('company_account_id')->nullable();             // receiving bank account
            $table->date('payment_date');
            $table->text('notes')->nullable();
            $table->uuid('recorded_by')->nullable();
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('rnt_invoices');
            $table->foreign('recorded_by')->references('id')->on('users')->nullOnDelete();
        });

        // ── General Ledger (immutable cashflow log) ───────────────────────────
        Schema::create('log_general_ledger', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('entry_type');                // MONEY_IN | MONEY_OUT | ADJUSTMENT
            $table->string('category');                  // RENTAL_PAYMENT | CLAIM_PAYMENT | PURCHASE | etc.
            $table->uuid('reference_id')->nullable();    // payment_id / purchase_id
            $table->string('reference_type')->nullable();// class name
            $table->uuid('company_account_id')->nullable();
            $table->decimal('amount', 18, 2);
            $table->decimal('running_balance', 18, 2)->default(0);
            $table->string('description');
            $table->date('transaction_date');
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_general_ledger');
        Schema::dropIfExists('rnt_payments');
        Schema::dropIfExists('rnt_invoice_items');
        Schema::dropIfExists('rnt_invoices');
        Schema::dropIfExists('rnt_goods_receipts');
        Schema::dropIfExists('rnt_purchases');
    }
};
