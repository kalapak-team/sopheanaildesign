<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\HeroSlideController;
use App\Http\Controllers\Api\OpeningHourController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SiteController;
use Illuminate\Support\Facades\Route;

Route::get('/site', [SiteController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/admin/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/categories', [ServiceController::class, 'categories']);
    Route::post('/categories', [ServiceController::class, 'storeCategory']);
    Route::put('/categories/{category}', [ServiceController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [ServiceController::class, 'destroyCategory']);

    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::post('/promotions', [PromotionController::class, 'store']);
    Route::put('/promotions/{promotion}', [PromotionController::class, 'update']);
    Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy']);

    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{gallery}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);

    Route::get('/hero-slides', [HeroSlideController::class, 'index']);
    Route::post('/hero-slides', [HeroSlideController::class, 'store']);
    Route::put('/hero-slides/{heroSlide}', [HeroSlideController::class, 'update']);
    Route::delete('/hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy']);

    Route::get('/opening-hours', [OpeningHourController::class, 'index']);
    Route::post('/opening-hours', [OpeningHourController::class, 'store']);
    Route::put('/opening-hours/{openingHour}', [OpeningHourController::class, 'update']);
    Route::delete('/opening-hours/{openingHour}', [OpeningHourController::class, 'destroy']);

    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update']);

    Route::get('/messages', [ContactController::class, 'index']);
    Route::put('/messages/{contact}/read', [ContactController::class, 'markRead']);
    Route::delete('/messages/{contact}', [ContactController::class, 'destroy']);
});
