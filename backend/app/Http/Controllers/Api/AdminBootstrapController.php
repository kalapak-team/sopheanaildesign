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

        // Optional: ?only=stats|messages|categories|… for lazy tab loads
        $only = $request->query('only');
        if (is_string($only) && $only !== '') {
            return response()->json($this->partial($only, $request, $stats));
        }

        $payload = Cache::remember("admin.bootstrap.v2.{$userId}", 60, function () use ($request, $stats) {
            return $this->fullPayload($request, $stats);
        });

        $payload['user'] = $request->user()?->only(['id', 'name', 'email', 'role', 'avatar']);

        return response()->json($payload);
    }

    /** @return array<string, mixed> */
    private function partial(string $only, Request $request, StatsController $stats): array
    {
        return match ($only) {
            'stats' => [
                'stats' => $stats->cachedStats(),
                'user' => $request->user()?->only(['id', 'name', 'email', 'role', 'avatar']),
            ],
            'messages' => [
                'messages' => ContactMessage::query()
                    ->latest()
                    ->limit(50)
                    ->get(['id', 'name', 'email', 'phone', 'message', 'is_read', 'created_at'])
                    ->toArray(),
            ],
            'categories' => [
                'categories' => ServiceCategory::query()
                    ->with(['services' => fn ($q) => $q->orderBy('sort_order')])
                    ->orderBy('sort_order')
                    ->get()
                    ->toArray(),
            ],
            'promotions' => [
                'promotions' => Promotion::query()->orderBy('sort_order')->get()->toArray(),
            ],
            'opening_hours' => [
                'opening_hours' => OpeningHour::query()->orderBy('sort_order')->get()->toArray(),
            ],
            'settings' => [
                'settings' => SiteSetting::query()->pluck('value', 'key')->all(),
            ],
            'hero_slides' => [
                'hero_slides' => HeroSlide::query()->orderBy('sort_order')->get()->toArray(),
            ],
            'gallery' => [
                'gallery' => GalleryImage::query()->orderBy('sort_order')->get()->toArray(),
            ],
            default => ['message' => 'Unknown only='.$only],
        };
    }

    /** @return array<string, mixed> */
    private function fullPayload(Request $request, StatsController $stats): array
    {
        return [
            'user' => $request->user()?->only(['id', 'name', 'email', 'role', 'avatar']),
            'stats' => $stats->cachedStats(),
            'messages' => ContactMessage::query()
                ->latest()
                ->limit(50)
                ->get(['id', 'name', 'email', 'phone', 'message', 'is_read', 'created_at'])
                ->toArray(),
            'categories' => ServiceCategory::query()
                ->with(['services' => fn ($q) => $q->orderBy('sort_order')])
                ->orderBy('sort_order')
                ->get()
                ->toArray(),
            'promotions' => Promotion::query()->orderBy('sort_order')->get()->toArray(),
            'opening_hours' => OpeningHour::query()->orderBy('sort_order')->get()->toArray(),
            'settings' => SiteSetting::query()->pluck('value', 'key')->all(),
            'hero_slides' => HeroSlide::query()->orderBy('sort_order')->get()->toArray(),
            'gallery' => GalleryImage::query()->orderBy('sort_order')->get()->toArray(),
        ];
    }

    public static function forget(?int $userId = null): void
    {
        if ($userId) {
            Cache::forget("admin.bootstrap.{$userId}");
            Cache::forget("admin.bootstrap.v2.{$userId}");
        }
        Cache::forget('admin.stats');
        Cache::forget('admin.stats.v2');
        Cache::forget('site.public');
        Cache::forget('site.public.v2');
    }
}
