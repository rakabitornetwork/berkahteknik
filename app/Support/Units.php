<?php

namespace App\Support;

class Units
{
    public const OPTIONS = [
        'pcs',
        'liter',
        'set',
        'meter',
        'kg',
        'cc',
        'job',
    ];

    public static function validationRule(bool $required = true): string
    {
        $rule = $required ? 'required' : 'nullable';

        return $rule.'|string|in:'.implode(',', self::OPTIONS);
    }

    public static function normalize(?string $unit, string $default = 'pcs'): string
    {
        $unit = strtolower(trim((string) $unit));

        return in_array($unit, self::OPTIONS, true) ? $unit : $default;
    }
}
