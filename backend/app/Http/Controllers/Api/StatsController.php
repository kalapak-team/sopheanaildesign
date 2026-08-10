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

class StatsController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $days = collect(range(6, 0))->map(function (int $ago) use ($now) {
            $day = $now->copy()->subDays($ago)->startOfDay();

            return [
                'date' => $day->toDateString(),
                'label' => $day->format('D'),
                'count' => ContactMessage::query()
                    ->whereDate('created_at', $day)
                    ->count(),
            ];
        });

        $unread = ContactMessage::query()->where('is_read', false)->count();
        $read = ContactMessage::query()->where('is_read', true)->count();

        return response()->json([
            'totals' => [
                'messages' => ContactMessage::query()->count(),
                'unread_messages' => $unread,
                'read_messages' => $read,
                'services' => Service::query()->count(),
                'categories' => ServiceCategory::query()->count(),
                'promotions' => Promotion::query()->count(),
                'hero_slides' => HeroSlide::query()->count(),
                'gallery' => GalleryImage::query()->count(),
            ],
            'messages_last_7_days' => $days,
            'message_status' => [
                ['label' => 'Unread', 'value' => $unread, 'color' => '#fc03a1'],
                ['label' => 'Read', 'value' => $read, 'color' => '#151515'],
            ],
            'content_mix' => [
                ['label' => 'Services', 'value' => Service::query()->count()],
                ['label' => 'Promos', 'value' => Promotion::query()->count()],
                ['label' => 'Slides', 'value' => HeroSlide::query()->count()],
                ['label' => 'Gallery', 'value' => GalleryImage::query()->count()],
            ],
            'recent_messages' => ContactMessage::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'message', 'is_read', 'created_at']),
        ]);
    }
}
