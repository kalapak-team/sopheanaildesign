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
use Illuminate\Support\Facades\Cache;

class AdminBootstrapController extends Controller
{
    public function __invoke(Request $request, StatsController $stats)
    {
        $userId = (int) $request->user()->id;

        if ($request->boolean('fresh')) {
            self::forget($userId);
        }

        $payload = Cache::remember("admin.bootstrap.{$userId}", 60, function () use ($request, $stats) {
            return [
                'user' => $request->user(),
                'stats' => $stats->index()->getData(true),
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
            ];
        });

        // Always return fresh user (avatar/name may change)
        $payload['user'] = $request->user();

        return response()->json($payload);
    }

    public static function forget(?int $userId = null): void
    {
        if ($userId) {
            Cache::forget("admin.bootstrap.{$userId}");
        }
        Cache::forget('admin.stats');
    }
}
