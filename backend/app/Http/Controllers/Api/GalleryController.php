<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\AppCache;
use App\Models\GalleryImage;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        return GalleryImage::query()->orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'image_path' => ['required', 'string'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $item = GalleryImage::query()->create($data);
        AppCache::flushAll();
        return response()->json($item, 201);
    }

    public function update(Request $request, GalleryImage $gallery)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'image_path' => ['sometimes', 'string'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $gallery->update($data);

        AppCache::flushAll();
        return response()->json($gallery);
    }

    public function destroy(GalleryImage $gallery)
    {
        $gallery->delete();

        AppCache::flushAll();
        return response()->json(['message' => 'Deleted']);
    }
}
