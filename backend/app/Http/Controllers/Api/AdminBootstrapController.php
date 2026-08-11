<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\GalleryImage;
use App\Models\HeroSlide;
use App\Models\OpeningHour;
use App\Models\Promotion;
use App\Models\ServiceCategory;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class AdminBootstrapController extends Controller
{
    public function __invoke(Request $request, StatsController $stats)
    {
        $statsPayload = $stats->index()->getData(true);

        return response()->json([
            'user' => $request->user(),
            'stats' => $statsPayload,
            'messages' => ContactMessage::query()->latest()->get(),
            'categories' => ServiceCategory::query()
                ->with(['services' => fn ($q) => $q->orderBy('sort_order')])
                ->orderBy('sort_order')
                ->get(),
            'promotions' => Promotion::query()->orderBy('sort_order')->get(),
            'opening_hours' => OpeningHour::query()->orderBy('sort_order')->get(),
            'settings' => SiteSetting::query()->pluck('value', 'key'),
            'hero_slides' => HeroSlide::query()->orderBy('sort_order')->get(),
            'gallery' => GalleryImage::query()->orderBy('sort_order')->get(),
        ]);
    }
}
