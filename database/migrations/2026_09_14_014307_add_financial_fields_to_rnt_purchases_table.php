<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rnt_purchases', function (Blueprint $table) {
            $table->string('supplier_contact', 100)->nullable()->after('vendor_name');
            $table->char('bank_account_id', 36)->after('branch_id');
            $table->date('expected_arrival_date')->nullable()->after('order_date');
            $table->decimal('subtotal', 15, 2)->default(0)->after('total_amount');
            $table->decimal('discount', 15, 2)->default(0)->after('subtotal');
            $table->decimal('tax', 15, 2)->default(0)->after('discount');
            $table->decimal('shipping_cost', 15, 2)->default(0)->after('tax');

            $table->foreign('bank_account_id')->references('id')->on('ms_company_accounts')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rnt_purchases', function (Blueprint $table) {
            $table->dropForeign(['bank_account_id']);
            $table->dropColumn([
                'supplier_contact',
                'bank_account_id',
                'expected_arrival_date',
                'subtotal',
                'discount',
                'tax',
                'shipping_cost'
            ]);
        });
    }
};
