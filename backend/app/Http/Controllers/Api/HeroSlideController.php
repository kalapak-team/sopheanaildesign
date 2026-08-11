<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\AppCache;
use App\Models\HeroSlide;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    public function index()
    {
        return HeroSlide::query()->orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image_path' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $item = HeroSlide::query()->create($data);
        AppCache::flushAll();
        return response()->json($item, 201);
    }

    public function update(Request $request, HeroSlide $heroSlide)
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image_path' => ['sometimes', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $heroSlide->update($data);

        AppCache::flushAll();
        return response()->json($heroSlide);
    }

    public function destroy(HeroSlide $heroSlide)
    {
        $heroSlide->delete();

        AppCache::flushAll();
        return response()->json(['message' => 'Deleted']);
    }
}
