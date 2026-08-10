<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class MediaController extends Controller
{
    /** Max upload size in kilobytes (50 MB) */
    public const MAX_KB = 51200;

    public function store(Request $request)
    {
        if (! $request->hasFile('file')) {
            $contentLength = (int) $request->server('CONTENT_LENGTH', 0);
            $postMax = $this->iniBytes('post_max_size');
            if ($contentLength > 0 && $postMax > 0 && $contentLength > $postMax) {
                throw ValidationException::withMessages([
                    'file' => [
                        'Datei zu gross für den Server (PHP post_max_size). Bitte Bild unter 50 MB wählen oder Server-Limit erhöhen.',
                    ],
                ]);
            }

            throw ValidationException::withMessages([
                'file' => ['Keine Datei erhalten. Bitte erneut versuchen (max. 50 MB, JPG/PNG/WebP).'],
            ]);
        }

        $data = $request->validate([
            'file' => ['required', 'file', 'image', 'max:'.self::MAX_KB],
            'folder' => ['nullable', 'string', 'max:50'],
        ], [
            'file.required' => 'Bitte eine Bilddatei wählen.',
            'file.image' => 'Nur Bilddateien sind erlaubt (JPG, PNG, WebP, GIF).',
            'file.max' => 'Bild darf maximal 50 MB gross sein.',
        ]);

        $diskName = (string) config('filesystems.media', 'public');
        $disk = Storage::disk($diskName);

        $folder = preg_replace('/[^a-z0-9\-_]/i', '', $data['folder'] ?? 'uploads') ?: 'uploads';
        $file = $data['file'];
        $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $name = Str::uuid()->toString().'.'.$ext;
        $directory = "uploads/{$folder}";

        try {
            $key = $disk->putFileAs($directory, $file, $name, [
                'visibility' => 'public',
                'ContentType' => $file->getMimeType() ?: 'application/octet-stream',
            ]);
        } catch (Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'file' => [
                    'Upload fehlgeschlagen ('.$diskName.'). Prüfe R2 Credentials / Bucket Public Access.',
                ],
            ]);
        }

        if (! $key) {
            throw ValidationException::withMessages([
                'file' => ['Upload fehlgeschlagen — Datei konnte nicht gespeichert werden.'],
            ]);
        }

        $url = $this->publicUrl($diskName, $key);
        $path = $diskName === 'public' ? '/storage/'.$key : $url;

        return response()->json([
            'path' => $path,
            'url' => $url,
            'disk' => $diskName,
            'key' => $key,
            'folder' => $folder,
            'filename' => $name,
        ], 201);
    }

    private function publicUrl(string $diskName, string $key): string
    {
        if ($diskName === 'public') {
            return rtrim((string) config('app.url'), '/').'/storage/'.$key;
        }

        $base = rtrim((string) config("filesystems.disks.{$diskName}.url"), '/');
        if ($base !== '') {
            return $base.'/'.ltrim($key, '/');
        }

        return Storage::disk($diskName)->url($key);
    }

    private function iniBytes(string $key): int
    {
        $val = trim((string) ini_get($key));
        if ($val === '') {
            return 0;
        }
        $unit = strtolower(substr($val, -1));
        $num = (float) $val;

        return (int) match ($unit) {
            'g' => $num * 1024 * 1024 * 1024,
            'm' => $num * 1024 * 1024,
            'k' => $num * 1024,
            default => $num,
        };
    }
}
