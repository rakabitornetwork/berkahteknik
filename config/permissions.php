<?php

return [
    'roles' => [
        'owner' => ['*'],
        'admin' => ['*'],
        'cashier' => ['sales.manage', 'payments.manage', 'returns.manage', 'reports.view'],
        'purchasing' => ['suppliers.manage', 'purchase_orders.manage', 'stock.view', 'returns.manage'],
        'mechanic' => ['mechanic.jobs'],
    ],
];
