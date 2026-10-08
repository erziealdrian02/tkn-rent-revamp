# EquipRent Enterprise - Laravel Migration Guide (Part 1: Overview & Architecture)

> [!IMPORTANT]
> **To the Next AI Agent:**
> You are continuing the development of "EquipRent Enterprise," a complex Equipment Rental & Logistics ERP. The client already has a fully functional Frontend Prototype (HTML/CSS/JS + Bootstrap 5 + MockData state machine).
> **Your task is to build the actual Backend and integrate it using LARAVEL.**

## 1. Project Background
EquipRent Enterprise manages the complete lifecycle of heavy equipment rentals. It is not a simple CRUD app; it acts as a state machine. The major modules include:
- **Inventory & Stock Management**: Multi-branch stock tracking.
- **Rental Engine**: Project-based rental contracts.
- **Logistics**: Dispatch, Driver Portal, Proof of Delivery (PoD).
- **Post-Rental**: Return inspections, auto-generated repairs, and damage/loss claims.
- **Finance**: Purchasing, Goods Receipts, Invoicing, and General Ledger (Buku Besar).

## 2. Technology Stack Requirement
- **Backend Framework**: Laravel (PHP).
- **Database**: MySQL or PostgreSQL.
- **Frontend Integration**: You must reuse the existing HTML/CSS/JS prototype files. Convert the `.html` files into Laravel `.blade.php` files.
- **Authentication**: Laravel Breeze or standard session-based Auth.
- **Authorization**: Dynamic Role-Based Access Control (RBAC). Do NOT use hardcoded roles or Enums.

## 3. Recommended Development Phases
When you start generating code, please follow this phased approach to avoid overwhelming the context window:

- **Phase 1: Database & RBAC Setup**
  - Run Laravel migrations for the entire database schema (See `laravel_migration_02_database.md`).
  - Implement dynamic Roles and Permissions using standard Many-to-Many relationships.
  - Setup Laravel Auth and the User/Role management UI.
- **Phase 2: Master Data & Inventory**
  - CRUD for Customers, Projects, Branches, and Equipment.
  - Implement the `EquipmentStock` logic (tracking Available, On-Rental, Maintenance, etc.).
- **Phase 3: Core Rental & Logistics**
  - Implement the Rental creation and approval workflow.
  - Implement Deliveries (Driver assignment, dispatch, PoD).
- **Phase 4: Return, Repair & Claims**
  - Implement Return inspections. If items are missing/damaged, it must trigger the Repair and Claim system.
- **Phase 5: Finance & Purchasing**
  - Implement Invoices (from Rentals and Claims) and record partial/full Payments into the General Ledger.
  - Implement Purchase Orders and Goods Receipts.

**Next Step for AI:** Read `laravel_migration_02_database.md` to understand the database structure and relationships.
