# EquipRent Enterprise - Laravel Migration Guide (Part 3: Business Logic)

> [!IMPORTANT]
> **To the Next AI Agent:**
> The current HTML prototype relies on a vanilla JavaScript file (`business-logic.js`) that acts as a mock backend and state machine. Your most critical task is to port these state transitions into Laravel Controllers, Services, or Observers.

## 1. The Stock Manager Pattern
Do NOT calculate stock dynamically using `SUM()` queries across transactions. That will crash the system at scale.
Instead, strictly maintain the `ms_equipment_stock` table using a Stock Service.

**When a Rental is Approved:**
1. Deduct `available_qty`
2. Add to `reserved_qty`

**When Delivery Departs:**
1. Deduct `reserved_qty`
2. Add to `on_rental_qty`
3. Write to `log_inventory_movements` (Type: Rent Out)

**When Maintenance Starts:**
1. Deduct `available_qty`
2. Add to `maintenance_qty`

## 2. The Return Inspection Workflow
When items are returned, the warehouse staff inspects them. This is where business complexity spikes:
- If 10 items were rented, they might return 8 Good, 1 Damaged, 1 Missing.
- **Good Items**: Go back to `available_qty`.
- **Damaged Items**: Go to `damaged_qty`. **Auto-trigger** a new record in `rnt_repairs` (Status: Pending) and `rnt_claims` (Type: Damage).
- **Missing Items**: Go to `missing_qty`. **Auto-trigger** a new record in `rnt_claims` (Type: Missing).

## 3. The Claim & Invoice Lifecycle
Claims for damaged/lost items require customer approval.
- When a claim is created, it is `Pending`.
- Once the customer agrees, the claim status becomes `Billed`.
- **Auto-trigger**: Generate a new Invoice in `rnt_invoices` (Type: Claim).

## 4. The Purchasing & Goods Receipt Flow
- Creating a Purchase Order (`rnt_purchases`) does NOT increase stock.
- The warehouse must create a Goods Receipt (`rnt_goods_receipts`) linked to the PO.
- A PO can be partially received.
- **Auto-trigger**: When a Goods Receipt is saved, increment `available_qty` in `ms_equipment_stock` and log it in `log_inventory_movements` (Type: Stock In).

## 5. Finance & Ledger
- Invoices can receive partial payments.
- When a payment is recorded in `rnt_payments`:
  1. Increment the `paid_amount` on `rnt_invoices`.
  2. If `paid_amount == amount`, mark Invoice as `Paid`.
  3. **Auto-trigger**: Write a Credit (IN) transaction to `log_general_ledger` for the specific `bank_account_id`.

**Final Advice to AI:** Build these rules inside isolated Laravel Service classes (e.g., `StockService`, `RentalService`, `FinanceService`). Keep the controllers skinny! Good luck.
