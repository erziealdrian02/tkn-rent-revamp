-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 12 Sep 2026 pada 13.31
-- Versi server: 8.0.30
-- Versi PHP: 8.5.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `tkn-rent`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_audits`
--

CREATE TABLE `log_audits` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_value` text COLLATE utf8mb4_unicode_ci,
  `new_value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_general_ledger`
--

CREATE TABLE `log_general_ledger` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_account_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `reference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_inventory_movements`
--

CREATE TABLE `log_inventory_movements` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `source_location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination_location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_09_06_044603_create_rbac_tables', 1),
(5, '2026_09_06_044604_create_master_data_tables', 1),
(6, '2026_09_06_044605_create_transaction_tables', 1),
(7, '2026_09_06_044606_create_log_tables', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_branches`
--

CREATE TABLE `ms_branches` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_company_accounts`
--

CREATE TABLE `ms_company_accounts` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opening_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_customers`
--

CREATE TABLE `ms_customers` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_drivers`
--

CREATE TABLE `ms_drivers` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_equipment`
--

CREATE TABLE `ms_equipment` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `daily_rate` decimal(15,2) NOT NULL,
  `replacement_value` decimal(15,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_equipment_stock`
--

CREATE TABLE `ms_equipment_stock` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_qty` int NOT NULL DEFAULT '0',
  `available_qty` int NOT NULL DEFAULT '0',
  `on_rental_qty` int NOT NULL DEFAULT '0',
  `maintenance_qty` int NOT NULL DEFAULT '0',
  `damaged_qty` int NOT NULL DEFAULT '0',
  `lost_qty` int NOT NULL DEFAULT '0',
  `missing_qty` int NOT NULL DEFAULT '0',
  `reserved_qty` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_permissions`
--

CREATE TABLE `ms_permissions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `ms_permissions`
--

INSERT INTO `ms_permissions` (`id`, `code`, `module`, `action`, `description`, `status`, `created_at`, `updated_at`) VALUES
('01a0751f-aeda-702f-afbb-2d424e4952b2', 'rental.view', 'Rental', 'View', NULL, 'ACTIVE', '2026-09-05 22:10:05', '2026-09-05 22:10:05'),
('01a0751f-aedc-72e3-a1c9-4982dda9b17c', 'rental.create', 'Rental', 'Create', NULL, 'ACTIVE', '2026-09-05 22:10:05', '2026-09-05 22:10:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_projects`
--

CREATE TABLE `ms_projects` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_roles`
--

CREATE TABLE `ms_roles` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `ms_roles`
--

INSERT INTO `ms_roles` (`id`, `code`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
('01a0751f-aecb-70fc-b6d3-fd5acb406c72', 'SUPER_ADMIN', 'Super Admin', 'Administrator with full access', 'ACTIVE', '2026-09-05 22:10:05', '2026-09-05 22:10:05'),
('01a0751f-aed3-7160-933c-cb4e30b579dc', 'GUDANG', 'Gudang', 'Staff Gudang', 'ACTIVE', '2026-09-05 22:10:05', '2026-09-05 22:10:05'),
('01a0751f-aed6-712c-b97c-05040c3241b9', 'SUPIR', 'Supir', 'Driver/Supir', 'ACTIVE', '2026-09-05 22:10:05', '2026-09-05 22:10:05'),
('01a0751f-aed7-73ea-8337-60b7b32b05f9', 'FINANCE', 'Finance', 'Finance Staff', 'ACTIVE', '2026-09-05 22:10:05', '2026-09-05 22:10:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_users`
--

CREATE TABLE `ms_users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `ms_users`
--

INSERT INTO `ms_users` (`id`, `username`, `password_hash`, `name`, `email`, `phone`, `status`, `created_at`, `updated_at`) VALUES
('01a0751f-af9b-739b-929d-a4209505d2cf', 'admin', '$2y$12$Grd1jgJ44XSqo9ExLT01AerK7/RPrpB9vw.daC72p/xCRa2vG6ICm', 'System Admin', 'admin@equiprent.test', NULL, 'ACTIVE', '2026-09-05 22:10:05', '2026-09-05 22:10:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ms_vehicles`
--

CREATE TABLE `ms_vehicles` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plate_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `otp_auth`
--

CREATE TABLE `otp_auth` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'LOGIN',
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_claim_items`
--

CREATE TABLE `rl_claim_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `claim_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `return_item_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount_charged` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_delivery_items`
--

CREATE TABLE `rl_delivery_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rental_item_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty_delivered` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_goods_receipt_items`
--

CREATE TABLE `rl_goods_receipt_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `goods_receipt_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchase_item_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty_received` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_invoice_items`
--

CREATE TABLE `rl_invoice_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_purchase_items`
--

CREATE TABLE `rl_purchase_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchase_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty_ordered` int NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_rental_items`
--

CREATE TABLE `rl_rental_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rental_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_return_items`
--

CREATE TABLE `rl_return_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `return_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty_good` int NOT NULL DEFAULT '0',
  `qty_damaged` int NOT NULL DEFAULT '0',
  `qty_missing` int NOT NULL DEFAULT '0',
  `qty_lost` int NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_role_permissions`
--

CREATE TABLE `rl_role_permissions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `rl_role_permissions`
--

INSERT INTO `rl_role_permissions` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
('0b7659ef-384d-49ba-9a96-42ee2b0dea0f', '01a0751f-aecb-70fc-b6d3-fd5acb406c72', '01a0751f-aeda-702f-afbb-2d424e4952b2', NULL, NULL),
('8a606d05-d55f-4ed6-8f9f-1bd3a60a919b', '01a0751f-aecb-70fc-b6d3-fd5acb406c72', '01a0751f-aedc-72e3-a1c9-4982dda9b17c', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_stock_transfer_items`
--

CREATE TABLE `rl_stock_transfer_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_transfer_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty_transferred` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rl_user_roles`
--

CREATE TABLE `rl_user_roles` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `rl_user_roles`
--

INSERT INTO `rl_user_roles` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
('3d499f86-08b9-4d31-bf9f-fc4327cf5fac', '01a0751f-af9b-739b-929d-a4209505d2cf', '01a0751f-aecb-70fc-b6d3-fd5acb406c72', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_claims`
--

CREATE TABLE `rnt_claims` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `return_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_deliveries`
--

CREATE TABLE `rnt_deliveries` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rental_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `driver_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehicle_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_date` date NOT NULL,
  `receiver_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signature_data` text COLLATE utf8mb4_unicode_ci,
  `failure_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_disposals`
--

CREATE TABLE `rnt_disposals` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty_disposed` int NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `disposal_date` date NOT NULL,
  `approved_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_goods_receipts`
--

CREATE TABLE `rnt_goods_receipts` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchase_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receive_date` date NOT NULL,
  `received_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_invoices`
--

CREATE TABLE `rnt_invoices` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `paid_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_maintenance`
--

CREATE TABLE `rnt_maintenance` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `completion_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `resolution` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_payments`
--

CREATE TABLE `rnt_payments` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_account_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_purchases`
--

CREATE TABLE `rnt_purchases` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendor_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_date` date NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_rentals`
--

CREATE TABLE `rnt_rentals` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `return_date` date NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_repairs`
--

CREATE TABLE `rnt_repairs` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `return_item_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equipment_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` decimal(15,2) NOT NULL DEFAULT '0.00',
  `resolution` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_returns`
--

CREATE TABLE `rnt_returns` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rental_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `return_date` date NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `inspected_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rnt_stock_transfers`
--

CREATE TABLE `rnt_stock_transfers` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_branch_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dest_branch_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transfer_date` date NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('1PZWNATsxKkXkS4OdBPk4I87NycG1EKS9JTyME3F', NULL, '127.0.0.1', 'Go-http-client/1.1', 'eyJfdG9rZW4iOiJVTG1zSHoyRHMxNDAxQ2swSmllaTM5WklOY09CSE9jQVRURTZKTnNCIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDAifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788671800),
('6IshM6h2YOhtWV2vAUVFWlE2RjwDxaEUaN3301qT', NULL, '127.0.0.1', 'Go-http-client/1.1', 'eyJfdG9rZW4iOiI4dFNXT1JxVjFGeVJLeE1mc0U2ZGxwMjcxVUxCQ1FjWGtjN0g2bGpXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788671838),
('CS1vApgJBKgNdGU0fUuhfvq3B3k88HLL1dx7m2Li', NULL, '127.0.0.1', 'Go-http-client/1.1', 'eyJfdG9rZW4iOiJqZzl4MzBDMzV1TW1FMFlGeUpqc3RPQVIwbTl4QVAwcFJtdFk5VUEyIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788671838),
('Cvc5VAZvgV8a2sEz81ST3tiIQ3N9qDgn1n9wlopF', '01a0751f-af9b-739b-929d-a4209505d2cf', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ3SXlTNnZWNDhad2h6UUdnZnpSanNiS0oxZnBLSDdoV1psRnhVRHlVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9yZXR1cm5zIiwicm91dGUiOiJyZXR1cm5zLmluZGV4In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOiIwMWEwNzUxZi1hZjliLTczOWItOTI5ZC1hNDIwOTUwNWQyY2YifQ==', 1788671930),
('d36of8t29ECCuz6LlaZ2mIiCFo7GTFdx5RosDIrt', NULL, '127.0.0.1', 'Go-http-client/1.1', 'eyJfdG9rZW4iOiJDd1I0NnlYNXVDS2pVSFpndXk0ZzZmdWpqSzRxdkVraEI3ZDZWM0Z2IiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDBcL2Rhc2hib2FyZCJ9LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDBcL2Rhc2hib2FyZCIsInJvdXRlIjoiZGFzaGJvYXJkIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1788671800),
('dJv7ItV2lBZ0WBNRZdgsZYa1XSYt5981vjs68I5t', '01a0751f-af9b-739b-929d-a4209505d2cf', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJmZ2pjY1JiS2RoM1dsUEhWMWhuNjRzSGMyWjg2SFZGVTFDakpzTk43IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9kYXNoYm9hcmQiLCJyb3V0ZSI6ImRhc2hib2FyZCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sInVybCI6W10sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoiMDFhMDc1MWYtYWY5Yi03MzliLTkyOWQtYTQyMDk1MDVkMmNmIn0=', 1789219662),
('k9v924I7K2YOLonINWz3bQZ3E1O8qJPhKVIESITm', NULL, '127.0.0.1', 'Go-http-client/1.1', 'eyJfdG9rZW4iOiIzWkVxa3dSWGlNZnVmZzZoenNDNk80ZmJrWWNnNmZCbFY5OEM0cnVzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788671800),
('t6g53iKpoBWAq8DHlMPXEdzf2naGnfYUBaX5I2JR', '01a0751f-af9b-739b-929d-a4209505d2cf', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJXeHJTOERRdjl1TlZCeXVKNkFLdmUzeXo5QXJhYU1rdWVWVkVnV1o4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJ1cmwiOltdLCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6IjAxYTA3NTFmLWFmOWItNzM5Yi05MjlkLWE0MjA5NTA1ZDJjZiJ9', 1788671553),
('x7GC5iVEWGyYhoFI4ptPMErws8PrDBLZMGY3qyfQ', NULL, '127.0.0.1', 'Go-http-client/1.1', 'eyJfdG9rZW4iOiIzQ3hsdW1ncG5XTkRySFRGOGdvUmQwcGg2d1JBUTA3cDRlcTBCWjJpIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788671800),
('ZG8p8uG7GP5lb22Gg1J6uK3zEhRL0xTFO39FGfCZ', NULL, '127.0.0.1', '', 'eyJfdG9rZW4iOiJOODYzeVBEamE2U0JoNFp2cnZ2bnN4V0Vzd1BQTjQxSDhpRUE1Q1R5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788671576);

-- --------------------------------------------------------

--
-- Struktur dari tabel `session_auth`
--

CREATE TABLE `session_auth` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `log_audits`
--
ALTER TABLE `log_audits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `log_audits_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `log_general_ledger`
--
ALTER TABLE `log_general_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `log_general_ledger_bank_account_id_foreign` (`bank_account_id`);

--
-- Indeks untuk tabel `log_inventory_movements`
--
ALTER TABLE `log_inventory_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `log_inventory_movements_equipment_id_foreign` (`equipment_id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `ms_branches`
--
ALTER TABLE `ms_branches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `ms_company_accounts`
--
ALTER TABLE `ms_company_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ms_company_accounts_account_number_unique` (`account_number`);

--
-- Indeks untuk tabel `ms_customers`
--
ALTER TABLE `ms_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `ms_drivers`
--
ALTER TABLE `ms_drivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ms_drivers_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `ms_equipment`
--
ALTER TABLE `ms_equipment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ms_equipment_name_unique` (`name`);

--
-- Indeks untuk tabel `ms_equipment_stock`
--
ALTER TABLE `ms_equipment_stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ms_equipment_stock_equipment_id_branch_id_unique` (`equipment_id`,`branch_id`),
  ADD KEY `ms_equipment_stock_branch_id_foreign` (`branch_id`);

--
-- Indeks untuk tabel `ms_permissions`
--
ALTER TABLE `ms_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ms_permissions_code_unique` (`code`);

--
-- Indeks untuk tabel `ms_projects`
--
ALTER TABLE `ms_projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ms_projects_customer_id_foreign` (`customer_id`);

--
-- Indeks untuk tabel `ms_roles`
--
ALTER TABLE `ms_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ms_roles_code_unique` (`code`);

--
-- Indeks untuk tabel `ms_users`
--
ALTER TABLE `ms_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ms_users_username_unique` (`username`);

--
-- Indeks untuk tabel `ms_vehicles`
--
ALTER TABLE `ms_vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ms_vehicles_plate_number_unique` (`plate_number`);

--
-- Indeks untuk tabel `otp_auth`
--
ALTER TABLE `otp_auth`
  ADD PRIMARY KEY (`id`),
  ADD KEY `otp_auth_user_id_foreign` (`user_id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `rl_claim_items`
--
ALTER TABLE `rl_claim_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_claim_items_claim_id_foreign` (`claim_id`),
  ADD KEY `rl_claim_items_return_item_id_foreign` (`return_item_id`);

--
-- Indeks untuk tabel `rl_delivery_items`
--
ALTER TABLE `rl_delivery_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_delivery_items_delivery_id_foreign` (`delivery_id`),
  ADD KEY `rl_delivery_items_rental_item_id_foreign` (`rental_item_id`);

--
-- Indeks untuk tabel `rl_goods_receipt_items`
--
ALTER TABLE `rl_goods_receipt_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_goods_receipt_items_goods_receipt_id_foreign` (`goods_receipt_id`),
  ADD KEY `rl_goods_receipt_items_purchase_item_id_foreign` (`purchase_item_id`);

--
-- Indeks untuk tabel `rl_invoice_items`
--
ALTER TABLE `rl_invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_invoice_items_invoice_id_foreign` (`invoice_id`);

--
-- Indeks untuk tabel `rl_purchase_items`
--
ALTER TABLE `rl_purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_purchase_items_purchase_id_foreign` (`purchase_id`),
  ADD KEY `rl_purchase_items_equipment_id_foreign` (`equipment_id`);

--
-- Indeks untuk tabel `rl_rental_items`
--
ALTER TABLE `rl_rental_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_rental_items_rental_id_foreign` (`rental_id`),
  ADD KEY `rl_rental_items_equipment_id_foreign` (`equipment_id`);

--
-- Indeks untuk tabel `rl_return_items`
--
ALTER TABLE `rl_return_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_return_items_return_id_foreign` (`return_id`),
  ADD KEY `rl_return_items_equipment_id_foreign` (`equipment_id`);

--
-- Indeks untuk tabel `rl_role_permissions`
--
ALTER TABLE `rl_role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rl_role_permissions_role_id_permission_id_unique` (`role_id`,`permission_id`),
  ADD KEY `rl_role_permissions_permission_id_foreign` (`permission_id`);

--
-- Indeks untuk tabel `rl_stock_transfer_items`
--
ALTER TABLE `rl_stock_transfer_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rl_stock_transfer_items_stock_transfer_id_foreign` (`stock_transfer_id`),
  ADD KEY `rl_stock_transfer_items_equipment_id_foreign` (`equipment_id`);

--
-- Indeks untuk tabel `rl_user_roles`
--
ALTER TABLE `rl_user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rl_user_roles_user_id_role_id_unique` (`user_id`,`role_id`),
  ADD KEY `rl_user_roles_role_id_foreign` (`role_id`);

--
-- Indeks untuk tabel `rnt_claims`
--
ALTER TABLE `rnt_claims`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_claims_return_id_foreign` (`return_id`),
  ADD KEY `rnt_claims_customer_id_foreign` (`customer_id`);

--
-- Indeks untuk tabel `rnt_deliveries`
--
ALTER TABLE `rnt_deliveries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_deliveries_rental_id_foreign` (`rental_id`),
  ADD KEY `rnt_deliveries_driver_id_foreign` (`driver_id`),
  ADD KEY `rnt_deliveries_vehicle_id_foreign` (`vehicle_id`);

--
-- Indeks untuk tabel `rnt_disposals`
--
ALTER TABLE `rnt_disposals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_disposals_equipment_id_foreign` (`equipment_id`),
  ADD KEY `rnt_disposals_branch_id_foreign` (`branch_id`),
  ADD KEY `rnt_disposals_approved_by_foreign` (`approved_by`);

--
-- Indeks untuk tabel `rnt_goods_receipts`
--
ALTER TABLE `rnt_goods_receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_goods_receipts_purchase_id_foreign` (`purchase_id`),
  ADD KEY `rnt_goods_receipts_received_by_foreign` (`received_by`);

--
-- Indeks untuk tabel `rnt_invoices`
--
ALTER TABLE `rnt_invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_invoices_customer_id_foreign` (`customer_id`);

--
-- Indeks untuk tabel `rnt_maintenance`
--
ALTER TABLE `rnt_maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_maintenance_equipment_id_foreign` (`equipment_id`),
  ADD KEY `rnt_maintenance_branch_id_foreign` (`branch_id`);

--
-- Indeks untuk tabel `rnt_payments`
--
ALTER TABLE `rnt_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_payments_invoice_id_foreign` (`invoice_id`),
  ADD KEY `rnt_payments_bank_account_id_foreign` (`bank_account_id`);

--
-- Indeks untuk tabel `rnt_purchases`
--
ALTER TABLE `rnt_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_purchases_branch_id_foreign` (`branch_id`);

--
-- Indeks untuk tabel `rnt_rentals`
--
ALTER TABLE `rnt_rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_rentals_project_id_foreign` (`project_id`),
  ADD KEY `rnt_rentals_created_by_foreign` (`created_by`);

--
-- Indeks untuk tabel `rnt_repairs`
--
ALTER TABLE `rnt_repairs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_repairs_return_item_id_foreign` (`return_item_id`),
  ADD KEY `rnt_repairs_equipment_id_foreign` (`equipment_id`),
  ADD KEY `rnt_repairs_branch_id_foreign` (`branch_id`);

--
-- Indeks untuk tabel `rnt_returns`
--
ALTER TABLE `rnt_returns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_returns_rental_id_foreign` (`rental_id`),
  ADD KEY `rnt_returns_inspected_by_foreign` (`inspected_by`);

--
-- Indeks untuk tabel `rnt_stock_transfers`
--
ALTER TABLE `rnt_stock_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rnt_stock_transfers_source_branch_id_foreign` (`source_branch_id`),
  ADD KEY `rnt_stock_transfers_dest_branch_id_foreign` (`dest_branch_id`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `session_auth`
--
ALTER TABLE `session_auth`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_auth_token_unique` (`token`),
  ADD KEY `session_auth_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `log_audits`
--
ALTER TABLE `log_audits`
  ADD CONSTRAINT `log_audits_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `ms_users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `log_general_ledger`
--
ALTER TABLE `log_general_ledger`
  ADD CONSTRAINT `log_general_ledger_bank_account_id_foreign` FOREIGN KEY (`bank_account_id`) REFERENCES `ms_company_accounts` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `log_inventory_movements`
--
ALTER TABLE `log_inventory_movements`
  ADD CONSTRAINT `log_inventory_movements_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `ms_drivers`
--
ALTER TABLE `ms_drivers`
  ADD CONSTRAINT `ms_drivers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `ms_users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `ms_equipment_stock`
--
ALTER TABLE `ms_equipment_stock`
  ADD CONSTRAINT `ms_equipment_stock_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `ms_branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ms_equipment_stock_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `ms_projects`
--
ALTER TABLE `ms_projects`
  ADD CONSTRAINT `ms_projects_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `ms_customers` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `otp_auth`
--
ALTER TABLE `otp_auth`
  ADD CONSTRAINT `otp_auth_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `ms_users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rl_claim_items`
--
ALTER TABLE `rl_claim_items`
  ADD CONSTRAINT `rl_claim_items_claim_id_foreign` FOREIGN KEY (`claim_id`) REFERENCES `rnt_claims` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rl_claim_items_return_item_id_foreign` FOREIGN KEY (`return_item_id`) REFERENCES `rl_return_items` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `rl_delivery_items`
--
ALTER TABLE `rl_delivery_items`
  ADD CONSTRAINT `rl_delivery_items_delivery_id_foreign` FOREIGN KEY (`delivery_id`) REFERENCES `rnt_deliveries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rl_delivery_items_rental_item_id_foreign` FOREIGN KEY (`rental_item_id`) REFERENCES `rl_rental_items` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rl_goods_receipt_items`
--
ALTER TABLE `rl_goods_receipt_items`
  ADD CONSTRAINT `rl_goods_receipt_items_goods_receipt_id_foreign` FOREIGN KEY (`goods_receipt_id`) REFERENCES `rnt_goods_receipts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rl_goods_receipt_items_purchase_item_id_foreign` FOREIGN KEY (`purchase_item_id`) REFERENCES `rl_purchase_items` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rl_invoice_items`
--
ALTER TABLE `rl_invoice_items`
  ADD CONSTRAINT `rl_invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `rnt_invoices` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rl_purchase_items`
--
ALTER TABLE `rl_purchase_items`
  ADD CONSTRAINT `rl_purchase_items_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rl_purchase_items_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `rnt_purchases` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rl_rental_items`
--
ALTER TABLE `rl_rental_items`
  ADD CONSTRAINT `rl_rental_items_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rl_rental_items_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rnt_rentals` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rl_return_items`
--
ALTER TABLE `rl_return_items`
  ADD CONSTRAINT `rl_return_items_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rl_return_items_return_id_foreign` FOREIGN KEY (`return_id`) REFERENCES `rnt_returns` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rl_role_permissions`
--
ALTER TABLE `rl_role_permissions`
  ADD CONSTRAINT `rl_role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `ms_permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rl_role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `ms_roles` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rl_stock_transfer_items`
--
ALTER TABLE `rl_stock_transfer_items`
  ADD CONSTRAINT `rl_stock_transfer_items_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rl_stock_transfer_items_stock_transfer_id_foreign` FOREIGN KEY (`stock_transfer_id`) REFERENCES `rnt_stock_transfers` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rl_user_roles`
--
ALTER TABLE `rl_user_roles`
  ADD CONSTRAINT `rl_user_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `ms_roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rl_user_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `ms_users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rnt_claims`
--
ALTER TABLE `rnt_claims`
  ADD CONSTRAINT `rnt_claims_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `ms_customers` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_claims_return_id_foreign` FOREIGN KEY (`return_id`) REFERENCES `rnt_returns` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `rnt_deliveries`
--
ALTER TABLE `rnt_deliveries`
  ADD CONSTRAINT `rnt_deliveries_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `ms_drivers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rnt_deliveries_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rnt_rentals` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_deliveries_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `ms_vehicles` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `rnt_disposals`
--
ALTER TABLE `rnt_disposals`
  ADD CONSTRAINT `rnt_disposals_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `ms_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rnt_disposals_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `ms_branches` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_disposals_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rnt_goods_receipts`
--
ALTER TABLE `rnt_goods_receipts`
  ADD CONSTRAINT `rnt_goods_receipts_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `rnt_purchases` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_goods_receipts_received_by_foreign` FOREIGN KEY (`received_by`) REFERENCES `ms_users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `rnt_invoices`
--
ALTER TABLE `rnt_invoices`
  ADD CONSTRAINT `rnt_invoices_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `ms_customers` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rnt_maintenance`
--
ALTER TABLE `rnt_maintenance`
  ADD CONSTRAINT `rnt_maintenance_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `ms_branches` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_maintenance_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rnt_payments`
--
ALTER TABLE `rnt_payments`
  ADD CONSTRAINT `rnt_payments_bank_account_id_foreign` FOREIGN KEY (`bank_account_id`) REFERENCES `ms_company_accounts` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `rnt_invoices` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rnt_purchases`
--
ALTER TABLE `rnt_purchases`
  ADD CONSTRAINT `rnt_purchases_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `ms_branches` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rnt_rentals`
--
ALTER TABLE `rnt_rentals`
  ADD CONSTRAINT `rnt_rentals_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `ms_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rnt_rentals_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `ms_projects` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rnt_repairs`
--
ALTER TABLE `rnt_repairs`
  ADD CONSTRAINT `rnt_repairs_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `ms_branches` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_repairs_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `ms_equipment` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_repairs_return_item_id_foreign` FOREIGN KEY (`return_item_id`) REFERENCES `rl_return_items` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `rnt_returns`
--
ALTER TABLE `rnt_returns`
  ADD CONSTRAINT `rnt_returns_inspected_by_foreign` FOREIGN KEY (`inspected_by`) REFERENCES `ms_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rnt_returns_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rnt_rentals` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `rnt_stock_transfers`
--
ALTER TABLE `rnt_stock_transfers`
  ADD CONSTRAINT `rnt_stock_transfers_dest_branch_id_foreign` FOREIGN KEY (`dest_branch_id`) REFERENCES `ms_branches` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `rnt_stock_transfers_source_branch_id_foreign` FOREIGN KEY (`source_branch_id`) REFERENCES `ms_branches` (`id`) ON DELETE RESTRICT;

--
-- Ketidakleluasaan untuk tabel `session_auth`
--
ALTER TABLE `session_auth`
  ADD CONSTRAINT `session_auth_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `ms_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
