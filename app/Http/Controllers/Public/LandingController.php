<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\CmsPost;
use App\Services\ShopSettingService;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index(ShopSettingService $shopService)
    {
        $landing = $shopService->landingForFrontend();
        $latestPosts = collect();

        if ($landing['show_latest_posts']) {
            $latestPosts = CmsPost::published()
                ->orderByDesc('published_at')
                ->orderByDesc('sort_order')
                ->orderByDesc('created_at')
                ->limit($landing['posts_limit'])
                ->get(['id', 'title', 'slug', 'type', 'excerpt', 'cover_image_path', 'published_at']);
        }

        return Inertia::render('Public/Landing', [
            'landing' => $landing,
            'latestPosts' => $latestPosts,
        ]);
    }
}
