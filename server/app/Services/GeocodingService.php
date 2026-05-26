<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingService
{
    /**
     * Geocode a free-text address (biased to Roxas City, Capiz, Philippines).
     *
     * @return array{lat: float, lng: float, display_name: string}|null
     */
    public static function geocode(string $address): ?array
    {
        $address = trim($address);
        if ($address === '') {
            return null;
        }

        $query = $address;
        if (!preg_match('/roxas|capiz|philippines/i', $address)) {
            $query .= ', Roxas City, Capiz, Philippines';
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => config('app.name', 'SoldiersThirst') . '/1.0 (delivery-geocoding)',
                ])
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q'              => $query,
                    'format'         => 'json',
                    'limit'          => 1,
                    'countrycodes'   => 'ph',
                    'addressdetails' => 0,
                ]);

            if (!$response->successful()) {
                return null;
            }

            $results = $response->json();
            if (empty($results[0])) {
                return null;
            }

            $hit = $results[0];

            return [
                'lat'          => (float) $hit['lat'],
                'lng'          => (float) $hit['lon'],
                'display_name' => $hit['display_name'] ?? $address,
            ];
        } catch (\Throwable $e) {
            Log::warning('Geocoding failed: ' . $e->getMessage());
            return null;
        }
    }
}
