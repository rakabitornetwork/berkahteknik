<?php

use Database\Seeders\SuperadminSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        (new SuperadminSeeder)->run();
    }

    public function down(): void
    {
        // Keep the account; it is an operational login, not schema.
    }
};
