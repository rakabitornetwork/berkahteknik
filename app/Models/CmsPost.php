<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CmsPost extends Model
{
    public const TYPES = ['berita', 'promo', 'informasi'];

    protected $fillable = [
        'title',
        'slug',
        'type',
        'excerpt',
        'body',
        'cover_image_path',
        'is_published',
        'published_at',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'sort_order' => 'integer',
    ];

    protected $appends = ['cover_url'];

    public function getCoverUrlAttribute(): ?string
    {
        if (! $this->cover_image_path) {
            return null;
        }

        $path = ltrim($this->cover_image_path, '/');
        $filename = basename($path);
        $bundled = 'images/cms/'.$filename;

        // Cover bawaan ikut repo (public/images/cms), supaya tampil di VPS tanpa storage:link.
        if (is_file(public_path($bundled))) {
            return asset($bundled);
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        return Storage::disk('public')->url($path);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->where(function (Builder $q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }

    public function scopeOfType(Builder $query, ?string $type): Builder
    {
        if ($type && in_array($type, self::TYPES, true)) {
            $query->where('type', $type);
        }

        return $query;
    }

    public static function generateSlug(string $title, ?int $exceptId = null): string
    {
        $base = Str::slug($title) ?: 'post';
        $slug = $base;
        $n = 1;

        while (static::query()
            ->when($exceptId, fn ($q) => $q->where('id', '!=', $exceptId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base.'-'.$n++;
        }

        return $slug;
    }
}
