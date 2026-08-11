<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\AppCache;
use App\Models\OpeningHour;
use Illuminate\Http\Request;

class OpeningHourController extends Controller
{
    public function index()
    {
        return OpeningHour::query()->orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'day_label' => ['required', 'string', 'max:100'],
            'hours' => ['required', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $item = OpeningHour::query()->create($data);
        AppCache::flushAll();
        return response()->json($item, 201);
    }

    public function update(Request $request, OpeningHour $openingHour)
    {
        $data = $request->validate([
            'day_label' => ['sometimes', 'string', 'max:100'],
            'hours' => ['sometimes', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $openingHour->update($data);

        AppCache::flushAll();
        return response()->json($openingHour);
    }

    public function destroy(OpeningHour $openingHour)
    {
        $openingHour->delete();

        AppCache::flushAll();
        return response()->json(['message' => 'Deleted']);
    }
}
