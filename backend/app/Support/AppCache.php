<?php

namespace App\Support;

use App\Http\Controllers\Api\AdminBootstrapController;
use Illuminate\Support\Facades\Cache;

final class AppCache
{
    public static function flushAdmin(?int $userId = null): void
    {
        AdminBootstrapController::forget($userId);
    }

    public static function flushSite(): void
    {
        Cache::forget('site.public');
        Cache::forget('site.public.v2');
    }

    public static function flushAll(?int $userId = null): void
    {
        self::flushAdmin($userId);
        self::flushSite();
    }
}
