<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Models\HeroSlide;
use App\Models\OpeningHour;
use App\Models\Promotion;
use App\Models\ServiceCategory;
use App\Models\SiteSetting;

class SiteController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::query()->pluck('value', 'key');

        return response()->json([
            'settings' => $settings,
            'hero_slides' => HeroSlide::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'categories' => ServiceCategory::query()
                ->where('is_active', true)
                ->with(['services' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')])
                ->orderBy('sort_order')
                ->get(),
            'promotions' => Promotion::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'gallery' => GalleryImage::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'opening_hours' => OpeningHour::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }
}
