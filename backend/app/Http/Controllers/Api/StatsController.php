<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
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
        return Cache::remember('admin.stats.v2', 60, fn () => $this->buildStats());
    }

    /** @return array<string, mixed> */
    public function buildStats(): array
    {
        $now = Carbon::now();
        $from = $now->copy()->subDays(6)->startOfDay();

        $dayExpr = DB::connection()->getDriverName() === 'pgsql'
            ? '(created_at::date)'
            : 'DATE(created_at)';

        // Parallel-ish cheap queries: day buckets + totals + recent + content counts
        $countsByDay = ContactMessage::query()
            ->selectRaw("{$dayExpr} as day, COUNT(*) as aggregate")
            ->where('created_at', '>=', $from)
            ->groupBy(DB::raw($dayExpr))
            ->pluck('aggregate', 'day');

        $msgTotals = ContactMessage::query()
            ->selectRaw('COUNT(*) as total, COALESCE(SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END), 0) as unread')
            ->first();

        $unread = (int) ($msgTotals->unread ?? 0);
        $totalMessages = (int) ($msgTotals->total ?? 0);
        $read = max(0, $totalMessages - $unread);

        $content = DB::selectOne('
            SELECT
                (SELECT COUNT(*) FROM services) AS services,
                (SELECT COUNT(*) FROM service_categories) AS categories,
                (SELECT COUNT(*) FROM promotions) AS promotions,
                (SELECT COUNT(*) FROM hero_slides) AS hero_slides,
                (SELECT COUNT(*) FROM gallery_images) AS gallery
        ');

        $services = (int) ($content->services ?? 0);
        $categories = (int) ($content->categories ?? 0);
        $promotions = (int) ($content->promotions ?? 0);
        $heroSlides = (int) ($content->hero_slides ?? 0);
        $gallery = (int) ($content->gallery ?? 0);

        $days = [];
        foreach (range(6, 0) as $ago) {
            $day = $now->copy()->subDays($ago)->startOfDay();
            $key = $day->toDateString();
            $days[] = [
                'date' => $key,
                'label' => $day->format('D'),
                'count' => (int) ($countsByDay[$key] ?? 0),
            ];
        }

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
                'messages' => $totalMessages,
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
