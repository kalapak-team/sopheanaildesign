<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function categories()
    {
        return ServiceCategory::query()
            ->with(['services' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:service_categories,slug'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        return response()->json(ServiceCategory::query()->create($data), 201);
    }

    public function updateCategory(Request $request, ServiceCategory $category)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:service_categories,slug,'.$category->id],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $category->update($data);

        return response()->json($category->fresh('services'));
    }

    public function destroyCategory(ServiceCategory $category)
    {
        $category->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'price' => ['nullable', 'numeric'],
            'is_from_price' => ['boolean'],
            'price_prefix' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        return response()->json(Service::query()->create($data), 201);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'service_category_id' => ['sometimes', 'exists:service_categories,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'price' => ['nullable', 'numeric'],
            'is_from_price' => ['boolean'],
            'price_prefix' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $service->update($data);

        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
