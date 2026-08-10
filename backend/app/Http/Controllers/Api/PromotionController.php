<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        return Promotion::query()->orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'highlight' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric'],
            'currency' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string'],
            'header_style' => ['nullable', 'in:dark,pink'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        return response()->json(Promotion::query()->create($data), 201);
    }

    public function update(Request $request, Promotion $promotion)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'highlight' => ['nullable', 'string', 'max:255'],
            'price' => ['sometimes', 'numeric'],
            'currency' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string'],
            'header_style' => ['nullable', 'in:dark,pink'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $promotion->update($data);

        return response()->json($promotion);
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
