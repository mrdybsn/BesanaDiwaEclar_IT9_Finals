<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\GeocodingService;
use Illuminate\Http\Request;

class GeocodingController extends Controller
{
    public function geocode(Request $request)
    {
        $validated = $request->validate([
            'address' => ['required', 'string', 'max:500'],
        ]);

        $result = GeocodingService::geocode($validated['address']);

        if (!$result) {
            return response()->json([
                'message' => 'Could not find that address on the map. Try adding barangay, street, or landmark details.',
            ], 404);
        }

        return response()->json($result, 200);
    }
}
