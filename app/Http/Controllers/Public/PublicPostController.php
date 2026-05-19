<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\CmsPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicPostController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');

        $posts = CmsPost::published()
            ->ofType($type)
            ->orderByDesc('published_at')
            ->orderByDesc('sort_order')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Public/Posts/Index', [
            'posts' => $posts,
            'filters' => ['type' => $type],
            'types' => CmsPost::TYPES,
        ]);
    }

    public function show(string $slug)
    {
        $post = CmsPost::published()->where('slug', $slug)->firstOrFail();

        return Inertia::render('Public/Posts/Show', [
            'post' => $post,
        ]);
    }
}
