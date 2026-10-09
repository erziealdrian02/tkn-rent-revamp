# EquipRent Enterprise - Database Schema

Berikut adalah rancangan akhir skema database (SQL DDL) untuk migrasi ke Java Spring Boot + JPA / Hibernate, sesuai dengan aturan konvensi penamaan (`ms_`, `rnt_`, `rl_`, `log_`) dan mendukung *Dynamic Role-Based Access Control* (RBAC) di mana entitas User, Role, dan Permission menggunakan relasi *Many-to-Many*.

---

## 1. DYNAMIC RBAC & SYSTEM CONFIGURATION

```sql
-- MASTER: PERMISSIONS
CREATE TABLE ms_permissions (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g. "rental.view"
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MASTER: ROLES
CREATE TABLE ms_roles (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. "ROLE-001"
    name VARCHAR(100) NOT NULL,       -- e.g. "Rental Supervisor"
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RELATION: ROLE ↔ PERMISSION (Many-to-Many)
CREATE TABLE rl_role_permissions (
    id VARCHAR(36) PRIMARY KEY,
    role_id VARCHAR(36) REFERENCES ms_roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) REFERENCES ms_permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- MASTER: USERS
CREATE TABLE ms_users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, LOCKED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RELATION: USER ↔ ROLE (Many-to-Many)
CREATE TABLE rl_user_roles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES ms_users(id) ON DELETE CASCADE,
    role_id VARCHAR(36) REFERENCES ms_roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);
```

---

## 2. MASTER DATA (BUSINESS ENTITIES)

```sql
CREATE TABLE ms_customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pic_name VARCHAR(100),
    contact VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ms_projects (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) REFERENCES ms_customers(id),
    name VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ms_branches (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE ms_equipment (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    daily_rate DECIMAL(15,2) NOT NULL,
    replacement_value DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE ms_equipment_stock (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    branch_id VARCHAR(36) REFERENCES ms_branches(id),
    total_qty INT NOT NULL DEFAULT 0,
    available_qty INT NOT NULL DEFAULT 0,
    on_rental_qty INT NOT NULL DEFAULT 0,
    maintenance_qty INT NOT NULL DEFAULT 0,
    damaged_qty INT NOT NULL DEFAULT 0,
    lost_qty INT NOT NULL DEFAULT 0,
    missing_qty INT NOT NULL DEFAULT 0,
    reserved_qty INT NOT NULL DEFAULT 0,
    UNIQUE(equipment_id, branch_id)
);

CREATE TABLE ms_drivers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES ms_users(id),
    license_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE ms_vehicles (
    id VARCHAR(36) PRIMARY KEY,
    plate_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE ms_company_accounts (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    opening_balance DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);
```

---

## 3. TRANSACTIONS & THEIR RELATION TABLES

### 3A. RENTAL & DELIVERY

```sql
CREATE TABLE rnt_rentals (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) REFERENCES ms_projects(id),
    status VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) REFERENCES ms_users(id)
);

CREATE TABLE rl_rental_items (
    id VARCHAR(36) PRIMARY KEY,
    rental_id VARCHAR(36) REFERENCES rnt_rentals(id) ON DELETE CASCADE,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL
);

CREATE TABLE rnt_deliveries (
    id VARCHAR(36) PRIMARY KEY,
    rental_id VARCHAR(36) REFERENCES rnt_rentals(id),
    driver_id VARCHAR(36) REFERENCES ms_drivers(id),
    vehicle_id VARCHAR(36) REFERENCES ms_vehicles(id),
    status VARCHAR(50) NOT NULL,
    delivery_date DATE NOT NULL,
    receiver_name VARCHAR(100),
    signature_data TEXT,
    failure_reason TEXT
);

CREATE TABLE rl_delivery_items (
    id VARCHAR(36) PRIMARY KEY,
    delivery_id VARCHAR(36) REFERENCES rnt_deliveries(id) ON DELETE CASCADE,
    rental_item_id VARCHAR(36) REFERENCES rl_rental_items(id),
    qty_delivered INT NOT NULL
);
```

### 3B. RETURN, REPAIR, CLAIMS & MAINTENANCE

