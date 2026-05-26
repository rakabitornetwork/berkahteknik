<?php

return [
    'pro' => [
        'automatic_notifications' => [
            'label' => 'Notifikasi WhatsApp/Email Otomatis',
            'description' => 'Kirim pesan otomatis untuk booking, status servis, invoice, stok menipis, dan garansi.',
            'enabled' => false,
            'locked' => true,
        ],
        'digital_payments' => [
            'label' => 'Integrasi Pembayaran Digital',
            'description' => 'Integrasi payment gateway, QRIS dinamis, dan rekonsiliasi otomatis.',
            'enabled' => false,
            'locked' => true,
        ],
    ],
];
