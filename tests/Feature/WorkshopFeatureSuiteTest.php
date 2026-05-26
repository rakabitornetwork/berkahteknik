<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class WorkshopFeatureSuiteTest extends TestCase
{
    public function test_feature_suite_tables_exist(): void
    {
        foreach ([
            'feature_flags',
            'service_payments',
            'cash_ledger_entries',
            'stock_movements',
            'return_transactions',
            'warranty_claims',
            'mechanic_attendances',
            'mechanic_commissions',
            'audit_logs',
            'customer_follow_ups',
            'branches',
            'warehouses',
            'backup_records',
        ] as $table) {
            $this->assertTrue(Schema::hasTable($table), "Missing table: {$table}");
        }

        $this->assertTrue(Schema::hasColumn('users', 'attendance_qr_token'));
    }

    public function test_pro_features_are_locked_by_default(): void
    {
        $this->assertFalse(config('features.pro.automatic_notifications.enabled'));
        $this->assertTrue(config('features.pro.automatic_notifications.locked'));
        $this->assertFalse(config('features.pro.digital_payments.enabled'));
        $this->assertTrue(config('features.pro.digital_payments.locked'));
    }

    public function test_operational_routes_are_registered(): void
    {
        foreach ([
            'admin.bookings.index',
            'admin.service-payments.index',
            'admin.finance.index',
            'admin.stock-movements.index',
            'admin.returns.index',
            'admin.warranty-claims.index',
            'admin.mechanic-ops.index',
            'admin.mechanic-ops.attendance.scan',
            'admin.mechanic-ops.mechanics.qr-token',
            'admin.audit-logs.index',
            'admin.crm.follow-ups.index',
            'admin.branches-warehouses.index',
            'admin.backups.index',
            'admin.pro.notifications',
            'admin.pro.digital-payments',
        ] as $route) {
            $this->assertTrue(Route::has($route), "Missing route: {$route}");
        }
    }
}