```sql
CREATE TABLE rnt_returns (
    id VARCHAR(36) PRIMARY KEY,
    rental_id VARCHAR(36) REFERENCES rnt_rentals(id),
    return_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    inspected_by VARCHAR(36) REFERENCES ms_users(id)
);

CREATE TABLE rl_return_items (
    id VARCHAR(36) PRIMARY KEY,
    return_id VARCHAR(36) REFERENCES rnt_returns(id) ON DELETE CASCADE,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    qty_good INT DEFAULT 0,
    qty_damaged INT DEFAULT 0,
    qty_missing INT DEFAULT 0,
    qty_lost INT DEFAULT 0,
    notes TEXT
);

CREATE TABLE rnt_repairs (
    id VARCHAR(36) PRIMARY KEY,
    return_item_id VARCHAR(36) REFERENCES rl_return_items(id),
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    branch_id VARCHAR(36) REFERENCES ms_branches(id),
    quantity INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    cost DECIMAL(15,2) DEFAULT 0,
    resolution TEXT
);

CREATE TABLE rnt_claims (
    id VARCHAR(36) PRIMARY KEY,
    return_id VARCHAR(36) REFERENCES rnt_returns(id),
    customer_id VARCHAR(36) REFERENCES ms_customers(id),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT
);

CREATE TABLE rl_claim_items (
    id VARCHAR(36) PRIMARY KEY,
    claim_id VARCHAR(36) REFERENCES rnt_claims(id) ON DELETE CASCADE,
    return_item_id VARCHAR(36) REFERENCES rl_return_items(id),
    amount_charged DECIMAL(15,2) NOT NULL
);

CREATE TABLE rnt_maintenance (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    branch_id VARCHAR(36) REFERENCES ms_branches(id),
    quantity INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    completion_date DATE,
    notes TEXT,
    resolution TEXT
);
```

### 3C. PURCHASING, STOCK TRANSFERS & DISPOSALS

```sql
CREATE TABLE rnt_purchases (
    id VARCHAR(36) PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL,
    branch_id VARCHAR(36) REFERENCES ms_branches(id),
    status VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL
);

CREATE TABLE rl_purchase_items (
    id VARCHAR(36) PRIMARY KEY,
    purchase_id VARCHAR(36) REFERENCES rnt_purchases(id) ON DELETE CASCADE,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    qty_ordered INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL
);

CREATE TABLE rnt_goods_receipts (
    id VARCHAR(36) PRIMARY KEY,
    purchase_id VARCHAR(36) REFERENCES rnt_purchases(id),
    receive_date DATE NOT NULL,
    received_by VARCHAR(36) REFERENCES ms_users(id)
);

CREATE TABLE rl_goods_receipt_items (
    id VARCHAR(36) PRIMARY KEY,
    goods_receipt_id VARCHAR(36) REFERENCES rnt_goods_receipts(id) ON DELETE CASCADE,
    purchase_item_id VARCHAR(36) REFERENCES rl_purchase_items(id),
    qty_received INT NOT NULL
);

CREATE TABLE rnt_stock_transfers (
    id VARCHAR(36) PRIMARY KEY,
    source_branch_id VARCHAR(36) REFERENCES ms_branches(id),
    dest_branch_id VARCHAR(36) REFERENCES ms_branches(id),
    transfer_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT
);

CREATE TABLE rl_stock_transfer_items (
    id VARCHAR(36) PRIMARY KEY,
    stock_transfer_id VARCHAR(36) REFERENCES rnt_stock_transfers(id) ON DELETE CASCADE,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    qty_transferred INT NOT NULL
);

CREATE TABLE rnt_disposals (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    branch_id VARCHAR(36) REFERENCES ms_branches(id),
    qty_disposed INT NOT NULL,
    reason TEXT,
    disposal_date DATE NOT NULL,
    approved_by VARCHAR(36) REFERENCES ms_users(id)
);
```

### 3D. FINANCE & BILLING

```sql
CREATE TABLE rnt_invoices (
    id VARCHAR(36) PRIMARY KEY,
    reference_id VARCHAR(36),
    customer_id VARCHAR(36) REFERENCES ms_customers(id),
    type VARCHAR(50) NOT NULL, -- Rental, Claim
    status VARCHAR(50) NOT NULL, -- Issued, Partially Paid, Paid, Overdue
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) DEFAULT 0
);

CREATE TABLE rl_invoice_items (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) REFERENCES rnt_invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL
);

CREATE TABLE rnt_payments (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) REFERENCES rnt_invoices(id),
    bank_account_id VARCHAR(36) REFERENCES ms_company_accounts(id),
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100)
);
```

---

## 4. AUDIT & LOGGING

```sql
CREATE TABLE log_audits (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES ms_users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(36),
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE log_inventory_movements (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) REFERENCES ms_equipment(id),
    type VARCHAR(50) NOT NULL, -- Stock In, Rent Out, Return, Transfer, Maintenance
    quantity INT NOT NULL,
    source_location VARCHAR(100),
    destination_location VARCHAR(100),
    reference_id VARCHAR(50), -- Loose coupling ke transaksi ID
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE log_general_ledger (
    id VARCHAR(36) PRIMARY KEY,
    bank_account_id VARCHAR(36) REFERENCES ms_company_accounts(id),
    date DATE NOT NULL,
    reference VARCHAR(50),
    type VARCHAR(10) NOT NULL, -- IN, OUT
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
