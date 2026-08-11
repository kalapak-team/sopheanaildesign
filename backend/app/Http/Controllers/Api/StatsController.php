<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\GalleryImage;
use App\Models\HeroSlide;
use App\Models\Promotion;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json($this->cachedStats());
    }

    /** @return array<string, mixed> */
    public function cachedStats(): array
    {
        return Cache::remember('admin.stats', 60, fn () => $this->buildStats());
    }

    /** @return array<string, mixed> */
    public function buildStats(): array
    {
        $now = Carbon::now();
        $from = $now->copy()->subDays(6)->startOfDay();

        $dayExpr = DB::connection()->getDriverName() === 'pgsql'
            ? '(created_at::date)'
            : 'DATE(created_at)';

        $countsByDay = ContactMessage::query()
            ->selectRaw("{$dayExpr} as day, COUNT(*) as aggregate")
            ->where('created_at', '>=', $from)
            ->groupBy(DB::raw($dayExpr))
            ->pluck('aggregate', 'day');

        $days = collect(range(6, 0))->map(function (int $ago) use ($now, $countsByDay) {
            $day = $now->copy()->subDays($ago)->startOfDay();
            $key = $day->toDateString();

            return [
                'date' => $key,
                'label' => $day->format('D'),
                'count' => (int) ($countsByDay[$key] ?? 0),
            ];
        })->values()->all();

        $unread = ContactMessage::query()->where('is_read', false)->count();
        $read = ContactMessage::query()->where('is_read', true)->count();
        $services = Service::query()->count();
        $categories = ServiceCategory::query()->count();
        $promotions = Promotion::query()->count();
        $heroSlides = HeroSlide::query()->count();
        $gallery = GalleryImage::query()->count();

        $recent = ContactMessage::query()
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'message', 'is_read', 'created_at'])
            ->map(fn (ContactMessage $m) => [
                'id' => $m->id,
                'name' => $m->name,
                'email' => $m->email,
                'message' => $m->message,
                'is_read' => (bool) $m->is_read,
                'created_at' => optional($m->created_at)?->toISOString() ?? (string) $m->created_at,
            ])
            ->values()
            ->all();

        return [
            'totals' => [
                'messages' => $unread + $read,
                'unread_messages' => $unread,
                'read_messages' => $read,
                'services' => $services,
                'categories' => $categories,
                'promotions' => $promotions,
                'hero_slides' => $heroSlides,
                'gallery' => $gallery,
            ],
            'messages_last_7_days' => $days,
            'message_status' => [
                ['label' => 'Unread', 'value' => $unread, 'color' => '#fc03a1'],
                ['label' => 'Read', 'value' => $read, 'color' => '#151515'],
            ],
            'content_mix' => [
                ['label' => 'Services', 'value' => $services],
                ['label' => 'Promos', 'value' => $promotions],
                ['label' => 'Slides', 'value' => $heroSlides],
                ['label' => 'Gallery', 'value' => $gallery],
            ],
            'recent_messages' => $recent,
        ];
    }
}
