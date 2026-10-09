# EquipRent Enterprise - Laravel Migration Guide (Part 2: Database Schema)

> [!IMPORTANT]
> **To the Next AI Agent:**
> The client requires strict adherence to a specific table naming convention and RBAC design. You MUST use these exact table names when creating your Laravel Migrations. Do NOT use default Laravel pluralization for table names (e.g., set `protected $table = 'ms_users';` in the User model).

## 1. Naming Conventions & Rules
- **`ms_` (Master Data)**: Used for core reference data (e.g., `ms_users`, `ms_roles`, `ms_equipment`).
- **`rnt_` (Transaction)**: Used for operational records (e.g., `rnt_rentals`, `rnt_invoices`).
- **`rl_` (Relations)**: Used for junction tables and one-to-many child tables (e.g., `rl_user_roles`, `rl_rental_items`).
- **`log_` (Audit/History)**: Used for historical append-only data (e.g., `log_inventory_movements`).
- **NO ENUMS FOR ROLES**: Role and Permission management must be 100% dynamic using many-to-many junction tables.

## 2. Dynamic RBAC Schema
Implement these tables exactly as shown for authorization.
```sql
-- ms_permissions
id, code (e.g. 'rental.create'), module, action, description, status, timestamps

-- ms_roles
id, code (e.g. 'ROLE-001'), name, description, status, timestamps

-- rl_role_permissions (Junction)
id, role_id, permission_id, timestamps (UNIQUE: role_id + permission_id)

-- ms_users
id, username, password, name, email, phone, status, timestamps

-- rl_user_roles (Junction)
id, user_id, role_id, timestamps (UNIQUE: user_id + role_id)
```

## 3. Inventory & Logistics Schema
```sql
-- ms_branches
id, name, location, status, timestamps

-- ms_equipment
id, name, category, daily_rate, replacement_value, status, timestamps

-- ms_equipment_stock (Crucial for performance, prevents SUM() queries)
id, equipment_id, branch_id, total_qty, available_qty, on_rental_qty, maintenance_qty, damaged_qty, lost_qty, missing_qty, reserved_qty

-- log_inventory_movements
id, equipment_id, type (Stock In, Rent Out, etc.), quantity, source_location, destination_location, reference_id, timestamps
```

## 4. Business Transactions Schema
```sql
-- rnt_rentals
id, project_id, status, start_date, return_date, total_amount, created_by, timestamps

-- rl_rental_items
id, rental_id, equipment_id, quantity, unit_price

-- rnt_deliveries
id, rental_id, driver_id, vehicle_id, status, delivery_date, receiver_name, signature_data, failure_reason

-- rnt_returns
id, rental_id, return_date, status, inspected_by

-- rl_return_items (Contains the inspection logic)
id, return_id, equipment_id, qty_good, qty_damaged, qty_missing, qty_lost, notes

-- rnt_repairs
id, return_item_id, equipment_id, branch_id, quantity, status, cost, resolution
```

## 5. Finance & Purchasing Schema
```sql
-- rnt_purchases
id, vendor_name, branch_id, status, order_date, total_amount

-- rl_purchase_items
id, purchase_id, equipment_id, qty_ordered, unit_price

-- rnt_goods_receipts
id, purchase_id, receive_date, received_by

-- rl_goods_receipt_items
id, goods_receipt_id, purchase_item_id, qty_received

-- rnt_invoices
id, reference_id (Rental or Claim), customer_id, type, status, issue_date, due_date, amount, paid_amount

-- rnt_payments
id, invoice_id, bank_account_id, payment_date, amount, payment_method

-- log_general_ledger
id, bank_account_id, date, reference, type (IN/OUT), amount, description
```

**Next Step for AI:** Read `laravel_migration_03_business_logic.md` to understand how data moves between these tables (The State Machine).
