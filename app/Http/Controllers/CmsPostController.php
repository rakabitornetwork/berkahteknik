<?php

namespace App\Http\Controllers;

use App\Models\CmsPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CmsPostController extends Controller
{
    public function index(Request $request)
    {
        $posts = CmsPost::query()
            ->when($request->search, fn ($q) => $q->where(function ($query) use ($request) {
                $query->where('title', 'like', "%{$request->search}%")
                    ->orWhere('excerpt', 'like', "%{$request->search}%");
            }))
            ->when($request->type, fn ($q) => $q->ofType($request->type))
            ->when($request->status === 'published', fn ($q) => $q->where('is_published', true))
            ->when($request->status === 'draft', fn ($q) => $q->where('is_published', false))
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Cms/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'type', 'status']),
            'types' => CmsPost::TYPES,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Cms/Posts/Form', [
            'types' => CmsPost::TYPES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePost($request);
        $validated['slug'] = CmsPost::generateSlug($validated['slug'] ?: $validated['title']);

        if ($request->hasFile('cover')) {
            $validated['cover_image_path'] = $request->file('cover')->store('cms', 'public');
        }

        unset($validated['cover']);

        $validated['is_published'] = $request->boolean('is_published');

        if ($validated['is_published'] && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        CmsPost::create($validated);

        return redirect()->route('admin.cms.posts.index')
            ->with('success', 'Konten berhasil ditambahkan.');
    }

    public function edit(CmsPost $post)
    {
        return Inertia::render('Admin/Cms/Posts/Form', [
            'post' => $post,
            'types' => CmsPost::TYPES,
        ]);
    }

    public function update(Request $request, CmsPost $post)
    {
        $validated = $this->validatePost($request, $post->id);
        $validated['slug'] = CmsPost::generateSlug($validated['slug'] ?: $validated['title'], $post->id);

        if ($request->hasFile('cover')) {
            if ($post->cover_image_path) {
                Storage::disk('public')->delete($post->cover_image_path);
            }
            $validated['cover_image_path'] = $request->file('cover')->store('cms', 'public');
        }

        unset($validated['cover']);

        $validated['is_published'] = $request->boolean('is_published');

        if ($validated['is_published'] && empty($validated['published_at'])) {
            $validated['published_at'] = $post->published_at ?? now();
        }

        if (! $validated['is_published']) {
            $validated['published_at'] = null;
        }

        $post->update($validated);

        return redirect()->route('admin.cms.posts.index')
            ->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroy(CmsPost $post)
    {
        if ($post->cover_image_path) {
            Storage::disk('public')->delete($post->cover_image_path);
        }

        $post->delete();

        return redirect()->route('admin.cms.posts.index')
            ->with('success', 'Konten berhasil dihapus.');
    }

    private function validatePost(Request $request, ?int $exceptId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'type' => 'required|in:'.implode(',', CmsPost::TYPES),
            'excerpt' => 'nullable|string|max:500',
            'body' => 'nullable|string',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'sort_order' => 'nullable|integer|min:0|max:9999',
            'cover' => 'nullable|image|max:4096',
        ]);
    }
}
