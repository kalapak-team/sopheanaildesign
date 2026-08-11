<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use App\Models\OpeningHour;
use App\Models\Promotion;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class SiteController extends Controller
{
    public function index()
    {
        $payload = Cache::remember('site.public.v2', 120, function () {
            // Plain arrays only — never cache Eloquent/Support Collections
            // (file/db cache can unserialize them as __PHP_Incomplete_Class).
            return [
                'settings' => SiteSetting::query()->pluck('value', 'key')->all(),
                'hero_slides' => HeroSlide::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get(['id', 'title', 'subtitle', 'image_path', 'sort_order', 'is_active'])
                    ->toArray(),
                'categories' => [],
                'promotions' => Promotion::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get([
                        'id',
                        'title',
                        'highlight',
                        'price',
                        'currency',
                        'description',
                        'image_path',
                        'header_style',
                        'is_featured',
                        'sort_order',
                        'is_active',
                    ])
                    ->toArray(),
                'gallery' => [],
                'opening_hours' => OpeningHour::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get(['id', 'day_label', 'hours', 'sort_order', 'is_active'])
                    ->toArray(),
            ];
        });

        return response()
            ->json($payload)
            ->header('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300');
    }
}
