<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\AppCache;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'message' => ['required', 'string'],
        ]);

        $message = ContactMessage::query()->create($data);

        AppCache::flushAll();
        return response()->json([
            'message' => 'Thank you! Your submission has been received!',
            'data' => $message,
        ], 201);
    }

    public function index()
    {
        return ContactMessage::query()->latest()->get();
    }

    public function markRead(ContactMessage $contact)
    {
        $contact->update(['is_read' => true]);

        AppCache::flushAll();
        return response()->json($contact);
    }

    public function destroy(ContactMessage $contact)
    {
        $contact->delete();

        AppCache::flushAll();
        return response()->json(['message' => 'Deleted']);
    }
}
